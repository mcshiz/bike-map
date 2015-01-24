'use strict';

/**
 * @ngdoc function
 * @name bikeMapApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bikeMapApp
 */
angular.module('bikeMapApp')
  .controller('MainCtrl', function ($scope) {





  $scope.$on('mapInitialized', function(event, map) {

  $scope.map = { 
    coords: '41.322907,-122.274731 ',
    zoom: '13',
    type: "TERRAIN"
  }
  $scope.myMap = map;
  console.log("init'ing")
  $scope.bikeMenu = false;
}); //end mapInitialized


$scope.dhTrails = [];
$scope.xcTrails = [];  
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

    if (doc[l].placemarks[1].category == 'dh'){
      $scope.dhTrails.push(
        {
          map: $scope.myMap,
          doc: l,
          layer:doc[l], 
          name: doc[l].placemarks[1].name,
          visible: true,
          trail: doc[l].placemarks[1].polyline,
        });
      $scope.$apply()
    };
    if (doc[l].placemarks[1].category == 'xc'){
      $scope.xcTrails.push({
        map: $scope.myMap,
        doc: l,
        layer:doc[l],
        name: doc[l].placemarks[1].name,
        visible: true,
        trail: doc[l].placemarks[1].polyline,
      });
      $scope.$apply()
    };

    for (var i = 0; i < geoXmlDoc[l].placemarks.length; i++) {
      // console.log(doc[0].markers[i].title);
      var placemark = geoXmlDoc[l].placemarks[i];    
      if (placemark.polyline) {
        var normalStyle = {
            strokeColor: placemark.polyline.get('strokeColor'),
            strokeWeight: placemark.polyline.get('strokeWeight'),
            strokeOpacity: placemark.polyline.get('strokeOpacity')
            };
        placemark.polyline.normalStyle = normalStyle;
        highlightPoly(placemark.polyline, i, geoXmlDoc[l] );
      }

      if (placemark.marker) {
        if (placemark.marker.id == "start") {
          placemark.marker.setOptions({map: $scope.myMap, icon: "images/start-flag.png"})
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


$scope.toggleTrail = function(visible, trail){
  if ( visible == true ) {
     $scope.showDocument(geoXmlDoc[trail]);   
  } else {
     $scope.hideDocument(geoXmlDoc[trail]);
  };
};

$scope.toggleCategory = function(visible, category){
        console.log(category)
        console.log(visible + "show")
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

var highlightOptions = {fillColor: "#FFFFFF",Color: "#FFFFFF", strokeColor: "#000000", fillOpacity: 0.9, strokeWidth: 10};
var highlightLineOptions = {strokeColor: "#fa5519", strokeWidth: 10, color: "#ffffff"};

var on = false;

function highlightPoly(poly, polynum, layer) {
  google.maps.event.addListener(poly,"click",function() {
    $scope.displayInfo(poly)
  });
}

function highlightMarker(marker, polynum, layer) {
  google.maps.event.addListener(marker,"click",function() {
    var trail = layer.placemarks[1].polyline;
    $scope.displayInfo(trail);
  });
};

$scope.log = function(poly){
  console.log(poly);
}
$scope.displayInfo = function(poly){
    if ($scope.highlightedLayer){
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
};

$scope.unHighlightPoly = function(poly) {
  poly.setOptions(poly.normalStyle);
  on = !on;
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
  var options = {frequency: 5000};
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

  updateMapPosition(latitude, longitude);
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
  updateMapPosition(latitude, longitude);
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

  // $('.menu-item').on('click','li', function(trail){
  //   $scope.displayInfo(poly)
  // })
  var on = false;

//   window.addEventListener('orientationchange', function() {
//     if (window.innerHeight < window.innerWidth) {
//       $('.header').toggleClass('landscape');
//       $('.header .title').toggleClass('hidden');
//     }
// });




var showInContextWindow = function(title, description, distance) {
  $('#sidr-left .layer-title').text(title);
  $('#sidr-left .layer-description').text(description);	
  $('#sidr-left .layer-distance').text(distance); 
};//end showincontext

$scope.sidrClose = function(poly){
  if (poly){
    $scope.unHighlightPoly(poly);
    $scope.highlightedLayer = null;
  }
  $.sidr('close', 'sidr-left');
  $('#sidr-left .layer-title').text("");
  $('#sidr-left .layer-description').text("");
  $('#sidr-left .layer-distance').text("");
}
$scope.sidrCloseRight = function(poly){
  $.sidr('close', 'sidr-right');
}
//========================================================================================================================
//========================================================================================================================
//========================================================================================================================



});//end mainCtrl
