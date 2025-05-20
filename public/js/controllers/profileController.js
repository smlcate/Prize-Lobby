app.controller('ProfileController', function($scope, $http, AuthService) {
  $scope.profile = {};
  $scope.gamertags = [];
  $scope.newGamertag = {};
  $scope.error = '';
  $scope.leagueSummoner = '';
  $scope.leagueSuccess = '';
  $scope.leagueError = '';

  $http.get('/api/users/me', { headers: AuthService.getAuthHeader() }).then(function(response) {
    $scope.profile = response.data;
  });

  $http.get('/api/gamertags', { headers: AuthService.getAuthHeader() }).then(function(response) {
    $scope.gamertags = response.data;
  });

  $scope.addGamertag = function() {
    $http.post('/api/gamertags', $scope.newGamertag, { headers: AuthService.getAuthHeader() })
      .then(function(response) {
        $scope.gamertags.push(response.data);
        $scope.newGamertag = {};
        $scope.error = '';
      })
      .catch(function(error) {
        $scope.error = error.data.error || 'Failed to add gamertag';
      });
  };

  $scope.deleteGamertag = function(id) {
    $http.delete('/api/gamertags/' + id, { headers: AuthService.getAuthHeader() }).then(function() {
      $scope.gamertags = $scope.gamertags.filter(g => g.id !== id);
    });
  };

  $scope.addLeagueAccount = function() {
    if (!$scope.leagueSummoner) return;

    $http.get('/api/verify/league/' + encodeURIComponent($scope.leagueSummoner), {
      headers: AuthService.getAuthHeader()
    })
    .then(function(res) {
      $scope.leagueSuccess = res.data.message;
      $scope.leagueError = '';
    })
    .catch(function(err) {
      $scope.leagueError = err.data?.error || 'Verification failed.';
      $scope.leagueSuccess = '';
    });
  };
});
