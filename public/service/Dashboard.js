angular.module('openboard').factory('Dashboard', function ($resource) {
  return $resource('/api/dashboards/:dashboardId', {dashboardId:'@id'});
});
