
app.controller('AdminDisputesController', function($scope, $http) {
  $http.get('/api/admin/disputes').then(function(res) {
    $scope.disputes = res.data;
  }).catch(function(err) {
    console.error('Failed to load admin disputes:', err);
  });
});
