'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'ui'])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/:root')
    .when('/:root/:branch')
    .when('/:root/:branch/:leaf')
    .otherwise({redirectTo: '/'});

    $locationProvider.html5Mode(true);
  }])
.run(function($log, $rootScope) {
  $rootScope.user = {
    name: 'Your Name'
  };
});