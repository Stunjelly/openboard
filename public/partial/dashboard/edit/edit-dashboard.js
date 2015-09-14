angular.module('openboard').controller('EditDashboardCtrl', function ($scope, resolvedDashboard, Dashboard, $modalInstance) {

  $scope.schema = {
    type: "object",
    properties: {
      title: {
        type: "string",
        minLength: 2,
        required: true,
        title: "Title",
        description: "Name of the dashboard"
      },
      "public": {
        type: "boolean",
        title: "Public",
        description: "Checking this box will make your dashboard visible to everyone in your network"
      }
    }
  };

  $scope.form = [
    {
      "type": "section",
      "htmlClass": "modal-header",
      "items": [
        {
          type: "template",
          template: '<button type="button" class="close pull-right" ng-click="form.close()" aria-hidden="true">&times;</button><h2 class="modal-title">Edit Dashboard</h2>',
          name: 'header',
          close: function () {
            $modalInstance.dismiss();
          }
        }
      ]
    },
    {
      "type": "section",
      "htmlClass": "modal-body",
      "items": [
        "*"
      ]
    },
    {
      "type": "actions",
      "htmlClass": "modal-footer",
      "items": [
        {
          "type": "submit",
          "style": "btn-primary",
          "title": "Save Changes"
        },
        {
          "type": "button",
          "style": "btn-default",
          "title": "Cancel",
          onClick: "$dismiss()"
        }
      ]
    }
  ];

  $scope.model = angular.copy(resolvedDashboard);

  $scope.onSubmit = function (form) {
    $scope.$broadcast('schemaFormValidate');
    if (form.$valid) {
      resolvedDashboard.title = $scope.model.title;
      resolvedDashboard.public = $scope.model.public;
      resolvedDashboard.$save(function (res) {
        $modalInstance.close(true);
      });
    }
  }

});
