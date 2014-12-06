function NavigationDrawerController($scope, $mdSidenav, uiGmapLogger) {
  uiGmapLogger.currentLevel = 1;
  this.close = function () {
    $mdSidenav('left').close();
  }.bind(this);

  this.open = function () {
    $mdSidenav('left').open();
  };
}
