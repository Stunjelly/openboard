angular.module('openboard').directive('obWidget', function ($modal) {
  return {
    restrict: 'EA',
    replace: true,
    scope: true,
    templateUrl: 'directive/ob-widget/ob-widget.html',
    link: function (scope, element, attrs, fn) {
      //scope.editWidget = function () {
      //  $modal
      //    .open({
      //      templateUrl: 'partial/dashboard/edit-widget/edit-widget.html',
      //      controller: 'EditWidgetCtrl',
      //      size: 'lg',
      //      resolve: {
      //        resolvedWidget: function () {
      //          return scope.widget;
      //        }
      //      }
      //    }).result.then(function (result) {
      //    });
      //}
    }
  };
});
