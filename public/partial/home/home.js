angular.module('openboard').controller('HomeCtrl', function ($scope, Dashboard, $state) {

  $scope.dashboards = Dashboard.query();

  $scope.schema = {
    type: "object",
    properties: {
      title: {
        type: "string",
        minLength: 2,
        required: true,
        title: "Create a new Dashboard",
        description: "Pick a name for your dashboard"
      }
    }
  };

  $scope.form = [
    "*",
    {
      type: "submit",
      title: "Create"
    }
  ];

  $scope.model = {};

  $scope.onSubmit = function (form) {
    $scope.$broadcast('schemaFormValidate');
    if (form.$valid) {
      var dash = new Dashboard();
      dash.title = $scope.model.title;
      dash.$save(function (res) {
        $state.go('dashboard', {dashboardId: res.id});
      });
    }
  }

});
