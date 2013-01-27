'use strict';

angular.module('app.services', [])
.service('Stream', function($http, $log, $window) {
  $log.info('new stream setup');

  function closeHandler() {
    $log.warn('stream closed');
  }

  function openHandler() {
    $log.info('stream opened');
  }

  return {
    init: function(handler) {
      var source = new EventSource('/stream');

      $log.info('stream init');

      source.addEventListener('message', handler, false);
      source.addEventListener('open', openHandler, false);
      source.addEventListener('close', closeHandler, false);
    },
    initMsg: function(handler) {
      var source = new EventSource('/stream/msg');

      $log.info('stream init');

      source.addEventListener('message', handler, false);
    }
  }
});
