/**
 * @constructor
 */
function CityDataStoreService() {
  /**
   * @type {Array.<City>}
   * @private
   */
  this._cities = [];
}

CityDataStoreService.prototype.getAll = function() {
  return this._cities;
};
/**
 * @param {Array.<City>} cities
 * @returns {CityDataStoreService}
 */
CityDataStoreService.prototype.save = function(cities) {
  this._cities = cities;
  return this;
};

/**
 * @param {City} city
 * @returns {CityDataStoreService}
 */
CityDataStoreService.prototype.add = function(city) {
  this._cities.push(city);
  return this;
};

/**
 * @param {City} city
 * @returns {CityDataStoreService}
 */
CityDataStoreService.prototype.remove = function(city) {
  var index = this._cities.indexOf(city);
  if (index > -1) {
    this._cities.splice(index, 1);
  }
  return this;
};

/**
 * @param {City} city
 * @returns {CityDataStoreService}
 */
CityDataStoreService.prototype.moveUp = function (city) {
  var oldIndex = this._cities.indexOf(city);
  arrayMove(this._cities, oldIndex, oldIndex - 1);
  return this;
};

/**
 * @param {City} city
 * @returns {CityDataStoreService}
 */
CityDataStoreService.prototype.moveDown = function (city) {
  var oldIndex = this._cities.indexOf(city);
  arrayMove(this._cities, oldIndex, oldIndex + 1);
  return this;
};

/**
 * @returns {City}
 */
CityDataStoreService.prototype.getOrigin = function () {
  return this._cities[0];
};

/**
 * @returns {City}
 */
CityDataStoreService.prototype.getDestination = function () {
  return this._cities[this._cities.length - 1];
};
