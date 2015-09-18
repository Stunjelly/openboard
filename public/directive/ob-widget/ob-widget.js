angular.module('openboard').directive('obWidget', function ($modal) {
  return {
    restrict: 'EA',
    replace: true,
    scope: true,
    templateUrl: 'directive/ob-widget/ob-widget.html',
    link: function (scope, element, attrs, fn) {

      // Setup init position
      element[0].style.transform = 'translate(' + scope.widget.x + 'px, ' + scope.widget.y + 'px)';

      // Init interact on the element
      interact(element[0])
        .draggable({
          snap: {
            targets: [
              interact.createSnapGrid({x: 10, y: 10})
            ],
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
        .on('dragmove', function (event) {

          scope.widget.x += event.dx;
          scope.widget.y += event.dy;


          event.target.style.webkitTransform =
            event.target.style.transform = 'translate(' + scope.widget.x + 'px, ' + scope.widget.y + 'px)';
        })
        .on('dragend', function (event) {
          scope.widget.$save();
        });
    }
  };
});
