/**
 * @typedef {object} FBCity
 * @property {string} $id - an ID.
 * @property {string} name - your name.
 * @property {number} $priority - priority
 */



angular.module('journey', ['ngMaterial', 'ui.router', 'uiGmapgoogle-maps', 'firebase']);
angular.module('journey').config(JourneyConfig);

angular.module('journey').service('GooglePlacesService', GooglePlacesService);

angular.module('journey').controller('MapController', MapController);
angular.module('journey').controller('NavigationDrawerController', NavigationDrawerController);
angular.module('journey').controller('RouteOptionsController', RouteOptionsController);
angular.module('journey').controller('AddStopController', AddStopController);
angular.module('journey').controller('RouteDetailsController', RouteDetailsController);
angular.module('journey').controller('CityDetailController', CityDetailController);


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
      .state('cities', {
        'url': '/cities',
        'templateUrl': 'partials/details.html',
        'controller': 'RouteDetailsController',
        'controllerAs': 'routeDetailsCtrl'
      })
      .state('cities.detail', {
        'url': '/:cityId',
        'templateUrl': 'partials/city-details.html',
        'controller': 'CityDetailController',
        'controllerAs': 'cityDetailCtrl'
      });

  uiGmapGoogleMapApiProvider.configure({
    'v': '3.17',
    'libraries': 'places', //'weather,geometry,visualization',
    'key': 'GOOGLE_API_KEY'
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
