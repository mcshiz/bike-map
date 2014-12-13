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
var geoXmlDoc = [];
var layers = ['/layers/gateway.kml', '/layers/doc.kml']


   geoXml = new geoXML3.parser({
                    map: map,
                    processStyles: true,
                    suppressInfoWindows: true,
                    afterParse: useTheData
                });

geoXml.parse(layers);




function useTheData(doc){
  var currentBounds = map.getBounds();
  if (!currentBounds) currentBounds=new google.maps.LatLngBounds();
  // Geodata handling goes here, using JSON properties of the doc object
 
//  var sidebarHtml = '<table>';
for (var l = 0; l<doc.length; l++){


  geoXmlDoc[l] = doc[l];
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
        placemark.marker.setOptions({icon: "images/start-flag.png"})
      }
      if (placemark.marker.id == "end") {
        placemark.marker.setOptions({icon: "images/end-flag.png"})
      }
      if (placemark.marker.id == "loop") {
        placemark.marker.setOptions({icon: "images/loop-flag.png"})
      }    
    }// end if marker

  }//end placemarks for loop
}//end doc for loop

};

var highlightOptions = {fillColor: "#FFFFFF",Color: "#FFFFFF", strokeColor: "#000000", fillOpacity: 0.9, strokeWidth: 10};
var highlightLineOptions = {strokeColor: "#fa5519", strokeWidth: 10, color: "#ffffff"};

var on = false;
function highlightPoly(poly, polynum, layer) {
  google.maps.event.addListener(poly,"click",function() {

    $scope.brian = poly;
    if (on === false){
      poly.setOptions(highlightLineOptions); 
      on = !on;
      //create custom kml tags on 404 of geoxml3
      showInContextWindow(poly.title, poly.description, poly.distance)
      $.sidr('open');
    } else {
      $scope.unHighlightPoly(poly)
      $scope.sidrClose(on, poly)
    }
  });

  google.maps.event.addListener(poly,"mouseout",function() { 
  });
}

$scope.unHighlightPoly = function(poly) {
  poly.setOptions(poly.normalStyle);
  console.log(poly)
   on = !on;
}




// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================



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
          $scope.locationMarker = addMarker(position.coords.latitude,position.coords.longitude);
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

$('#simple-menu').sidr({
    displace: false,
  })


$scope.sidrOpen = false;


var showInContextWindow = function(title, description, distance) {
  $('#sidr .layer-title').text(title);
  $('#sidr .layer-description').text(description);	
  $('#sidr .layer-distance').text(distance); 

  if ($scope.sidrOpen !== true){
    $.sidr(function(){
  	  $scope.sidrOpen = true
    });
    $scope.sidrOpen = true;
  }
};//end showincontext


$scope.sidrClose = function(poly){
  if (poly){
    $scope.unHighlightPoly(poly);
  }
  $.sidr('close');
  $('#sidr .layer-title').text("");
  $('#sidr .layer-description').text("");
  $('#sidr .layer-distance').text("");
  $scope.sidrOpen = false;  
}



  });//end mainCtrl
