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
                    singleInfoWindow: true,
                    afterParse: useTheData
                });

geoXml.parse('http://localhost:9000/scripts/doc.kml');

function highlightPoly(poly) {
    google.maps.event.addListener(poly,"mouseover",function() {
      poly.setOptions({fillColor: "#00ff04", strokeColor: "#00ff04"});
    });
    google.maps.event.addListener(poly,"mouseout",function() {
      poly.setOptions({fillColor: "#FF0000", strokeColor: "#FF0000", fillOpacity: 0.3});
    });
}  
// function kmlHighlightPoly(poly) {
//    for (var i=0;i<geoXmlDoc.gpolygons.length;i++) {
//      if (i == poly) {
//        geoXmlDoc.gpolygons[i].setOptions({fillColor: "#0000FF", strokeColor: "#0000FF"});
//      } else {
//        geoXmlDoc.gpolygons[i].setOptions({fillColor: "#FF0000", strokeColor: "#FF0000"});
//      }
//    }
// }


    function useTheData(doc) {
      // Geodata handling goes here, using JSON properties of the doc object
        doc[0].placemarks[1].polyline.setOptions({fillColor: "#9999", strokeColor: "#9999", fillOpacity: 1.0});
    };

function kmlShowPoly(poly) {
   for (var i=0;i<geoXmlDoc.gpolygons.length;i++) {
     if (i == poly) {
       geoXmlDoc.gpolygons[i].setMap(map);
       geoXmlDoc.markers[i].setMap(map);
     } else {
       geoXmlDoc.gpolygons[i].setMap(null);
       geoXmlDoc.markers[i].setMap(null);
     }
   }
}






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
