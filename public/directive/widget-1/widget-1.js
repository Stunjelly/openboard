angular.module('openboard').directive('widget1', function () {
  return {
    restrict: 'A',
    replace: true,
    scope: true,
    templateUrl: 'directive/widget-1/widget-1.html',
    link: function (scope, element, attrs, fn) {
      scope.drawSparkline = angular.isArray(scope.widget.cache.item[1]);
    }
  };
});
