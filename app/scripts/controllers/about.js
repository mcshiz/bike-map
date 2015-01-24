'use strict';

/**
 * @ngdoc function
 * @name bikeMapApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the bikeMapApp
 */
angular.module('bikeMapApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
