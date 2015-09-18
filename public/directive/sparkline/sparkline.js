angular.module('openboard').directive('sparkline', function () {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {
      data: '=data'
    },
    templateUrl: 'directive/sparkline/sparkline.html',
    link: function (scope, el, attr, fn) {
      if (scope.data) {
        var svg;
        var x;
        var y;
        var h;
        var w;
        var m;
        var r;
        var max;
        var min;
        var data;
        el = d3.select(el[0]);
        svg = el;
        data = scope.data;
        min = attr.min !== undefined ? +attr.min : d3.min(data);
        max = attr.max !== undefined ? +attr.max : d3.max(data);
        r = attr.r || 0;
        m = r;
        //var w = svg.node().clientWidth;
        //var h = +getComputedStyle(el.node())['font-size'].replace('px', '');
        w = 160;
        h = 80;
        svg.attr({width: w, height: h});

        x = d3.scale.linear().domain([0, data.length - 1]).range([m, w - m]);
        y = d3.scale.linear().domain([min, max]).range([h - m, m]);

        // Draw Sparkline Path
        svg
          .append('path')
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
            var d = data.reverse();
            return d[0];
          });
      }
    }
  };
});
