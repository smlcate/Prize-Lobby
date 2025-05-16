app.controller('MatchController', function($scope, $http, $stateParams, $window, $interval) {
  const matchId = $stateParams.id;
  const token = $window.localStorage.getItem('token');

  $scope.result = { teamA: 0, teamB: 0 };
  $scope.match = {};
  $scope.polling = true;

  function fetchMatch() {
    $http.get(`/api/matches/${matchId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const newMatch = res.data;
      $scope.match = newMatch;
      $scope.isParticipant = newMatch.user_is_participant;
      $scope.match.winnerName = newMatch.winner_name;

      // Stop polling once verified
      if (newMatch.result_verified) {
        $scope.polling = false;
      }
    }).catch(err => {
      console.error('❌ Failed to fetch match', err);
    });
  }

  // Initial fetch
  fetchMatch();

  // Poll every 15 seconds
  const poller = $interval(() => {
    if ($scope.polling) {
      fetchMatch();
    } else {
      $interval.cancel(poller);
    }
  }, 15000);

  // Clean up on destroy
  $scope.$on('$destroy', () => {
    $interval.cancel(poller);
  });

  $scope.submitResult = function () {
    $http.post(`/api/matches/${matchId}/submit`, $scope.result, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      alert('✅ Result submitted');
      fetchMatch(); // Immediate fetch
    }).catch(err => {
      alert('❌ Submission failed');
      console.error(err);
    });
  };
});
