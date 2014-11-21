/**
 * @param {object} $scope
 * @param {$mdDialog} $mdDialog
 * @param {$mdSidenav} $mdSidenav
 * @param {CityDataStoreService} CityDataStoreService
 * @constructor
 */
function MapController($scope, $mdDialog, $mdSidenav, CityDataStoreService) {
  /**
   * @type {Array.<City>}
   */
  this.cities = CityDataStoreService.getAll();

  this.route = [];

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

  this.showEditOptionsMenu = function ($event) {
    var routeOptions = this.routeOptions;
    $mdDialog.show({
      targetEvent: $event,
      templateUrl: 'partials/route-options-template.html',
      controller: 'RouteOptionsController',
      controllerAs: 'ctrl',
      locals: {
        'routeOptions': routeOptions
      }
    });
  }.bind(this);

  this.showAddStopDialog = function ($event) {
    $mdDialog.show({
      targetEvent: $event,
      templateUrl: 'partials/add-stop-template.html',
      controller: 'AddStopController',
      controllerAs: 'ctrl'
    }).then(function (routeName) {
      console.log('routeName: ', routeName);
      this.addCity(routeName);
    }.bind(this));
  }.bind(this);

  this.openSideNav = function () {
    $mdSidenav('left').open();
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
    overviewMapControl: false,

    center: { lat: -34.397, lng: 150.644},
    zoom: 8
  };
  /**
   * @type {google.maps.Map}
   */
  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);
  var directionsService = new google.maps.DirectionsService();


  $scope.$watchCollection(function () {
    return this.cities;
  }.bind(this), function () {
    this.updateMapsDirections();
  }.bind(this));

  $scope.$watch(function () {
    return this.routeOptions;
  }.bind(this), function () {
    this.updateMapsDirections();
  }.bind(this), true);


  this.updateMapsDirections = function () {
    if (this.cities.length < 1) {
      return;
    }
    /**
     * @type {Array.<google.maps.DirectionsWaypoint>}
     */
    var waypoints = this.cities.filter(function (_, index) {
      return index !== 0 && index !== (this.cities.length - 1);
    }.bind(this)).map(function (city) {
      return {
        location: city.name,
        // If true, indicates that this waypoint is a stop between the origin and destination. This has the effect of splitting the route into two. This value is true by default. Optional.
        stopover: true
      };
    });

    var origin = CityDataStoreService.getOrigin();
    var destination = CityDataStoreService.getDestination();

    console.log('origin', origin.name);
    console.log('waypoints', waypoints.map(function (wpoint) {
      return wpoint.location;
    }));
    console.log('destination', destination.name);

    this.routeOptions.origin = origin.name;
    this.routeOptions.destination = destination.name;
    this.routeOptions.waypoints = waypoints;

    directionsService.route(this.routeOptions, function (response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        $scope.$apply(function () {
          this.cities.forEach(function (city, index) {
            city.leg = response.routes[0].legs[index];
          });

          this.route = [];

          response.routes[0].legs.map(function (leg) {
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


  /**
   * @param {string} cityName
   */
  this.addCity = function (cityName) {
    this.cities.splice(this.cities.length - 1, 0, new City(cityName, null));
  }.bind(this);

  /**
   * @param {City} city
   */
  this.removeCity = function (city) {
    CityDataStoreService.remove(city);
  }.bind(this);

  /**
   * @param {City} city
   */
  this.moveUp = function (city) {
    CityDataStoreService.moveUp(city);
  }.bind(this);

  /**
   * @param {City} city
   */
  this.moveDown = function (city) {
    CityDataStoreService.moveDown(city);
  }.bind(this);
}
