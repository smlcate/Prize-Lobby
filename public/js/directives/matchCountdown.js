
// public/js/directives/matchCountdown.js
app.directive('matchCountdown', function($interval, $filter) {
  return {
    restrict: 'E',
    scope: {
      startTime: '='
    },
    template: '<span ng-if="remaining > 0">⏳ Starts in: {{ countdownText }}</span>' +
              '<span ng-if="remaining <= 0">🚀 Match started!</span>',
    link: function(scope) {
      function updateCountdown() {
        const now = new Date().getTime();
        const start = new Date(scope.startTime).getTime();
        scope.remaining = start - now;

        if (scope.remaining > 0) {
          const seconds = Math.floor(scope.remaining / 1000);
          const minutes = Math.floor(seconds / 60);
          const displaySeconds = seconds % 60;
          scope.countdownText = minutes + 'm ' + displaySeconds + 's';
        } else {
          scope.countdownText = '';
        }
      }

      updateCountdown();
      const interval = $interval(updateCountdown, 1000);

      scope.$on('$destroy', function() {
        $interval.cancel(interval);
      });
    }
  };
});
