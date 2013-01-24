/*global angular, GroupController, GroupDetailController*/

var cbmModule = angular.module('cbm', [])
  .config(['$routeProvider', function ($routeProvider) {
    'use strict';

    $routeProvider
      .when('/groups', {
        templateUrl: 'partials/group-list.html',
        controller: GroupController
      })
      .when('/groups/:groupId', {
        templateUrl: 'partials/group-detail.html',
        controller: GroupDetailController
      })
      .otherwise({
        redirectTo: '/groups'
      });
  }]);
