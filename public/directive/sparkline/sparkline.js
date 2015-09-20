angular.module('openboard').directive('sparkline', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'directive/sparkline/sparkline.html',
    link: function (scope, el, attr, fn) {
      function drawSVG(d) {
        var svg, x, y, h, w, m, r, max, min, data;
        svg = d3.select(el[0]);
        data = d;
        min = attr.min !== undefined ? +attr.min : d3.min(data);
        max = attr.max !== undefined ? +attr.max : d3.max(data);
        r = attr.r || 0;
        m = r;
        w = 160;
        h = 80;

        svg.selectAll("*").remove();

        svg.attr('width', w).attr('height', h);

        x = d3.scale.linear().domain([0, data.length - 1]).range([m, w - m]);
        y = d3.scale.linear().domain([min, max]).range([h - m, m]);

        // Draw Sparkline Path
        svg.append('path')
          .data(data)
          .attr('d', 'M' + data.map(function (d, i) {
            return [x(i), y(d)]
          }).join('L'));

        // Add latest count
        svg.append('text')
          .attr('x', w + 10)
          .attr('y', (h / 2) + 10)
          .attr('width', 60)
          .attr('stroke', 0)
          .text(function () {
            var d = data;
            //d.reverse();
            return d[0];
          });
      }
      scope.$watchCollection('widget.cache.item[1]', function (newVal, oldVal) {
        return drawSVG(scope.widget.cache.item[1]);
      });
    }
  };
});
