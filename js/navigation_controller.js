function NavigationDrawerController($scope, $mdSidenav) {
  this.close = function () {
    $mdSidenav('left').close();
  }.bind(this);
}
