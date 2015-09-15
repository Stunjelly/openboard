angular.module('openboard').controller('DashboardCtrl', function ($scope, $stateParams, Dashboard, Widget, $modal) {

  // Get dashboard
  $scope.dashboard = Dashboard.get({dashboardId: $stateParams.dashboardId});

  // Get widgets[]
  $scope.widgets = Widget.query({dashboardId: $stateParams.dashboardId});

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
  };

  $scope.deleteDashboard = function () {
    $modal
      .open({
        templateUrl: 'partial/dashboard/delete/delete-dashboard.html',
        controller: 'DeleteDashboardCtrl',
        resolve: {
          resolvedDashboard: function () {
            return $scope.dashboard;
          }
        }
      }).result.then(function (result) {
      });
  };

  $scope.editWidget = function (widget) {
    $modal
      .open({
        templateUrl: 'partial/dashboard/edit-widget/edit-widget.html',
        controller: 'EditWidgetCtrl',
        resolve: {
          resolvedWidget: function () {
            return widget;
          }
        }
      }).result.then(function (result) {
      });
  }

});
