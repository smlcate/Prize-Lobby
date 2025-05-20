app.controller('AdminController', function($scope, $state) {
  $scope.goTo = function(route) {
    $state.go(route);
  };
});
