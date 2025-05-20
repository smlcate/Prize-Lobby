app.controller('AdminEventsController', function($scope, $http) {
  $scope.events = [];

  $scope.load = function() {
    $http.get('/api/admin/events')
      .then(res => {
        $scope.events = res.data;
      })
      .catch(err => {
        console.error('Event load error:', err);
      });
  };

  $scope.statusFilter = function() {
    return function(event) {
      if (!$scope.filterStatus) return true;
      if ($scope.filterStatus === 'not_started') return !event.started;
      if ($scope.filterStatus === 'in_progress') return event.started && !event.completed;
      if ($scope.filterStatus === 'completed') return event.completed;
      return true;
    };
  };

  $scope.startEvent = function(eventId) {
    if (!confirm("Start this event?")) return;
    $http.post('/api/admin/events/' + eventId + '/start')
      .then(function(res) {
        alert('Event started.');
        $scope.load();
      })
      .catch(function(err) {
        alert('Error starting event.');
      });
  };

  $scope.load();
});
