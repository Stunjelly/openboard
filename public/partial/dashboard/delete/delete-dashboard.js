angular.module('openboard')
  .controller('DeleteDashboardCtrl', function ($scope, resolvedDashboard, $modalInstance, toastr, $state) {

    $scope.schema = {
      type: "object",
      properties: {
        confirm: {
          type: "boolean",
          title: "I want to delete this dashboard",
          description: "To confirm removal of this dashboard and all widgets check the box",
          required: true
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
            template: '<button type="button" class="close pull-right" ng-click="form.close()" aria-hidden="true">&times;</button><h2 class="modal-title">Delete Dashboard</h2>',
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
          {
            type: "template",
            template: '<p class="lead">Are you sure you want to delete the dashboard <strong>' + resolvedDashboard.title + '</strong>?</p>',
            name: 'help'
          },
          "*"
        ]
      },
      {
        "type": "actions",
        "htmlClass": "modal-footer",
        "items": [
          {
            "type": "submit",
            "style": "btn-danger",
            "title": "Delete"
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

    $scope.model = {};

    $scope.onSubmit = function (form) {
      $scope.$broadcast('schemaFormValidate');
      if (form.$valid) {
        resolvedDashboard.$remove(function (res) {
          toastr.success('Dashboard Deleted!', 'Success');
          $modalInstance.close(true);
          $state.go('home');
        });
      }
    }

  });
