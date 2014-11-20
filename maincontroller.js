angular.module('journey', ['ngMaterial']);
angular.module('journey').controller('MainController', MainController);
angular.module('journey').controller('RouteOptionsController', RouteOptionsController);
angular.module('journey').controller('AddStopController', AddStopController);


MainController.$inject = ['$scope', '$mdDialog'];
RouteOptionsController.$inject = ['$scope', '$mdDialog', 'routeOptions'];
AddStopController.$inject = ['$scope', '$mdDialog'];



function RouteOptionsController($scope, $mdDialog, routeOptions) {
  this.routeOptions = routeOptions;

  this.closeDialog = function() {
    $mdDialog.hide(this.routeOptions);
  }.bind(this);
}

function AddStopController($scope, $mdDialog) {
    /**
     * @type {string}
     */
    this.stopName = '';

    this.closeDialog = function() {
      console.log('t:', this.stopName);
      $mdDialog.hide(this.stopName);
    }.bind(this);
}


function MainController($scope, $mdDialog) {
  /**
   * @type {Array.<City>}
   */
  this.cities = [
    new City('Lugano', null),
    new City('Wenen', null),
    new City('Praag', null)
  ];

  /**
   * @type {google.maps.DirectionsResult}
   */
  this.directions = null;

  /**
   * @type {Array.<string>}
   */
  this.alpahbet = 'a-b-c-d-e-f-g-h-i-j-k-l-m-n-o-p-q-r-s-t-u-v-w-x-y-z'.split('-');

  /**
   * @type {google.maps.DirectionsRequest}
   */
  this.routeOptions = {
    avoidHighways: false,
    avoidTolls: true,
    optimizeWaypoints: true,
    travelMode: google.maps.TravelMode.DRIVING,
    provideRouteAlternatives: true
  };

  this.showEditOptionsMenu = function($event) {
    var routeOptions = this.routeOptions;
    $mdDialog.show({
      targetEvent: $event,
      templateUrl: 'route-options-template.html',
      controller: 'RouteOptionsController',
      controllerAs: 'ctrl',
      locals: {
        'routeOptions': routeOptions
      }
    });
  }.bind(this);

  this.showAddStopDialog = function($event) {
      $mdDialog.show({
        targetEvent: $event,
        templateUrl: 'add-stop-template.html',
        controller: 'AddStopController',
        controllerAs: 'ctrl'
      }).then(function(routeName) {
        console.log('routeName: ', routeName);
        this.addCity(routeName);
      }.bind(this));
  }.bind(this);

  /**
   * @type {google.maps.MapOptions}
   */
  var mapOptions = {
    panControl: false,
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    overviewMapControl: false
  };
  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);
  var directionsService = new google.maps.DirectionsService();



  $scope.$watchCollection(function () {
    return this.cities;
  }.bind(this), function() {
    this.updateMapsDirections();
  }.bind(this));

  $scope.$watch(function() {
    return this.routeOptions;
  }.bind(this), function() {
    this.updateMapsDirections();
  }.bind(this), true);


  this.updateMapsDirections = function() {
    /**
     * @type {Array.<google.maps.DirectionsWaypoint>}
     */
    var waypoints = this.cities.filter( function(_, index){
      return index !== 0 && index !== (this.cities.length - 1);
    }.bind(this)).map(function(city) {
      return {
        location: city.name,
        // If true, indicates that this waypoint is a stop between the origin and destination. This has the effect of splitting the route into two. This value is true by default. Optional.
        stopover: true
      };
    });

    var origin = this.cities[0];
    var destination = this.cities[this.cities.length - 1];

    console.log('origin', origin.name);
    console.log('waypoints', waypoints.map(function(wpoint) {
      return wpoint.location;
    }));
    console.log('destination', destination.name);

    this.routeOptions.origin = origin.name;
    this.routeOptions.destination = destination.name;
    this.routeOptions.waypoints = waypoints;

    directionsService.route(this.routeOptions, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        $scope.$apply(function() {
          this.cities.forEach(function(city, index) {
            city.leg = response.routes[0].legs[index];
          });

          this.route = [];

          response.routes[0].legs.map(function(leg) {
            /** @type {DirectionsLeg} leg */
            this.route.push({
              'start': leg.start_address,
              'end': leg.end_address,
              'distance': leg.distance.text,
              'duration': leg.duration.text
            });
          }.bind(this));

          console.log(this);
        }.bind(this));
      }
    }.bind(this));
  }.bind(this);

  this.route = [];


  /**
   * @param {string} cityName
   */
  this.addCity = function(cityName) {
    this.cities.splice(this.cities.length - 1, 0, new City(cityName));
  }.bind(this);

  /**
   * @type {function(this:MainController)}
   */
  this.removeCity = function(city) {
    var index = this.cities.indexOf(city);
    if (index > -1) {
      this.cities.splice(index, 1);
    }
  }.bind(this);

  /**
   * @type {function(this:MainController)}
   */
  this.moveUp = function(city) {
    var oldIndex = this.cities.indexOf(city);
    arrayMove(this.cities, oldIndex, oldIndex - 1);
  }.bind(this);

  /**
   * @type {function(this:MainController)}
   */
  this.moveDown = function(city) {
    var oldIndex = this.cities.indexOf(city);
    arrayMove(this.cities, oldIndex, oldIndex + 1);
  }.bind(this);
}


/**
 * @param {string} name
 * @param {google.maps.DirectionsLeg} leg
 * @constructor
 */
function City(name, leg) {
  /**
   * @type {string}
   */
  this.name = name;

  /**
   * @type {google.maps.DirectionsLeg}
   */
  this.leg = leg;
}






function initialize() {
  //var mapOptions = {
  //  center: { lat: -34.397, lng: 150.644},
  //  zoom: 8
  //};
  //var map = new google.maps.Map(document.getElementById('map-canvas'),
  //  mapOptions);

  angular.element(document).ready(function() {
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
