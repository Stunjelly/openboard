angular.module('openboard').factory('Type', function ($resource) {
  return $resource('/api/types/:typeId', {typeId: '@id'}, {'query': {cache: true}, 'get': {cache: true}});
});
