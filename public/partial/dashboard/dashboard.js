angular.module('openboard').controller('DashboardCtrl', function ($scope, $stateParams, Dashboard, Widget, $modal) {

  // Get dashboard
  $scope.dashboard = Dashboard.get({dashboardId: $stateParams.id});

  // Get widgets[]
  $scope.widgets = Widget.query({dashboardId: $stateParams.id});

  $scope.editDashboard = function () {
    $modal
      .open({
        templateUrl: 'partial/dashboard/edit/edit-dashboard.html',
        controller: 'EditDashboardCtrl',
        resolve: {
          resolvedDashboard: function () {
            return $scope.dashboard;
          }
        }
      }).result.then(function (result) {
      });
  }

});
