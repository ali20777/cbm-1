/*global cbmModule, d3, angular, console*/

cbmModule.directive('chart', function () {
  'use strict';

  return {
    restrict: 'E', // directive can only be invoked using the template tag
    link: function (scope, element, attributes) {
      // initialization, done once per tag in the template

      var data = angular.element(element.children()[0]),
        width = 960,
        height = 600,
        chart = d3.select(element[0])
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height);

      // whenever the model changes, execute this
      scope.$watch(attributes.ngModel, function (newValue, oldValue) {

        // leave if nothing exists
        if (!newValue) {
          return;
        }

        // clear the elements inside the directive
        chart.selectAll('*').remove();

        var w = 800,
          h = 400,
          padding = 10,
          barWidth = 40,
          bottom = h - 2 * padding,
          colors = ['#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE',
                    '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92', '#2F4F4F'],
          numberOfRuns = 4,
          upperDomain = 2000,
          // domain is range of possible input data values
          // range is possible output values
          x = d3.scale.linear().domain([0, numberOfRuns + 1]).range([0, w - padding * 2]),
          y = d3.scale.linear().domain([0, upperDomain]).range([bottom, 0]),
          points = newValue.points,
          /*
          points = [{a: value['points'][0][0], b: 8, c: 15},
                    {a: value['points'][1][0], b: 23, c: 42},
                    {a: value['points'][2][0], b: 48, c: 1},
                    {a: value['points'][3][0], b: 12, c: 18}],
          
          points = [{a: 4, b: 8, c: 15},
                    {a: 16, b: 23, c: 42},
                    {a: 12, b: 48, c: 1},
                    {a: 40, b: 12, c: 18}],
          */
          bars1 = chart.selectAll('rect')
                      .data(points)
                    .enter().append('svg:rect')
                      .attr('fill', colors[0])
                      .attr('x', function (d, i) { return x(i); })
                      .attr('y', function (d) { return y(d[0]); })
                      .attr('width', barWidth)
                      .attr('height', function (d) { return bottom - y(d[0]); }),
          rules = chart.selectAll('g.rule')
                      .data(points)
                    .enter().append('svg:g')
                      .attr('class', 'rule');

        // second data series
        rules.append('svg:rect')
          .attr('fill', colors[1])
          .attr('x', function (d, i) { return x(i); })
          .attr('y', function (d) { return y(d[1]) - (bottom - y(d[0])); })
          .attr('width', barWidth)
          .attr('height', function (d) { return bottom - y(d[1]); });

        // third data series
        rules.append('svg:rect')
          .attr('fill', colors[2])
          .attr('x', function (d, i) { return x(i); })
          .attr('y', function (d) { return y(d[2]) - (bottom - y(d[0])) - (bottom - y(d[1])); })
          .attr('width', barWidth)
          .attr('height', function (d) { return bottom - y(d[2]); });

        // fourth data series
        rules.append('svg:rect')
          .attr('fill', colors[3])
          .attr('x', function (d, i) { return x(i); })
          .attr('y', function (d) { return y(d[3]) - (bottom - y(d[2])) - (bottom - y(d[0])) - (bottom - y(d[1])); })
          .attr('width', barWidth)
          .attr('height', function (d) { return bottom - y(d[3]); });

        // horizontal axis
        rules.append('svg:text')
          .attr('y', h)
          .attr('x', function (d, i) { return x(i) + (2 * padding); })
          .attr('dy', '.35em')
          .attr('text-anchor', 'middle')
          .text(function (d, i) { return 'Run ' + (i + 1); });

        /* vertical axis
        var yAxis = d3.svg.axis()
                    .scale(y)
                    .tickSize(1)
                    .ticks(5)
                    .orient('left');

        chart.append('g')
          .attr('class', 'axis')
          .attr('transform', 'translate(' + padding + ', 0)')
          .call(yAxis);
        */

      }, true); // pass true to watch object's properties
    }
  };
});
