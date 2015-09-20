angular.module('openboard').controller('DashboardCtrl', function ($scope, $stateParams, Dashboard, Widget, $modal, toastr) {

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
        size: 'lg',
        resolve: {
          resolvedWidget: function () {
            return widget;
          }
        }
      }).result.then(function (result) {
        if (result && widget) {
          widget = result;
        }
        if (result && !widget) {
          $scope.widgets.push(result);
        }
      });
  };

  $scope.deleteWidget = function (widget) {
    $modal
      .open({
        templateUrl: 'partial/dashboard/delete-widget/delete-widget.html',
        controller: 'DeleteWidgetCtrl'
      }).result.then(function (result) {
        if (result) {
          var wIndex = $scope.widgets.findIndex(function (e, i, a) {
            return e.id === widget.id;
          });
          $scope.widgets[wIndex].$remove(function () {
            $scope.widgets.splice(wIndex, 1);
            toastr.success('Widget Removed');
          });

        }
      });
  }

});
