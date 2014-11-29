function RouteDetailsController($scope, $firebase) {

  var ref = new Firebase('https://journey-planner-1.firebaseio.com/journeys');
  /**
   * @type {AngularFire|Array}
   */
  this._fb = $firebase(ref);


  /**
   * The datastore database to FireBase
   * @type {Array}
   */
  this._cities = this._fb.$asArray();


  this.moveUp = function(city) {
    var index = this._cities.indexOf(city);
    var previousCity = this._cities[index - 1];
    if (previousCity) {
      if (previousCity.$priority) {
        previousCity.$priority += 1;
      } else {
        previousCity.$priority = 1;
      }
      if (city.$priority) {
        city.$priority -= 1;
      } else {
        city.$priority = 0;
      }
      this._cities.$save(previousCity);
      this._cities.$save(city);
    }
  }.bind(this);

  this.moveDown = function(city) {
    var index = this._cities.indexOf(city);
    var nextCity = this._cities[index + 1];
    if (nextCity) {
      if (nextCity.$priority) {
        nextCity.$priority -= 1;
      } else {
        nextCity.$priority = 0;
      }
      if (city.$priority) {
        city.$priority += 1;
      } else {
        city.$priority = 1;
      }
      this._cities.$save(nextCity);
      this._cities.$save(city);
    }
  }.bind(this);

}