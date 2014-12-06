/**
 * @param {object} $scope
 * @param {$mdDialog} $mdDialog
 * @param {$mdSidenav} $mdSidenav
 * @param $firebase
 * @constructor
 */
function MapController($scope, $mdDialog, $mdSidenav, $firebase, uiGmapGoogleMapApi, uiGmapIsReady, uiGmapLogger) {
  uiGmapLogger.doLog = true;
  uiGmapLogger.currentLevel = 1;


  /**
   * @type {Firebase}
   */
  var ref = new Firebase('https://journey-planner-1.firebaseio.com/journeys');
  /**
   * @type {AngularFire|Array}
   */
  var _fb = $firebase(ref);


  /**
   * The datastore database to FireBase
   * @type {Array.<FBCity>}
   */
  this._cities = _fb.$asArray();


  /**
   * Store only the data that is displayed in the list on the maps page
   * @type {{legs: Array.<DirectionsLeg>}}
   */
  this.displayRoute = {
    'legs': []
  };

  this.mapSettings = {
    'mapCenter': {
      'latitude': 30,
      'longitude': -90
    },
    'mapZoom': 8
  };


  var isLoaded = false;
  var map = null;
  var directionsDisplay = null;
  var directionsService = null;

  uiGmapIsReady.promise().then(function(instances) {
    this.routeOptions.travelMode = google.maps.TravelMode.DRIVING;
    map = _.first(instances).map;
    console.log('map', map);
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    directionsService = new google.maps.DirectionsService();
    isLoaded = true;
  }.bind(this));

  this.mapControl = {};

  /**
   * @type {google.maps.DirectionsRequest}
   */
  this.routeOptions = {
    avoidHighways: false,
    avoidTolls: true,
    //optimizeWaypoints: true,
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
      console.log('this._cities.$add: ', routeName);
      var lastCity = this._cities[this._cities.length - 1];
      var priority = 0;
      if (lastCity) {
        priority = lastCity.$priority + 1;
      } else {
        priority = 0;
      }
      this._cities.$add({
        'name': routeName,
        '$priority': priority
      });
    }.bind(this));
  }.bind(this);

  // this.openSideNav = function () {
  //   $mdSidenav('left').open();
  // }.bind(this);

  /**
   * @type {google.maps.MapOptions}
   */
  this.mapOptions = {
    panControl: false,
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    overviewMapControl: false,

    center: { lat: -34.397, lng: 150.644},
    zoom: 8
  };


  $scope.$watchCollection(function () {
    return this._cities;
  }.bind(this), update.bind(this));

  $scope.$watch(function () {
    return this.routeOptions;
  }.bind(this), update.bind(this), true);


  /**
   */
  function update() {
    this.updateMapsDirections();
  }

  this.updateMapsDirections = function () {
    if (!isLoaded || this._cities.length < 1) {
      return;
    }
    /**
     * @type {Array.<google.maps.DirectionsWaypoint>}
     */
    var waypoints = this._cities.filter(function (_, index) {
      return index !== 0 && index !== (this._cities.length - 1);
    }.bind(this)).map(function (city) {
      return {
        location: city.name,
        // If true, indicates that this waypoint is a stop between the origin and destination. This has the effect of splitting the route into two. This value is true by default. Optional.
        stopover: true
      };
    });

    var origin = this._cities[0].name;
    var destination = this._cities[this._cities.length - 1].name;

    console.log('origin', origin);
    console.log('waypoints', waypoints.map(function (wpoint) {
      return wpoint.location;
    }));
    console.log('destination', destination);

    this.routeOptions.origin = origin;
    this.routeOptions.destination = destination;
    this.routeOptions.waypoints = waypoints;

    directionsService.route(this.routeOptions, function (response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        $scope.$apply(function () {

          this.displayRoute.legs = response.routes[0].legs.map(function(leg) {
            leg._cities = [leg.start_address, leg.end_address];
            return leg;
          });
        }.bind(this));
      }
    }.bind(this));
  }.bind(this);
}
