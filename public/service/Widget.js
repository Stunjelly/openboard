angular.module('openboard').factory('Widget', function ($resource) {
  return $resource('/api/dashboards/:dashboardId/widgets/:widgetId', {widgetId:'@id'});
});
