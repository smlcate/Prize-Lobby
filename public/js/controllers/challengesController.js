app.controller('ChallengesController', function($scope, $http, AuthService) {
  $scope.challenges = [];

  $scope.loadChallenges = function() {
    $http.get('/api/challenges')
      .then(function(response) {
        $scope.challenges = response.data;
      })
      .catch(function(error) {
        console.error('Failed to load challenges:', error);
      });
  };

  $scope.startChallenge = function(challengeId) {
    if (!confirm('Start this challenge now?')) return;

    $http.post('/api/challenges/' + challengeId + '/start', {}, { headers: AuthService.getAuthHeader() })
      .then(function(res) {
        alert('Challenge started: ' + res.data.message);
        $scope.loadChallenges();
      })
      .catch(function(err) {
        alert('Failed to start challenge: ' + (err.data?.error || 'Unknown error'));
      });
  };

  $scope.joinChallenge = function(challengeId) {
    if (!confirm('Join this challenge?')) return;

    $http.post('/api/challenges/' + challengeId + '/join', {}, { headers: AuthService.getAuthHeader() })
      .then(function(res) {
        alert('Joined challenge!');
        $scope.loadChallenges();
      })
      .catch(function(err) {
        alert('Failed to join challenge: ' + (err.data?.error || 'Unknown error'));
      });
  };

  // Initial load
  $scope.loadChallenges();
});
