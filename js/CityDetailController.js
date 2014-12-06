/**
 * @typedef {object} DisplayHotel
 * @type {string} id
 * @type {string} name
 * @type {string} icon
 * @type {string} website
 * @type {number} rating
 * @type {Array.<string>} photos A list of urls to photos
 * @type {Array.<google.maps.places.PlaceReview>} review A list of reviews
 */


/**
 * @param {object} $stateParams
 * @param $firebase
 * @constructor
 * @param {GooglePlacesService} GooglePlacesService
 */
function CityDetailController($scope, $stateParams, $firebase, GooglePlacesService) {
  this.cityId = $stateParams;

  var ref = new Firebase('https://journey-planner-1.firebaseio.com/journeys/' + $stateParams.cityId);
  /**
   * @type {AngularFire|Array}
   */
  var _fb = $firebase(ref);

  /**
   * @type {boolean}
   */
  this.showHotelsWithoutRating = false;

  /**
   * @type {int}
   */
  this.hotelsWithoutRatingCount = undefined;

  /**
   * The datastore database to FireBase
   * @type {Array}
   */
  this.city = _fb.$asObject();

  /**
   * @type {Array.<DisplayHotel>}
   */
  this.hotels = [];

  this.city.$loaded().then(function() {
    return GooglePlacesService.geocode({
      'address': this.city.name
    });
  }.bind(this)).then(function(geocodeResults) {
    return GooglePlacesService.nearbySearch({
      //bounds: map.getBounds(),
      'location': geocodeResults[0].geometry.location,
      'types': ['lodging'],
      'radius': 10000
    });
  }).then(function(placeResults) {
    /**
     * @type {Array.<PlaceResult>} placeResults
     */

    this.hotels = placeResults.map(function(placeResult) {
      if (!angular.isArray(placeResult.photos)) {
        placeResult.photos = [];
      }
      return {
        'id': placeResult.id,
        'name': placeResult.name,
        'icon': placeResult.icon,
        'rating': placeResult.rating,
        'website': placeResult.website,
        'reviews': placeResult.reviews,
        'photos': placeResult.photos.map(function(photo) {
          /**
           * @type {google.maps.places.PlacePhoto} photo
           */
          return photo.getUrl({
            'maxHeight': 400
          });
        })
      }
    });

  }.bind(this));

  $scope.$watch(function() {
    return this.hotels;
  }.bind(this), /** @param {Array.<DisplayHotel>} newHotels */ function(newHotels) {
    this.hotelsWithoutRatingCount = newHotels.filter(/** @param {DisplayHotel} hotel */function(hotel) {
      return angular.isUndefined(hotel.rating);
    }).length;
  }.bind(this));

  /**
   * @param {DisplayHotel} hotel
   * @param {int} index
   * @returns {boolean}
   */
  this.filterWithOrWithoutRating = function(hotel, index) {
    return this.showHotelsWithoutRating || !angular.isUndefined(hotel.rating);
  }.bind(this);

  this.filterWithOrWithoutRating.$stateful = true;
}
