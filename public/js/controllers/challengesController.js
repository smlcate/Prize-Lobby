
app.controller('ChallengesController', function($scope, $http, AuthService) {
  console.log('[ChallengesController] Initialized');

  $scope.challenges = [];

  function loadChallenges() {
    $http.get('/api/challenges', {
      headers: {
        Authorization: 'Bearer ' + AuthService.getToken()
      }
    })
    .then(function(response) {
      console.log('[ChallengesController] Loaded challenges:', response.data);
      $scope.challenges = response.data;
    })
    .catch(function(error) {
      console.error('[ChallengesController] Error loading challenges:', error);
    });
  }

  loadChallenges();
});
