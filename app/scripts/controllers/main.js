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

    var kmlUrl = 'http://www.mcshiz.com/bike-map/layers/gateway.kmz';
    var kmlUrl2 = 'http://www.mcshiz.com/bike-map/layers/eight-mile.kmz';
 
  $scope.$on('mapInitialized', function(event, map) {
  $scope.map = { 
    coords: '41.349700, -122.312284',
    zoom: '12',
  }

   var layer = [
    {
      name: 'Eight-mile',
      url: 'http://www.mcshiz.com/bike-map/layers/eight-mile.kmz', 
      info: 'this is the 8-mile trail... its a classic'
    },
    {
      name: 'Gateway',
      url: 'http://www.mcshiz.com/bike-map/layers/gateway.kmz',
      info: 'This is the gateway loop..most pop xc trail'
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
      showInContextWindow(val.info);
    });
  });

  $scope.getLocation = function(){
    if(navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(function(position) {
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map.panTo(latLng);
    })
  }
}

var watchID = null;

$scope.getLocation = function(){
  var options = {frequency: 5000};
  watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
}
function onSuccess(position){
  
}





  }); //end mapInitialized




  var showInContextWindow = function(info) {
    $('.infoWindow').text(info);
  };//end showincontext






  });//end mainCtrl
