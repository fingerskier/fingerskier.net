'use strict';

angular.module('app.directives', [])
.directive('appVersion', ['version', function(version) {
	return function(scope, elm, attrs) {
		elm.text(version);
	};
}])
.directive('autoScroll', function($timeout) {
	return function(scope, elements, attrs) { 
		scope.$watch("messages.length", function() {
			$timeout(function() {
				elements[0].scrollTop = elements[0].scrollHeight
			});
		});
	}
})
;