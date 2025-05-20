
mainApp.controller('leaderboardController', function($scope, $http) {
  $scope.game = '';
  $scope.platform = '';
  $scope.leaderboard = [];

  $scope.loadLeaderboard = function() {
    const params = {};
    if ($scope.game) params.game = $scope.game;
    if ($scope.platform) params.platform = $scope.platform;

    $http.get('/api/leaderboard', { params }).then(function(res) {
      $scope.leaderboard = res.data;
    }).catch(function(err) {
      alert('Failed to load leaderboard');
      console.error(err);
    });
  };

  $scope.loadLeaderboard();
});
