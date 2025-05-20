app.controller('EventsController', function($scope, $http, $stateParams, $window, $interval) {
  const token = $window.localStorage.getItem('token');
  $scope.currentUserId = parseInt($window.localStorage.getItem('user_id'));
  const headers = { Authorization: 'Bearer ' + token };
  const id = $stateParams.id;

  if (id) {
    $http.get(`/api/events/${id}`, { headers }).then(res => {
      $scope.event = res.data;

      if ($scope.event.participants && $scope.currentUserId) {
        $scope.hasJoined = $scope.event.participants.some(p => p.user_id === $scope.currentUserId);
      }
    }).catch(err => {
      console.error('❌ Failed to load event detail:', err);
    });
  } else {
    $http.get('/api/events', { headers }).then(res => {
      console.log('[EventsController] Loaded events:', res.data);
      $scope.events = res.data;
    }).catch(err => {
      console.error('❌ Failed to load events:', err);
    });
  }

  
  $scope.myTeams = [];

  if (window.currentUser) {
  $http.get('/api/teams/mine').then(function(res) {
    $scope.myTeams = res.data;
  });
}

  $scope.joinEventAsTeam = function(event) {
    const team = $scope.myTeams.find(t => t.my_role === 'owner' || t.my_role === 'co-leader');
    if (!team) return alert('Only team leaders/co-leaders can join as a team.');

    $http.post('/api/events/' + event.id + '/join', { team_id: team.id }).then(function() {
      alert('Joined as team');
      $state.reload();
    }).catch(function(err) {
      alert('Failed to join event as team');
      console.error(err);
    });
  };


$scope.joinEvent = function(eventId) {
    $http.post(`/api/events/${eventId}/join`, {}, { headers })
      .then(function(res) {
        $scope.$applyAsync(() => alert('✅ Joined successfully!'));
        if ($scope.event) {
          $http.get(`/api/events/${eventId}`, { headers }).then(res => {
            $scope.event = res.data;
            $scope.hasJoined = true;
          });
        }
      })
      .catch(err => {
        console.error('❌ Join failed:', err);
        $scope.$applyAsync(() => alert(err.data?.error || 'Failed to join event'));
      });
  };

  $scope.verifyMatch = function(eventId) {
    $http.get(`/api/tracker/rocket-league/match/${eventId}`, { headers })
      .then(res => {
        $scope.$applyAsync(() => {
          alert('✅ Match verified!');
          $scope.event.verified = true;
          $scope.event.winner_id = res.data.winnerId;
        });
      })
      .catch(err => {
        console.error('❌ Verification error:', err);
        $scope.$applyAsync(() => alert(err.data?.error || 'Failed to verify match'));
      });
  };

  $scope.startEvent = function(eventId) {
    $http.post('/api/matches/start', { event_id: eventId }, { headers })
      .then(function(res) {
        $scope.$applyAsync(() => alert('Event started!'));
        $scope.event.status = 'started';
        startPolling(eventId);
      })
      .catch(function(err) {
        console.error('Start failed:', err);
      });
  };

  function startPolling(eventId) {
    $scope.pollingInterval = $interval(() => {
      $http.get('/api/matches/check/' + eventId, { headers })
        .then(function(res) {
          console.log('📡 Match Status:', res.data);
          if (res.data.result_verified) {
            $scope.$applyAsync(() => {
              $scope.event.verified = true;
              $scope.event.winner_id = res.data.winner_id;
              $scope.event.participants = res.data.players;
            });
            $interval.cancel($scope.pollingInterval);
          }
        })
        .catch(err => console.warn('Polling error', err));
    }, 60000);
  }

  $scope.$on('$destroy', () => {
    if ($scope.pollingInterval) $interval.cancel($scope.pollingInterval);
  });
});
