
app.controller('AdminController', function($scope, $http) {
  $scope.adminTab = 'events'; // ✅ Add this line
  $scope.triggerVerification = function() {
    $http.post('/api/admin/manual/trigger-verification')
      .then(function(res) {
        alert('✅ Manual verification triggered: ' + res.data.message);
      })
      .catch(function(err) {
        alert('❌ Failed to trigger verification: ' + (err.data?.error || err.statusText));
      });
  };
});
