// File: controllers/verifyMatchController.js
app.controller('VerifyMatchController', function($scope, $http, $stateParams) {
  const matchId = $stateParams.id;
  $scope.match = {};
  $scope.error = null;

  $scope.verifyMatch = function() {
    $http.post('/api/matches/' + matchId + '/verify')
      .then(function(res) {
        $scope.match.verified = true;
        $scope.match.result = res.data.result;
      })
      .catch(function(err) {
        console.error('[VerifyMatchController] Error:', err);
        $scope.error = err.data.error || 'Verification failed';
      });
  };

  // Optionally fetch match info (static for now)
  $scope.match = {
    id: matchId,
    game: 'apex',  // Replace this with a dynamic loader if needed
    verified: false
  };
});
