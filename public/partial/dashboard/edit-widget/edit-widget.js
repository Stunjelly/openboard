angular.module('openboard').controller('EditWidgetCtrl', function ($scope, resolvedWidget, Widget, $stateParams, toastr, $modalInstance) {

  $scope.baseSchema = {
    type: "object",
    properties: {
      title: {
        type: "string",
        title: "Title",
        description: "Enter a label for your widget",
        required: true,
        "x-schema-form": {
          placeholder: "My Awesome Widget"
        }
      },
      typeId: {
        type: "number",
        title: "Custom Type",
        description: "Pick the type of widget you want. See docs for examples.",
        required: true
      },
      method: {
        type: "string",
        title: "Data Method",
        description: "How do you want to openboard to manage this feed. To find out more about this option read our documentation.",
        required: true,
        'enum': ['push', 'polling']
      },
      reload: {
        type: "number",
        title: "Interval",
        description: "How often do you want the data to refresh.",
        required: true
      },
      url: {
        type: "string",
        title: "URL",
        description: "Data URL",
        required: true,
        "x-schema-form": {
          placeholder: "http://api.example.com/v1/data/1?query=params"
        }
      },
      urlKey: {
        type: "string",
        title: "URL Key (optional)",
        description: "If you specify an API key it will be sent as the username for HTTP basic auth in the request. The password will be set to “X”.",
        "x-schema-form": {
          placeholder: ""
        }
      }
    }
  };

  $scope.baseForm = [
    {
      "type": "section",
      "htmlClass": "modal-body row",
      "items": [
        {
          "type": "section",
          "htmlClass": "col-md-6",
          "items": [
            "title",
            {
              key: "method",
              type: "radiobuttons",
              titleMap: [
                {value: "push", name: "Push"},
                {value: "polling", name: "Polling"}
              ]
            },
            {
              key: "typeId",
              type: "select",
              titleMap: [
                {value: 1, name: "Number and Secondary Stat"},
                {value: 2, name: "Line Chart"},
                {value: 3, name: "Bar/Column Chart"},
                {value: 4, name: "Geck-o-Meter"},
                {value: 5, name: "Leaderboard"},
                {value: 6, name: "Text"},
                {value: 7, name: "Mapping"},
                {value: 8, name: "Funnel"},
                {value: 9, name: "Bullet Graph"},
                {value: 10, name: "Monitoring"},
                {value: 11, name: "List"},
                {value: 12, name: "Highcharts Chart"},
                {value: 13, name: "RAG Numbers and RAG Column & Numbers"},
                {value: 14, name: "Pie Chart"}
              ]
            }
          ]
        },
        {
          "type": "section",
          "htmlClass": "col-md-6",
          "items": [
            {
              key: "url",
              condition: "widgetModel.method === 'polling'"
            },
            {
              key: "urlKey",
              condition: "widgetModel.method === 'polling'"
            },
            {
              key: "reload",
              type: "select",
              condition: "widgetModel.method === 'polling'",
              titleMap: [
                {value: 30, name: "30 Seconds"},
                {value: 60, name: "1 Minute"},
                {value: 300, name: "5 Minutes"},
                {value: 600, name: "10 Minutes"},
                {value: 1800, name: "30 Minutes"},
                {value: 3600, name: "1 hour"}
              ]
            }
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
          "style": "btn-primary",
          "title": "Save"
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

  var defaultWidgetData = {
    method: 'polling',
    reload: 300,
    dashboardId: $stateParams.dashboardId,
    typeId: 1
  };

  $scope.widgetModel = angular.copy(resolvedWidget || defaultWidgetData);

  $scope.onSubmit = function (form) {
    $scope.$broadcast('schemaFormValidate');
    if (form.$valid) {
      if (resolvedWidget) {
        resolvedWidget = $scope.widgetModel;
        resolvedWidget.$save(function (res) {
          toastr.success('Widget Saved!', 'Success');
          $modalInstance.close();
        });
      } else {
        var newWidget = new Widget($scope.widgetModel);
        newWidget.$save(function (res) {
          toastr.success('Widget Created!', 'Success');
          $modalInstance.close();
        });
      }
    }
  }


});
