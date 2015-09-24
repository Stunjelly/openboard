angular.module('openboard').directive('obWidget', function ($modal, $compile, $interval, SocketService) {
  return {
    restrict: 'EA',
    replace: true,
    templateUrl: 'directive/ob-widget/ob-widget.html',
    link: function (scope, element, attrs, fn) {

      // Compile and load the widget type directive
      var widgetHolder = element
        .find('.widget-directive-holder')
        .attr('widget-' + scope.widget.typeId, '');

      $compile(widgetHolder)(scope);

      // On widget load ask for the latest data
      SocketService.emit('request:cache', {widgetId: scope.widget.id});

      // Emit a socket at a designated interval
      $interval(function () {
        SocketService.emit('request:cache', {widgetId: scope.widget.id});
      }, scope.widget.reload * 1000);

      SocketService.on('updateWidget:' + scope.widget.id, function (data) {
        console.log(data);
        scope.widget.cache = data.data;
      });

      // Setup init position
      element[0].style.transform = 'translate(' + scope.widget.x + 'px, ' + scope.widget.y + 'px)';

      // On mouse move update widget scope with x/y and move it with webkit transform
      function dragMove(event) {
        scope.widget.x += event.dx;
        scope.widget.y += event.dy;
        event.target.style.webkitTransform =
          event.target.style.transform = 'translate(' + scope.widget.x + 'px, ' + scope.widget.y + 'px)';
      }

      // On mouse up dragging widget update position
      function dragEnd(e) {
        scope.widget.$save();
      }

      // Init interact on the element
      interact(element[0]).draggable({
        snap: {
          targets: [interact.createSnapGrid({x: 10, y: 10})],
          range: Infinity,
          relativePoints: [{x: 0, y: 0}]
        },
        inertia: false,
        restrict: {
          restriction: element.parentNode,
          elementRect: {top: 0, left: 0, bottom: 1, right: 1},
          endOnly: true
        }
      })
        .on('dragmove', dragMove)
        .on('dragend', dragEnd);
    }
  };
});
