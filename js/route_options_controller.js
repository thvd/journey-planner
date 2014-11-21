function RouteOptionsController($scope, $mdDialog, routeOptions) {
  this.routeOptions = routeOptions;

  this.closeDialog = function () {
    $mdDialog.hide(this.routeOptions);
  }.bind(this);
}
