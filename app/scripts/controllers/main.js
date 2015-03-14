'use strict';

/**
 * @ngdoc function
 * @name bikeMapApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bikeMapApp
 */
angular.module('bikeMapApp')
  .controller('MainCtrl', function ($scope, $location, $firebaseObject, localStorageService) {

 



  $scope.$on('mapInitialized', function(event, map) {

  $scope.map = { 
    coords: '41.322907,-122.274731 ',
    zoom: '13',
    type: "TERRAIN"
  }
  $scope.myMap = map;
  $scope.bikeMenu = false;
}); //end mapInitialized


$scope.myTrails = [];

var geoXml = null;
var geoXmlDoc = [];

var layers = [
      './layers/gateway.kml', 
      './layers/8-mile.kml', 
      './layers/4-mile.kml', 
      './layers/bunny-flat.kml', 
      './layers/bone-crusher.kml', 
      './layers/bear-springs.kml', 
      './layers/everitt-bear-springs.kml',  
      './layers/nawr.kml', 
      './layers/cliff-hanger-lower.kml', 
      './layers/sisson-callahan.kml',
      './layers/5-mile.kml', 
      './layers/marley.kml', 
      ]



// $.each($scope.myTrails, function(index, val) {
//    addToLocalStorage(index, obj)
// });

// var addToLocalStorage = function(key, val) {
//   if(localStorageService.isSupported) {
//    var tmp = JSON.stringify(val)
//       return localStorageService.set(key, val);
//   } else {
//     console.log("boo not supported");
//   }
// }
// var lsKeys = localStorageService.keys();
// $.each(lsKeys, function(index, val) {
//  getItem(key)
// });

// function getItem(key) {
//    return localStorageService.get(key);
//   }

geoXml = new geoXML3.parser({
        map: $scope.myMap,
        processStyles: true,
        suppressInfoWindows: true,
        afterParse: useTheData
       });


geoXml.parse(layers);


function useTheData(doc){
  for (var l = 0; l<doc.length; l++){
    geoXmlDoc[l] = doc[l];
    doc[l].doc = l;
    
      $scope.myTrails.push(
        {
          map: $scope.myMap,
          doc: l,
          category: doc[l].placemarks[1].category,
          layer:doc[l], 
          name: $.trim(doc[l].placemarks[1].name),
          visible: true,
          trail: doc[l].placemarks[1].polyline,
        });
      $scope.$apply()


    for (var i = 0; i < geoXmlDoc[l].placemarks.length; i++) {
      var placemark = geoXmlDoc[l].placemarks[i];    
      if (placemark.polyline) {
        var normalStyle = {
            strokeColor: placemark.polyline.get('strokeColor'),
            strokeWeight: placemark.polyline.get('strokeWeight'),
            strokeOpacity: placemark.polyline.get('strokeOpacity'),
            };
        
        placemark.polyline.normalStyle = normalStyle;
        highlightPoly(placemark.polyline, i, geoXmlDoc[l], l );
      }

      if (placemark.marker) {
        if (placemark.marker.id == "start") {
          placemark.marker.setOptions({map: $scope.myMap, icon: "images/start-flag.png", scale: 0.5})
          }
        if (placemark.marker.id == "end") {
          placemark.marker.setOptions({map: $scope.myMap, icon: "images/end-flag.png"})
        }
        if (placemark.marker.id == "loop") {
          placemark.marker.setOptions({map: $scope.myMap, icon: "images/loop-flag.png"})
        }   
        highlightMarker(placemark.marker, i, geoXmlDoc[l] ) 
      };// end if marker


    };//end placemarks for loop
    $scope.showDocument(geoXmlDoc[l])
  };//end doc for loop
};//end use the data
//========================================================================================================================
//========================================================================================================================
//========================================================================================================================
var ref = new Firebase("https://bike-map.firebaseio.com/comments/trail");

var obj = $firebaseObject(ref);
  obj.$loaded().then(function() {
  $('.comment-section').html("");
  $scope.addComments();
  return obj;
});


$scope.addComments = function() {
  for (var i in $scope.myTrails) {
    angular.forEach(obj, function(key, value){
      if (value == $scope.myTrails[i].name){
       $scope.myTrails[i].comments = key;
      }
    });
  }
};

$scope.newComment = function(){
  var newCommentNumber = ($scope.numberOfComments + 1);
  var trailRef = ref.child($scope.currentHighlightedLayer.name+'/c'+newCommentNumber).set({comment: "new Comment", name: "Marley - Bob", date: "March 13, 2015"});
  console.log(trailRef)
  
}


//========================================================================================================================
//========================================================================================================================
//========================================================================================================================





$scope.toggleTrail = function(visible, trail){
  if ( visible == true ) {
     $scope.showDocument(geoXmlDoc[trail]);   
  } else {
     $scope.hideDocument(geoXmlDoc[trail]);
  };
};



$scope.showDocument = function (doc) {
    if (!doc) doc = doc[0];
    // Show the map objects associated with a document
    var i;
    if (!!doc.markers) {
      for (i = 0; i < doc.markers.length; i++) {
        doc.markers[i].setVisible(true);
      }
    }
    if (!!doc.ggroundoverlays) {
      for (i = 0; i < doc.ggroundoverlays.length; i++) {
        doc.ggroundoverlays[i].setOpacity(doc.ggroundoverlays[i].percentOpacity_);
      }
    }
    if (!!doc.gpolylines) {
      for (i=0;i<doc.gpolylines.length;i++) {
        doc.gpolylines[i].setMap($scope.myMap);
      }
    }
    if (!!doc.gpolygons) {
      for (i=0;i<doc.gpolygons.length;i++) {
        doc.gpolygons[i].setMap($scope.myMap);
    }
  }
};

$scope.hideDocument = function (doc) {
  if (!doc) doc = doc[0];
  // Hide the map objects associated with a document
  var i;

  if (!!doc.markers) {
    for (i = 0; i < doc.markers.length; i++) {
      if(!!doc.markers[i].infoWindow) doc.markers[i].infoWindow.close();
      doc.markers[i].setVisible(false);
    }
  }
  if (!!doc.ggroundoverlays) {
    for (i = 0; i < doc.ggroundoverlays.length; i++) {
      doc.ggroundoverlays[i].setOpacity(0);
    }
  }
  if (!!doc.gpolylines) {
    for (i=0;i<doc.gpolylines.length;i++) {
      if(!!doc.gpolylines[i].infoWindow) doc.gpolylines[i].infoWindow.close();
      doc.gpolylines[i].setMap(null);
    }
  }
  if (!!doc.gpolygons) {
    for (i=0;i<doc.gpolygons.length;i++) {
      if(!!doc.gpolygons[i].infoWindow) doc.gpolygons[i].infoWindow.close();
      doc.gpolygons[i].setMap(null);
    }
  }
};

var highlightOptions = {fillColor: "#FFFFFF",Color: "#FFFFFF", strokeColor: "#083972", fillOpacity: 0.9, strokeWidth: 10};
var highlightLineOptions = {strokeColor: "#fa5519", strokeWidth: 10, color: "#ffffff"};
var hidden = {visibility: 0};

var on = false;

function highlightPoly(poly, polynum, layer, layerNumber) {
  google.maps.event.addListener(poly,"click",function() {
    $scope.displayInfo(poly)
    $scope.currentHighlightedLayer = $scope.myTrails[layer.doc];
    $scope.hideOtherMarkers(layer);
    $('.comment-section').html("")
    $scope.showComments(layer, layerNumber)
  }); 
}8 

function highlightMarker(marker, polynum, layer, layerNumber) {
  google.maps.event.addListener(marker,"click",function() {
    var trail = layer.placemarks[1].polyline;
    $scope.displayInfo(trail, marker);
    $scope.currentHighlightedLayer = $scope.myTrails[layer.doc];
    $scope.hideOtherMarkers(layer);
    $('.comment-section').html("")
    $scope.showComments(layer)
      
  });
};


$scope.showComments = function(layer){
  // $('#sidr-left .layer-comments').text(comments); 
  var d = new Date();
  d = d.toString();

  
  var layercomments = $scope.myTrails[layer.doc].comments;
  $scope.numberOfComments = 0
  
     angular.forEach(layercomments, function(key, value){
        $scope.numberOfComments++;
        console.log(layercomments)
        $('.comment-section').append("<div class='comment-box'><span class='username'>"+key.name+" said:</span><br>"+"<span class='comment'>"+key.comment+"</span><br><span class='date'>"+key.date+"</div><br><br>");
        $('.numberOfComments').html($scope.numberOfComments);
    })
}


$scope.hideOtherMarkers = function(layer){
  for (var i=0; i < $scope.myTrails.length; i++){
    var m = 0;
    while (typeof geoXmlDoc[i].markers[m] != 'undefined'){
        geoXmlDoc[i].markers[m].setMap($scope.myMap);
        m++;
    }
  }
  if(typeof(layer) !== 'undefined'){
    for (var i=0; i < $scope.myTrails.length; i++){
      if (geoXmlDoc[i].doc != layer.doc ){
        var m = 0;
        while (typeof geoXmlDoc[i].markers[m] != 'undefined'){
            geoXmlDoc[i].markers[m].setMap(null);
            m++;
        }
      }
    }
  } 
return;
};




$scope.displayInfo = function(poly, layer){
    if (!!$scope.highlightedLayer){
      $scope.unHighlightPoly($scope.highlightedLayer);
      $scope.highlightedLayer = null;
    }
    if (on === false){
      poly.setOptions(highlightLineOptions);
      $scope.highlightedLayer = poly;
      on = !on;
      showInContextWindow(poly.title, poly.description, poly.distance)
      $.sidr('open', 'sidr-left');
    } else {
      $scope.unHighlightPoly(poly)
      $scope.sidrClose(on, poly)
    }
    $scope.hideOtherMarkers(layer);
};

$scope.unHighlightPoly = function(poly) {
  poly.setOptions(poly.normalStyle);
  on = !on;
    
  $scope.currentHighlightedLayer = null;
};




// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================



$scope.tracking = false;

$scope.getLocation = function(){
	$scope.tracking = !$scope.tracking;
	locationBtn();
	findLocation($scope.tracking);

}

var locationBtn = function(){
  if ($scope.tracking){
    $('.tracking-text').css('display', 'none');
    $('.loader').css('display', 'inline-block');
  } else {
    $('.tracking-text').css('display', 'inline-block');
    $('.tracking-icon').css('display', 'none');
  }
	$('.tracking-btn').toggleClass('btn-success');
}

var findLocation = function(value){
  var options = {frequency: 10000};
  if (value === true) {
  	$scope.locationMarker = null;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function( position ){
          if ($scope.locationMarker){

            return;
          }
          $('.loader').css('display', 'none');
          $('.tracking-icon').css('display', 'inline-block');
          // Add a marker to the map using the position.
          updateMapPosition(position.coords.latitude,position.coords.longitude);
          $scope.locationMarker = addLocationMarker(position.coords.latitude,position.coords.longitude);
        },
        function( error ){
          console.log( "Something went wrong: ", error );
        },
        {
          timeout: (5 * 1000),
          maximumAge: (1000 * 60 * 15),
          enableHighAccuracy: true
        });

      $scope.positionTimer = navigator.geolocation.watchPosition(
          function( position ){
              updateMarker($scope.locationMarker, position.coords.latitude,position.coords.longitude);
          }
      );


      // If the position hasn't updated within 5 minutes, stop
      // monitoring the position for changes.
      setTimeout(
          function(){
              // Clear the position watcher.
              navigator.geolocation.clearWatch( $scope.positionTimer );
          },
          (1000 * 60 * 5)
      );

  }
	} else {
		//toggle location off
		navigator.geolocation.clearWatch( $scope.positionTimer );
		removeLocationMarker($scope.locationMarker);
	}
}  

//========================================================================================================================
//========================================================================================================================
//========================================================================================================================


function addLocationMarker( latitude, longitude){
  var marker = new google.maps.Marker({
      map: $scope.myMap,
      position: new google.maps.LatLng(
          latitude,
          longitude
      ),
  });

  
    var myLat = latitude.toString().substring(0,13);
    var myLong = longitude.toString().substring(0,13);
    var content = "Lat: "+ myLat + '<br>' + "Long: "+ myLong  ;
    addInfoWindow(marker, content);

  return( marker );
}

function addInfoWindow(marker, content) {
    var infoWindow = new google.maps.InfoWindow({
        content: content,
        boxStyle: {
                width: "220px"
        },
    });

    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open($scope.myMap, marker);
    });
}



function removeLocationMarker( marker ) {
	marker.setMap(null);
}

function updateMarker( marker, latitude, longitude){
  // Update the position.
  marker.setPosition(
      new google.maps.LatLng(
          latitude,
          longitude
      )
  );
  // updateMapPosition(latitude, longitude);
}

function updateMapPosition(latitude, longitude){
	    var latLng = new google.maps.LatLng(latitude, longitude);
    	$scope.myMap.panTo(latLng);
};


//========================================================================================================================
//========================================================================================================================
//========================================================================================================================



//========================================================================================================================
//========================================================================================================================
//========================================================================================================================





  $('#simple-menu').sidr({
      name:"sidr-left",
      displace: false,
      side: "left",
      onOpen: function() {
        $scope.bikeMenu = true;
      },
      onClose: function(){
        $scope.bikeMenu = false;
      }
    });
  $('#menu').sidr({
      name:"sidr-right",
      displace: false,
      side: "right",
    });

  var on = false;


var showInContextWindow = function(title, description, distance, comments) {
  $('#sidr-left .layer-title').text(title);
  $('#sidr-left .layer-description').text(description);	
  $('#sidr-left .layer-distance').text(distance);
};//end showincontext

$scope.sidrClose = function(poly){
  if (poly){
    $scope.unHighlightPoly(poly);
    $scope.highlightedLayer = null;
    $scope.hideOtherMarkers();
  }

  $.sidr('close', 'sidr-left');
  $('#sidr-left .layer-title').text("");
  $('#sidr-left .layer-description').text("");
  $('#sidr-left .layer-distance').text("");
  $('.comment-section').html("")
  if ($scope.sidrExpand() == true){
    $scope.sidrExpand();
  } else {
    return;
  }
}
$scope.sidrCloseRight = function(){
  $.sidr('close', 'sidr-right');
}
//========================================================================================================================
//========================================================================================================================
//========================================================================================================================


$scope.sidrExpand = function () {
  $('#sidr-left').toggleClass('expand');
  if($('#sidr-left').hasClass('expand')){
    $('#sidr-left').animate({height: "75%"}, 500 );
    $('.sidr-expand').css({transform: 'rotate(180deg)'});
    return true;
  } else {
    $('#sidr-left').animate({height: "150px"}, 500 );
    $('.sidr-expand').css({transform: 'rotate(0deg)'});
    return false;
  }
}

        $scope.changeView = function(view){
            $scope.sidrCloseRight();
            $location.path(view); // path not hash
        }
    

});//end mainCtrl
