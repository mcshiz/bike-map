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
    coords: '41.349700, -122.312284',
    zoom: '12',
  }
var geoXml = null;
var geoXmlDoc = null;



   geoXml = new geoXML3.parser({
                    map: map,
                    processStyles: true,
                    suppressInfoWindows: true,
                    afterParse: useTheData
                });

geoXml.parse('http://localhost:9000/scripts/doc.kml');




function useTheData(doc){
  var currentBounds = map.getBounds();
  if (!currentBounds) currentBounds=new google.maps.LatLngBounds();
  // Geodata handling goes here, using JSON properties of the doc object
 
//  var sidebarHtml = '<table>';
  geoXmlDoc = doc[0];
  for (var i = 0; i < geoXmlDoc.placemarks.length; i++) {
    // console.log(doc[0].markers[i].title);
    var placemark = geoXmlDoc.placemarks[i];

    if (placemark.polyline) {
      var normalStyle = {
          strokeColor: placemark.polyline.get('strokeColor'),
          strokeWeight: placemark.polyline.get('strokeWeight'),
          strokeOpacity: placemark.polyline.get('strokeOpacity')
          };
      placemark.polyline.normalStyle = normalStyle;
console.log(placemark.polyline)
      highlightPoly(placemark.polyline, i);
}
    if (placemark.marker) {
      if (placemark.marker.id == "start") {
      placemark.marker.setOptions({icon: "/images/start-flag.png"})
    }
      if (placemark.marker.id == "end") {
      placemark.marker.setOptions({icon: "/images/end-flag.png"})
    }
      hideMarker(placemark.marker, i);
    }

/*    doc[0].markers[i].setVisible(false); */
  }

};

var highlightOptions = {fillColor: "#FFFFFF",Color: "#FFFFFF", strokeColor: "#000000", fillOpacity: 0.9, strokeWidth: 10};
var highlightLineOptions = {strokeColor: "#fa5519", strokeWidth: 10, color: "#ffffff"};

function hideMarker(marker2){
 google.maps.event.addListener(marker2, 'click', function() {
  marker2.setOptions({icon: "/images/start-flag.png"})
  })
}

function kmlHighlightPoly(pm) {
   for (var i=0;i<geoXmlDoc.placemarks.length;i++) {
     var placemark = geoXmlDoc.placemarks[i];
     if (i == pm) {
       if (placemark.polygon) placemark.polygon.setOptions(highlightOptions);
       if (placemark.polyline) placemark.polyline.setOptions(highlightLineOptions);
     } else {
       if (placemark.polygon) placemark.polygon.setOptions(placemark.polygon.normalStyle);
       if (placemark.polyline) placemark.polyline.setOptions(placemark.polyline.normalStyle);
     }
   }
}
function kmlUnHighlightPoly(pm) {
   for (var i=0;i<geoXmlDoc.placemarks.length;i++) {
     if (i == pm) {
       var placemark = geoXmlDoc.placemarks[i];
       if (placemark.polygon) placemark.polygon.setOptions(placemark.polygon.normalStyle);
       if (placemark.polyline) placemark.polyline.setOptions(placemark.polyline.normalStyle);
     }
   }
}

var on = false;
function highlightPoly(poly, polynum) {
  //    poly.setOptions({fillColor: "#0000FF", strokeColor: "#0000FF", fillOpacity: 0.3}) ;
  google.maps.event.addListener(poly,"click",function() {
    if (on === false){
      poly.setOptions(highlightLineOptions); 
        on = !on;

        //create custom kml tags on 404 of geoxml3
        $('#sidr .layer-title').text(poly.title);
        $('#sidr .layer-info').html(poly.distance + "<br>" + poly.description);
        $.sidr('open');
    } else {
      poly.setOptions(poly.normalStyle);
        on = !on;
        $.sidr('close');
    }
  });

  google.maps.event.addListener(poly,"mouseout",function() {
    
  });
}  


function kmlPgClick(pm) {
   if (geoXml.docs[0].placemarks[pm].polygon.getMap()) {
      google.maps.event.trigger(geoXmlDoc.placemarks[pm].polygon,"click");
   } else {
      geoXmlDoc.placemarks[pm].polygon.setMap(map);
      google.maps.event.trigger(geoXmlDoc.placemarks[pm].polygon,"click");
   }
}



// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
   var layer = [
    {
      name: 'Eight-mile',
      url: 'http://www.mcshiz.com/bike-map/layers/gateway.kmz', 
      info: 'this is the 8-mile trail... its a classic'
    },
    {
      name: 'Gateway',
      url: 'http://www.mcshiz.com/bike-map/layers/gateway.kmz',
      info: 'This is the gateway loop.most pop xc trail',
    }]

    var lay = [];
    $.each(layer, function(index, val) {
     lay[index] = new google.maps.KmlLayer({
      url: val.url,
      options: {'suppressInfoWindows' : true},
      info: val.info
    });
    lay[index].setMap(map);

    google.maps.event.addListener(lay[index], 'click', function(kmlEvent) {
      showInContextWindow(val.name, val.info);
    });
  });


  $('#simple-menu').sidr({
      displace: false,
    })
  $('.sidr-close').on('click', function(){
    $.sidr('close');
    $scope.sidrOpen = false;
});
	$scope.tracking = false;
$scope.getLocation = function(){
	$scope.tracking = !$scope.tracking;
	locationBtn();
	findLocation($scope.tracking);
}

var locationBtn = function(value){
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

                    // Add a marker to the map using the position.
                    $scope.locationMarker = addMarker(
                        position.coords.latitude,
                        position.coords.longitude
                    );

                },
          function( error ){
              console.log( "Something went wrong: ", error );
          },
          {
              timeout: (5 * 1000),
              maximumAge: (1000 * 60 * 15),
              enableHighAccuracy: true
          }
      );

      $scope.positionTimer = navigator.geolocation.watchPosition(
          function( position ){
              updateMarker(
                  $scope.locationMarker,
                  position.coords.latitude,
                  position.coords.longitude
              );

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
		removeMarker($scope.locationMarker);
	}
}  



function addMarker( latitude, longitude){
  var marker = new google.maps.Marker({
      map: map,
      position: new google.maps.LatLng(
          latitude,
          longitude
      ),
  });
  updateMapPosition(latitude, longitude);
  return( marker );
}

function removeMarker( marker ) {
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
    	map.panTo(latLng);
};


  }); //end mapInitialized



  $scope.sidrOpen = false;
  var showInContextWindow = function(title, info) {
    $('#sidr .layer-title').text(title);
    $('#sidr .layer-info').text(info);	
    console.log($scope.sidrOpen)
    if ($scope.sidrOpen !== true){
	    $.sidr(function(){
	    	$scope.sidrOpen = true
	    })
      $scope.sidrOpen = true;
    };
  };//end showincontext






  });//end mainCtrl
