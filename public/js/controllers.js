'use strict';

function AppCtrl($http, $location, $log, $route, $routeParams, $scope, $timeout) {
  $scope.action = [];
  $scope.flarn = [];
  $scope.msgs = [];

  var sussman = "switching elements, which are modeled by quantum mechanics described by differential equations whose behavior is captured by numerical approximations represented in computer programs executing on computers composed of ";
  $scope.sussArr = sussman.split(' ');

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

  setInterval(function() {
    $scope.$apply(function() {
      $scope.sussArr.push($scope.sussArr[0]);
      $scope.sussArr.splice(0,1);

      $scope.sussman = $scope.sussArr.join(' ');
    });
  }, 7000);
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
}

function ScribCtrl($log, $scope, scribble) {
  // need to replace this with a service
  var dataRef = new Firebase('https://fingerskier.firebaseio.com/scribbler');

  $scope.colors = ["fff","000","f00","0f0","00f","88f","f8d","f88","f05","f80","0f8","cf0","08f","408","ff8","8ff"];
  $scope.currentColor = "000";
  $scope.pixSize = 8;
  $scope.lastPoint = null;
  $scope.mouseDown = 0;
  $scope.canvas = $('#scribbleCanvas');

  var myContext = $scope.canvas.getContext ? $scope.canvas.getContext('2d') : null;
  if (myContext == null) {
    alert("You must use a browser that supports HTML5 Canvas to run this demo.");
    return;
  }

  $scope.backColor = function(color) {
    $log.info('background-color: #' + color);
    return {'background-color': '#'+color};
  }

  $scope.drawLine = function() {
    if (! $scope.mouseDown) return;

    // Bresenham's line algorithm. We use this to ensure smooth lines are drawn
    var offset = $scope.canvas.offset();
    var x1 = Math.floor((e.pageX - offset.left) / pixSize - 1)
    ,   y1 = Math.floor((e.pageY - offset.top) / pixSize - 1);
    var x0 = (lastPoint == null) ? x1 : lastPoint[0];
    var y0 = (lastPoint == null) ? y1 : lastPoint[1];
    var dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
    var sx = (x0 < x1) ? 1 : -1, sy = (y0 < y1) ? 1 : -1, err = dx - dy;
    while (true) {
      //write the pixel into Firebase, or if we are drawing white, remove the pixel
      dataRef.child(x0 + ":" + y0).set(currentColor === "fff" ? null : currentColor);

      if (x0 == x1 && y0 == y1) break;
      var e2 = 2 * err;
      if (e2 > -dy) {
        err = err - dy;
        x0 = x0 + sx;
      }
      if (e2 < dx) {
        err = err + dx;
        y0 = y0 + sy;
      }
    }
    lastPoint = [x1, y1];
  }

  $scope.selectColor = function(color) {
    $scope.currentColor = color;
  }

  $scope.unmouse = function() {
    $scope.mousedown = 0;
    $scope.lastPoint = null;
  }

  dataRef.on('child_added', drawPixel);
  dataRef.on('child_changed', drawPixel);
  dataRef.on('child_removed', clearPixel);

  var drawPixel = function(snapshot) {
    var coords = snapshot.name().split(":");
    myContext.fillStyle = "#" + snapshot.val();
    myContext.fillRect(parseInt(coords[0]) * pixSize, parseInt(coords[1]) * pixSize, pixSize, pixSize);
  }
  var clearPixel = function(snapshot) {
    var coords = snapshot.name().split(":");
    myContext.clearRect(parseInt(coords[0]) * pixSize, parseInt(coords[1]) * pixSize, pixSize, pixSize);
  }
}

function Chat($scope, $timeout, angularFire, $log) {
  var url = 'https://fingerskier.firebaseio.com/chat';

  var promise = angularFire(url, $scope, 'messages', []);
  $scope.username = 'Guest' + Math.floor(Math.random()*101);

  promise.then(function() {
    $scope.addMessage = function() {
      $scope.messages.add({from: $scope.username, content: $scope.message});
      $scope.message = "";
    }
  });
}