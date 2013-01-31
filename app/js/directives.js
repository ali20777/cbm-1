/*global cbmModule, d3, angular, console*/

cbmModule.directive('chart', function () {
  'use strict';

  return {
    restrict: 'E', // directive can only be invoked using the template tag
    link: function (scope, element, attributes) {
      // initialization, done once per tag in the template

      var data = angular.element(element.children()[0]),
        margin = {'top': 20, 'right': 20, 'bottom': 60, 'left': 40},
        width = 960 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom,
        svg = d3.select(element[0])
                    .append('svg')
                      .attr('width', width + margin.left + margin.right)
                      .attr('height', height + margin.top + margin.bottom)
                    .append('g') // group element
                      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      // whenever the model changes, execute this
      scope.$watch(attributes.ngModel, function (newValue, oldValue) {

        // leave if nothing exists
        if (!newValue) {
          return;
        }

        // clear the elements inside the directive
        svg.selectAll('*').remove();

        var measurements = [],
          x = d3.scale.ordinal().rangeRoundBands([0, width], 0.1),
          y = d3.scale.linear().rangeRound([height, 0]),
          xAxis = d3.svg.axis().scale(x).orient("bottom"),
          yAxis = d3.svg.axis().scale(y).orient("left"),
          color = d3.scale.category20(),
          legend,
          run;

        data = newValue.points;
        angular.forEach(data[0].points, function (value, index) {
          measurements.push(value.measurement);
        });

        x.domain(data.map(function (d) { return 'Run ' + d.run; }));
        y.domain([0, d3.max(data, function (d) { return d.total; })]);
        color.domain(measurements);

        svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);

        svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Points");

        run = svg.selectAll(".run")
          .data(data)
          .enter().append("g")
          .attr("class", "g")
          .attr("transform", function (d) { return "translate(" + x(d.run) + ",0)"; });

        run.selectAll("rect")
          .data(function (d) { return d.points; })
          .enter().append("rect")
          .attr("width", x.rangeBand())
          .attr("y", function (d) { return y(d.y1); })
          .attr("height", function (d) { return y(d.y0) - y(d.y1); })
          .style("fill", function (d, i) { return color(d.measurement); });

        legend = svg.selectAll(".legend")
          .data(measurements.slice().reverse())
          .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
          .attr("x", width - 18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);

        legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function (d) { return d; });

      }, true); // pass true to watch object's properties
    }
  };
});
