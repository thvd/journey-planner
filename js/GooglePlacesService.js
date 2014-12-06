function GooglePlacesService($q, uiGmapGoogleMapApi) {
  /**
   * @type {$q}
   */
  this._$q = $q;
  /**
   * @type {google.maps.Geocoder}
   * @private
   */
  this._geocoder = null;

  this._placesService = null;


  this._uiGmapGoogleMapApi = uiGmapGoogleMapApi;
}

/**
 * @param {GeocoderRequest} request
 * @returns {Promise}
 */
GooglePlacesService.prototype.geocode = function(request) {
  return this._uiGmapGoogleMapApi.then(function() {
    if (!this._geocoder) {
      this._geocoder = new google.maps.Geocoder();
    }
    return this._$q(function(resolve, reject) {
      this._geocoder.geocode(request, function(result, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          resolve(result);
        } else {
          reject(status);
        }
      });
    }.bind(this));
  }.bind(this));
};

/**
 * @param {PlaceSearchRequest} request
 * @returns {Promise}
 */
GooglePlacesService.prototype.nearbySearch = function(request) {
  return this._uiGmapGoogleMapApi.then(function() {
    if (!this._placesService) {
      this._placesService = new google.maps.places.PlacesService(document.createElement('div'));
    }
    return this._$q(function(resolve, reject) {
      this._placesService.nearbySearch(request, function(result, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          resolve(result);
        } else {
          reject(status);
        }
      });
    }.bind(this));
  }.bind(this));
};
