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

  $scope.branch = function() {
    return $scope.action[1];
  }

  $scope.branchURL = function(branch) {
    return $scope.action[0] + '/' + branch;
  }

  $scope.leaf = function() {
    return $scope.action[2];
  }

  $scope.leafURL = function(leaf) {
    return $scope.action[0] + '/' + $scope.action[1] + '/' + leaf;
  }

  $scope.root = function() {
    return $scope.action[0];
  }

  $scope.rootURL = function(root) {
    return root + '/';
  }
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

function CalcCtrl($log, $scope) {
  $scope.formulae = [{
    title: 'Maximum ROP',
    val: 0,
    vars: {
      mudWeightDiff: {name:'Mud-Wt In/Out Diff.', val:1},
      GPM: {name:'GPM', val:500},
      holeDiameter: {name:'Hole Diameter', val:10}
    },
    calc: function() {
      this.val = (67 * parseFloat(this.vars.mudWeightDiff.val) * parseFloat(this.vars.GPM.val)) / (this.vars.holeDiameter.val * this.vars.holeDiameter.val);
    }
  }];
};