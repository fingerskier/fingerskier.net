'use strict';

/* Controllers */

function AppCtrl($http, $location, $log, $route, $routeParams, $scope, Stream) {
  $scope.action = [];
  $scope.flarn = [];
  $scope.msgs = [];

  $scope.activeAction = function(fav) {
    if ($scope.action[0] == fav) return 'active'
    else return '';
  };

  $scope.$on('$routeChangeSuccess', function (scope, next, current) {
    var newAction = [];

    if ($routeParams.root) newAction.push($routeParams.root);
    if ($routeParams.branch) newAction.push($routeParams.branch);
    if ($routeParams.leaf) newAction.push($routeParams.leaf);

    $scope.action = newAction;
  });

  Stream.initMsg(function(reply) {
    $scope.msgs.push(reply);
  });

  Stream.init(function(reply) {
    $log.info('from Stream: ');
    $log.info(reply.data);
    $scope.flarn.push(reply.data);
    $scope.$apply();
  });
}

function MyCtrl1() {}

function MyCtrl2() {}