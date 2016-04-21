angular.module('openboard').directive('obWidget', function ($modal, $compile, $interval, SocketService) {
  return {
    restrict: 'EA',
    replace: true,
    scope: {
      dashboardId: '=dashboardId',
      widget: '=widget'
    },
    templateUrl: 'directive/ob-widget/ob-widget.html',
    link: function (scope, element, attrs, fn) {

      /**
       * Make sure for each widget typeId you create a directive called widget-:typeId
       * Example <div widget-cache="widget.cache" widget-config="widget.config" widget-12></div>
       * TODO: create a widget directive template with an isolated scope!
       * TODO: move edit, delete functions either into the directive or call them outside with events :S
       */
      var widgetHolder = element
        .find('.widget-directive-holder')
        .attr('widget-' + scope.widget.typeId, '')
        .attr('widget-config', 'widget.config')
        .attr('widget-data', 'widget.cache');
      $compile(widgetHolder)(scope); // Compile and load the widget type directive


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
      function dragEnd(event) {
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
          restriction: element[0].parentNode,
          elementRect: {top: 0, left: 0, bottom: 1, right: 1},
          endOnly: true
        }
      })
        .on('dragmove', dragMove)
        .on('dragend', dragEnd);
    }
  };
});
