app.controller('MainController', function($scope) {
  $scope.isDarkMode = false;

  $scope.toggleTheme = function() {
    $scope.isDarkMode = !$scope.isDarkMode;
  };
});
