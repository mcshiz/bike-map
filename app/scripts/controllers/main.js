'use strict';

/**
 * @ngdoc function
 * @name bikeMapApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bikeMapApp
 */
angular.module('bikeMapApp')
  .controller('MainCtrl', function ($scope, Attr2Options) {

    var kmlUrl = 'http://www.mcshiz.com/bike-map/layers/gateway.kmz';
    var kmlUrl2 = 'http://www.mcshiz.com/bike-map/layers/eight-mile.kmz';
  	


$scope.map = { 
      coords: '41.349700, -122.312284',
		zoom: '12',
}
  $scope.layers = 
	    [
	    	{
		    	url: kmlUrl,
	    	},
	    	{
		    	url: kmlUrl2,
	    	}
	    ] 
$scope.showInContextWindow = function(event) {
      $scope.description = event.featureData.description;
      console.log("woah dude")
    };



$scope.getLocation = function(){
	  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      $scope.map.coords = position.coords.latitude+","+position.coords.longitude;
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
}

}





  });
