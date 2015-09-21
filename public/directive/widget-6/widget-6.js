/**
 * Text Widget
 */
angular.module('openboard').directive('widget6', function($interval) {
	return {
		restrict: 'A',
		replace: true,
		templateUrl: 'directive/widget-6/widget-6.html',
		link: function(scope, element, attrs, fn) {
      scope.widgetCurrentIndex = 0;
      $interval(function () {
        if (scope.widgetCurrentIndex === (scope.widget.cache.item.length - 1)) {
          scope.widgetCurrentIndex = 0;
        } else {
          scope.widgetCurrentIndex += 1;
        }
      }, scope.widget.config.delayTime || 5000);
		}
	};
});
