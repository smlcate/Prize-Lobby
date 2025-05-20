app.controller('ChallengeResultController', function($scope, $http, $location) {
  const challengeId = $location.search().id;

  $scope.opponentName = '';
  $scope.userScore = 0;
  $scope.opponentScore = 0;
  $scope.status = '';
  $scope.canDispute = false;
  $scope.alreadyDisputed = false;

  $http.get('/api/challenges/' + challengeId + '/result').then(res => {
    const data = res.data;
    $scope.status = data.status;
    $scope.userScore = data.userScore;
    $scope.opponentScore = data.opponentScore;
    $scope.opponentName = data.opponentName;
    $scope.canDispute = ['completed', 'draw'].includes(data.status);
    $scope.alreadyDisputed = data.alreadyDisputed;
  });

  $scope.submitDispute = function() {
    const reason = prompt('Why are you disputing the result?');
    if (!reason || reason.length < 5) return alert('Please enter a valid reason.');

    $http.post('/api/challenges/' + challengeId + '/dispute', { reason }).then(res => {
      alert('Dispute submitted.');
      $scope.alreadyDisputed = true;
    }, err => {
      alert(err.data.error || 'Dispute failed.');
    });
  };

  $scope.mockVerify = function(challengeId) {
    $http.post('/api/mock/verify/' + challengeId, { winner_id: $scope.currentUser.id })
      .then(() => alert("Simulated match complete!"))
      .catch(() => alert("Error simulating match"));
  };
});
