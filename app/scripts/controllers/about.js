'use strict';

/**
 * @ngdoc function
 * @name bikeMapApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the bikeMapApp
 */
angular.module('bikeMapApp')
  .controller('AboutCtrl', function ($scope, uiGmapGoogleMapApi) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
  });
