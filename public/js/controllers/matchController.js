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

      if (newMatch.result_verified) {
        $scope.polling = false;
      }
    }).catch(err => {
      console.error('❌ Failed to fetch match', err);
    });
  }

  fetchMatch();

  const poller = $interval(() => {
    if ($scope.polling) {
      fetchMatch();
    } else {
      $interval.cancel(poller);
    }
  }, 15000);

  $scope.$on('$destroy', () => {
    $interval.cancel(poller);
  });

  $scope.submitResult = function () {
    $http.post(`/api/matches/${matchId}/submit`, $scope.result, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      $scope.$applyAsync(() => alert('✅ Result submitted'));
      fetchMatch();
    }).catch(err => {
      $scope.$applyAsync(() => alert('❌ Submission failed'));
      console.error(err);
    });
  };
});
