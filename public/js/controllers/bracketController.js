// File: public/js/controllers/bracketController.js

app.controller('bracketController', function($scope, $http, $interval, $stateParams) {
  $scope.matches = [];
  $scope.eventId = $stateParams.id;

  // Fetch bracket matches
  $http.get(`/api/events/${$scope.eventId}/bracket`).then(function(response) {
    $scope.matches = response.data;
    initializeCountdowns();
  }).catch(function(err) {
    console.error('Failed to load bracket matches:', err);
  });

  // Initialize countdown timers for each match
  function initializeCountdowns() {
    $scope.matches.forEach(match => {
      if (match.start_guess_time && !match.result_verified) {
        match.remainingTime = calculateRemainingTime(match.start_guess_time);
        match.timerLabel = formatRemainingTime(match.remainingTime);

        match._interval = $interval(() => {
          match.remainingTime--;

          if (match.remainingTime <= 0) {
            $interval.cancel(match._interval);
            match.timerLabel = 'Match in Progress';
          } else {
            match.timerLabel = formatRemainingTime(match.remainingTime);
          }
        }, 1000);
      } else if (match.result_verified) {
        match.timerLabel = 'Completed';
      } else {
        match.timerLabel = 'Pending';
      }
    });
  }

  function calculateRemainingTime(startTimeStr) {
    const now = new Date();
    const start = new Date(startTimeStr);
    return Math.max(0, Math.floor((start - now) / 1000)); // in seconds
  }

  function formatRemainingTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  $scope.$on('$destroy', function() {
    $scope.matches.forEach(m => {
      if (m._interval) $interval.cancel(m._interval);
    });
  });
});
