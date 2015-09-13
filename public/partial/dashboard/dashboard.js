angular.module('openboard').controller('DashboardCtrl', function ($scope, $stateParams, Dashboard, Widget) {

  $scope.widgets = Widget.query({dashboardId: $stateParams.id});

});
