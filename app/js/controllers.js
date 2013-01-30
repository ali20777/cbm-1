/*jslint plusplus: true */
/*global console, angular*/

function GroupController($scope, $http) {
  'use strict';

  $http.get('json/groups.json').success(function (data) {
    $scope.groups = data;
  });
}

function GroupDetailController($scope, $routeParams, $http) {
  'use strict';

  $http.get('json/' + $routeParams.groupId + '.json').success(function (data) {
    $scope.group = data;
    $scope.calculatePoints();
  });

  $scope.addMeasurement = function () {
    // add the new measurement
    $scope.group.measurements.push({
      'name': $scope.measurementName,
      'units': $scope.measurementUnits,
      'factor': 0,
      'offset': 0,
      'lower': 0,
      'upper': 10
    });

    // set a default value for the new measurement to each run
    angular.forEach($scope.group.runs, function (value, index) {
      $scope.group.runs[index].push(0);
    });

    // reset the input fields
    $scope.measurementName = '';
    $scope.measurementUnits = '';
  };

  $scope.deleteMeasurement = function (index) {
    // remove the measurement
    $scope.group.measurements.splice(index, 1);

    // remove the measurement value from each run
    angular.forEach($scope.group.runs, function (value, i) {
      $scope.group.runs[i].splice(index, 1);
    });
  };

  $scope.calculatePointsForRun = function (index) {
    var i,
      points = [],
      currentMeasurement,
      numberOfMeasurements = $scope.group.measurements.length,
      currentRun = $scope.group.runs[index],
      value;

    // console.log('begin calculatePointsForRun with index ' + index);

    for (i = 0; i < numberOfMeasurements; i++) {
      currentMeasurement = $scope.group.measurements[i];
      value = currentRun[i];
      points[i] = currentMeasurement.factor * value + currentMeasurement.offset;
    }

    // console.log(points);
    // console.log('end calculatePointsForRun');

    return points;
  };

  $scope.calculatePoints = function () {
    var i,
      points = [],
      numberOfRuns = 4;

    // console.log('begin calculatePoints');

    for (i = 0; i < numberOfRuns; i++) {
      points.push($scope.calculatePointsForRun(i));
    }

    $scope.group.points = points;

    /*
    $scope.group.points = [
      [8, 200, 300, 400],
      [16, 300, 400, 500],
      [24, 400, 500, 600],
      [80, 500, 600, 700]
    ];
    */

    // console.log('end calculatePoints');
    // console.log(points);
  };

  $scope.$watch('group.measurements', function (newValue, oldValue) {
    // console.log('watching');
    if (newValue === oldValue) {
      return;
    }
    // console.log('found a change');
    // console.log(newValue);
    $scope.calculatePoints();
  }, true);

}
