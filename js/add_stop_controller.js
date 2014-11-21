function AddStopController($scope, $mdDialog) {
  /**
   * @type {string}
   */
  this.stopName = '';

  this.closeDialog = function () {
    console.log('t:', this.stopName);
    $mdDialog.hide(this.stopName);
  }.bind(this);
}
