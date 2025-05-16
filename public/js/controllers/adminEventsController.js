
app.controller('AdminEventsController', function($scope, $http) {
  $http.get('/api/admin/events').then(function(res) {
    $scope.events = res.data;
  }).catch(function(err) {
    console.error('Failed to load admin events:', err);
  });
});
