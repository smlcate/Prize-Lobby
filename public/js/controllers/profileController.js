angular.module('mainApp')
.controller('ProfileController', function($scope, AuthService) {
  const userId = AuthService.getUserId();
  $scope.stats = {
    matches: 0,
    wins: 0,
    losses: 0
  };

  // Example only – replace with actual API call to load stats
  if (userId) {
    // Simulated values
    $scope.stats.matches = 12;
    $scope.stats.wins = 5;
    $scope.stats.losses = 7;
  }
});
