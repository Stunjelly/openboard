angular.module('openboard').controller('EditDashboardCtrl', function ($scope, resolvedDashboard) {

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
        description: "Make public"
      }
    }
  };

  $scope.form = [
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

  $scope.model = resolvedDashboard;

  $scope.onSubmit = function (form) {
    $scope.$broadcast('schemaFormValidate');
    if (form.$valid) {

    }
  }

});
