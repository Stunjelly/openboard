angular.module('openboard').controller('HomeCtrl', function ($scope, Dashboard) {

  $scope.dashboards = Dashboard.query();

});
