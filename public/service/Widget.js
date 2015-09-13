angular.module('openboard').factory('Widget', function ($resource) {
  return $resource('/api/widgets/:id');
});
