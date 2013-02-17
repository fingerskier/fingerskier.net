function AppCtrl($http, $location, $log, $route, $routeParams, $scope, Stream) {
  $scope.action = [];
  $scope.flarn = [];
  $scope.msgs = [];

  $scope.activeAction = function(fav) {
    if ($scope.root == fav) return 'active'
    else return '';
  };

  $scope.activeBranch = function(fav) {
    if ($scope.branch == fav) return 'active'
    else return '';
  };

  $scope.activeLeaf = function(fav) {
    if ($scope.leaf == fav) return 'active'
    else return '';
  };

  $scope.branchURL = function(branch) {
    return $scope.root + '/' + branch;
  };

  $scope.leafURL = function(leaf) {
    return $scope.root + '/' + $scope.branch + '/' + leaf;
  };

  $scope.rootURL = function(root) {
    return root + '/';
  };

  $scope.$on('$routeChangeSuccess', function (scope, next, current) {
    $scope.root = $routeParams.root;
    $scope.branch = $routeParams.branch;
    $scope.leaf = $routeParams.leaf;
  });

  // Stream.initMsg(function(reply) {
  //   $scope.msgs.push(reply);
  // });

  // Stream.init(function(reply) {
  //   $log.info('from Stream: ');
  //   $log.info(reply.data);
  //   $scope.flarn.push(reply.data);
  //   $scope.$apply();
  // });
}

function CalcCtrl($log, $scope) {
  function radians(deg) {
    return (parseFloat(deg) * Math.PI) / 180;
  }

  $scope.formulae = [{
    title: 'Maximum ROP',
    val: 0,
    vars: {
      mudWeightDiff: {name:'Mud-Wt In/Out Diff.', val:1},
      GPM: {name:'GPM', val:500},
      holeDiameter: {name:'Hole Diameter', val:10}
    },
    precision: 0,
    calc: function() {
      this.val = (67 * parseFloat(this.vars.mudWeightDiff.val) * parseFloat(this.vars.GPM.val)) / (this.vars.holeDiameter.val * this.vars.holeDiameter.val);
    }
  },{
    title: 'Motor Dog-Leg',
    val: 0,
    vars: {
      CL: {name:'Course Length', val:90},
      slide: {name:'Slide Length', val:10},
      DLS: {name:'DLS', val:1}
    },
    precision: 1,
    calc: function() {
      $log.info(parseFloat(this.vars.CL.val));
      $log.info(parseFloat(this.vars.slide.val));
      $log.info(parseFloat(this.vars.DLS.val));
      this.val = (parseFloat(this.vars.CL.val)/parseFloat(this.vars.slide.val)) * parseFloat(this.vars.DLS.val);
    }
  },{
    title: 'Dog-Leg Severity',
    val: 0,
    vars: {
      inc1: {name:'Inc 1', val:0},
      inc2: {name:'Inc 2', val:1},
      azm1: {name:'Azm 1', val:90},
      azm2: {name:'Azm 2', val:100},
      CL: {name:'Course Length', val:90},
    },
    precision: 2,
    calc: function() {
      var term1 = 100 / parseFloat(this.vars.CL.val)
      ,   term2 = Math.cos(radians(this.vars.inc1.val)) * Math.cos(radians(this.vars.inc2.val))
      ,   term3 = Math.sin(radians(this.vars.inc1.val)) * Math.sin(radians(this.vars.inc2.val)) * Math.cos(radians(parseFloat(this.vars.azm2.val)-parseFloat(this.vars.azm1.val)));

      $log.info(term1, term2, term3);

      this.val = term1 * Math.acos(term2 + term3);
    }
  }];
};