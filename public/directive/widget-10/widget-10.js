/**
 * Monitoring Widget
 */
angular.module('openboard').directive('widget10', function() {
	return {
		restrict: 'A',
		replace: true,
		templateUrl: 'directive/widget-10/widget-10.html',
		link: function(scope, element, attrs, fn) {
      scope.isUp = scope.widget.cache.status.toLowerCase() === 'up';
		}
	};
});
