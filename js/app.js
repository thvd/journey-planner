MapController.$inject = ['$scope', '$mdDialog', '$mdSidenav', 'CityDataStoreService'];
NavigationDrawerController.$inject = ['$scope', '$mdSidenav'];
RouteOptionsController.$inject = ['$scope', '$mdDialog', 'routeOptions'];
AddStopController.$inject = ['$scope', '$mdDialog'];
CityDataStoreService.$inject = [];
JourneyConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

angular.module('journey', ['ngMaterial', 'ui.router', 'uiGmapgoogle-maps']);
angular.module('journey').controller('MapController', MapController);
angular.module('journey').controller('NavigationDrawerController', NavigationDrawerController);
angular.module('journey').controller('RouteOptionsController', RouteOptionsController);
angular.module('journey').controller('AddStopController', AddStopController);
angular.module('journey').service('CityDataStoreService', CityDataStoreService);
angular.module('journey').config(JourneyConfig);

/**
 * @param {ui.router.state.$stateProvider} $stateProvider
 * @param {$urlRouterProvider} $urlRouterProvider
 * @constructor
 */
function JourneyConfig($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/map");
  //
  // Now set up the states
  $stateProvider
      .state('map', {
        url: '/map',
        templateUrl: 'partials/map.html',
        'controller': 'MapController',
        'controllerAs': 'mainCtrl'
      })
      //.state('state1.list', {
      //  url: "/list",
      //  templateUrl: "partials/state1.list.html",
      //  controller: function($scope) {
      //    $scope.items = ["A", "List", "Of", "Items"];
      //  }
      //})
      .state('details', {
        url: '/details',
        templateUrl: 'partials/details.html'
      })
      /*.state('state2.list', {
        url: "/list",
        templateUrl: "partials/state2.list.html",
        controller: function($scope) {
          $scope.things = ["A", "Set", "Of", "Things"];
        }
      })*/;
}


function initialize() {
  //var mapOptions = {
  //  center: { lat: -34.397, lng: 150.644},
  //  zoom: 8
  //};
  //var map = new google.maps.Map(document.getElementById('map-canvas'),
  //  mapOptions);

  angular.element(document).ready(function () {
    angular.bootstrap(document, ['journey']);
  });

}

google.maps.event.addDomListener(window, 'load', initialize);


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
