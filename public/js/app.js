'use strict';

angular.module('app', ['app.filters', 'app.services', 'app.directives', 'ui'])
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