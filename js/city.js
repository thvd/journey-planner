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
