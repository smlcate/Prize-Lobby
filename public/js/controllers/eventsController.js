app.controller('EventsController', function($scope, $http, $stateParams, $window, $interval) {
  const token = $window.localStorage.getItem('token');
  $scope.currentUserId = parseInt($window.localStorage.getItem('user_id'));
  const headers = { Authorization: 'Bearer ' + token };

  const id = $stateParams.id;

  if (id) {
    $http.get(`/api/events/${id}`, { headers }).then(res => {
      $scope.event = res.data;

      // Determine if user has joined
      if ($scope.event.participants && $scope.currentUserId) {
        $scope.hasJoined = $scope.event.participants.some(p => p.user_id === $scope.currentUserId);
      }
    }).catch(err => {
      console.error('❌ Failed to load event detail:', err);
    });
  }

  // Join Event
  $scope.joinEvent = function(eventId) {
    $http.post(`/api/events/${eventId}/join`, {}, { headers })
      .then(function(res) {
        alert('✅ Joined successfully!');
        $scope.event.participants.push({ user_id: $scope.currentUserId });
        $scope.hasJoined = true;
      })
      .catch(err => {
        console.error('❌ Join failed:', err);
        alert(err.data?.error || 'Failed to join event');
      });
  };

  $scope.verifyMatch = function(eventId) {
    $http.get(`/api/tracker/rocket-league/match/${eventId}`, { headers })
      .then(res => {
        alert('✅ Match verified!');
        $scope.event.verified = true;
        $scope.event.winner_id = res.data.winnerId;
      })
      .catch(err => {
        console.error('❌ Verification error:', err);
        alert(err.data?.error || 'Failed to verify match');
      });
  };


  // Start Event
  $scope.startEvent = function(eventId) {
    $http.post('/api/matches/start', { event_id: eventId }, { headers })
      .then(function(res) {
        alert('Event started!');
        $scope.event.status = 'started';
        startPolling(eventId);
      })
      .catch(function(err) {
        console.error('Start failed:', err);
      });
  };

  // Optional: Poll match result
  function startPolling(eventId) {
    $scope.pollingInterval = $interval(() => {
      $http.get('/api/matches/check/' + eventId, { headers })
        .then(function(res) {
          console.log('📡 Match Status:', res.data);
          if (res.data.result_verified) {
            $scope.event.verified = true;
            $scope.event.winner_id = res.data.winner_id;
            $scope.event.participants = res.data.players;
            $interval.cancel($scope.pollingInterval);
          }
        })
        .catch(err => console.warn('Polling error', err));
    }, 60000); // Poll every 60 seconds
  }

  // Cleanup
  $scope.$on('$destroy', () => {
    if ($scope.pollingInterval) $interval.cancel($scope.pollingInterval);
  });
});
