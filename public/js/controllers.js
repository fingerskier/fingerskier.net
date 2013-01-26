'use strict';

/* Controllers */

function AppCtrl($http, $scope, $route, $routeParams) {
  var render = function () {
    var thisAction = $route.current.action || '';

    $scope.action = thisAction.split('.') || [];
  };

  $http({method: 'GET', url: '/api/name'})
  .success(function(data, status, headers, config) {
    $scope.name = data.name;
  })
  .error(function(data, status, headers, config) {
    $scope.name = 'Error!'
  });

  $scope.$on('$routeChangeSuccess', function (scope, next, current) {
    render();
  });
}

function MyCtrl1() {}
MyCtrl1.$inject = [];


function MyCtrl2() {
}
MyCtrl2.$inject = [];
