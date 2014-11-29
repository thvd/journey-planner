/**
 * @typedef {object} FBCity
 * @property {string} $id - an ID.
 * @property {string} name - your name.
 * @property {number} $priority - priority
 */




MapController.$inject = ['$scope', '$mdDialog', '$mdSidenav', '$firebase', 'uiGmapGoogleMapApi', 'uiGmapIsReady', 'uiGmapLogger'];
NavigationDrawerController.$inject = ['$scope', '$mdSidenav', 'uiGmapLogger'];
RouteOptionsController.$inject = ['$scope', '$mdDialog', 'routeOptions'];
AddStopController.$inject = ['$scope', '$mdDialog'];
RouteDetailsController.$inject = ['$scope', '$firebase'];
JourneyConfig.$inject = ['$stateProvider', '$urlRouterProvider', 'uiGmapGoogleMapApiProvider'];

angular.module('journey', ['ngMaterial', 'ui.router', 'uiGmapgoogle-maps', 'firebase']);
angular.module('journey').controller('MapController', MapController);
angular.module('journey').controller('NavigationDrawerController', NavigationDrawerController);
angular.module('journey').controller('RouteOptionsController', RouteOptionsController);
angular.module('journey').controller('AddStopController', AddStopController);
angular.module('journey').controller('RouteDetailsController', RouteDetailsController);
angular.module('journey').config(JourneyConfig);

/**
 * @param {ui.router.state.$stateProvider} $stateProvider
 * @param {$urlRouterProvider} $urlRouterProvider
 * @constructor
 * @param {uiGmapGoogleMapApiProvider} uiGmapGoogleMapApiProvider
 */
function JourneyConfig($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider) {

  $urlRouterProvider.otherwise("/map");

  $stateProvider
      .state('map', {
        'url': '/map',
        'templateUrl': 'partials/map.html',
        'controller': 'MapController',
        'controllerAs': 'mainCtrl'
      })
      .state('details', {
        'url': '/details',
        'templateUrl': 'partials/details.html',
        'controller': 'RouteDetailsController',
        'controllerAs': 'routeDetailsCtrl'
      });

  uiGmapGoogleMapApiProvider.configure({
    'v': '3.17'//,
    //'libraries': 'weather,geometry,visualization',
    //'key': 'key'
  });
}


angular.element(document).ready(function () {
  angular.bootstrap(document, ['journey']);
});


arrayMove = function (arr, old_index, new_index) {
  while (old_index < 0) {
    old_index += arr.length;
  }
  while (new_index < 0) {
    new_index += arr.length;
  }
  if (new_index >= arr.length) {
    var k = new_index - arr.length;
    while ((k--) + 1) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
};
