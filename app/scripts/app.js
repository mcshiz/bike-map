'use strict';

/**
 * @ngdoc overview
 * @name bikeMapApp
 * @description
 * # bikeMapApp
 *
 * Main module of the application.
 */
angular
  .module('bikeMapApp', [
    'ngRoute',
    'ngSanitize',
    'LocalStorageModule',     
    'ngTouch',
    'ngMap',
    'firebase',
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('bikeMapApp')
    .setNotify(true, true)
});

