angular.module('openboard').controller('EditWidgetCtrl', function ($scope, resolvedWidget) {

  $scope.baseSchema = {
    type: "object",
    properties: {
      title: {
        type: "string",
        title: "Title",
        description: "Enter a label for your widget",
        required: true
      },
      type: {
        type: "number",
        title: "Type",
        description: "Pick the type of widget you want. See docs for examples",
        required: true
      },
      method: {
        type: "string",
        title: "Widget Data Method",
        description: "How do you want to openboard to manage this feed",
        required: true,
        'enum': ['push', 'polling']
      }
    }
  };

  $scope.baseForm = [
    {
      "type": "section",
      "htmlClass": "modal-header",
      "items": [
        {
          type: "template",
          template: '<button type="button" class="close pull-right" ng-click="form.close()" aria-hidden="true">&times;</button><h2 class="modal-title">Create/Edit Widget</h2>',
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
        "title",
        {
          key: "surname",
          type: "select",
          titleMap: [
            { value: "1", name: "Metr" },
            { value: "2", name: "Johansson" },
            { value: "3", name: "Something else..."}
          ]
        },
        {
          key: "method",
          type: "radiobuttons",
          titleMap: [
            { value: "push", name: "Push" },
            { value: "polling", name: "Polling" }
          ]
        }
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

  $scope.widgetModel = angular.copy(resolvedWidget || {});

});
