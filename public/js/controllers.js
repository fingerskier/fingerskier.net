'use strict';

/* Controllers */

function AppCtrl($http, $location, $scope, $route, $routeParams) {
  $scope.action = [];

  $scope.activeAction = function(fav) {
    if ($scope.action[0] == fav) return 'active'
    else return '';
  }

  $scope.$on('$routeChangeSuccess', function (scope, next, current) {
    var newAction = [];

    if ($routeParams.root) newAction.push($routeParams.root);
    if ($routeParams.branch) newAction.push($routeParams.branch);
    if ($routeParams.leaf) newAction.push($routeParams.leaf);

    $scope.action = newAction;
  });
}

function MyCtrl1() {}
MyCtrl1.$inject = [];


function MyCtrl2() {
}
MyCtrl2.$inject = [];
