angular.module('openboard').controller('DashboardCtrl', function ($scope, $stateParams, Dashboard, Widget) {

  // Get dashboard
  $scope.dashboard = Dashboard.get({dashboardId: $stateParams.id});

  // Get widgets[]
  $scope.widgets = Widget.query({dashboardId: $stateParams.id});

});
