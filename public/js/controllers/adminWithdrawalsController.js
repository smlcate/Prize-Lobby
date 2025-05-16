app.controller('AdminWithdrawalsController', function($scope, $http) {
  console.log('[AdminWithdrawalsController] Initialized');
  $scope.withdrawals = [];
  $scope.loading = true;
  $scope.error = null;

  $scope.loadWithdrawals = function() {
    $scope.loading = true;
    $http.get('/api/admin/withdrawals').then(
      function(res) {
        console.log('[AdminWithdrawalsController] Loaded withdrawals:', res.data);
        $scope.withdrawals = res.data;
      },
      function(err) {
        console.error('[AdminWithdrawalsController] Failed to load withdrawals:', err);
        $scope.error = 'Failed to load withdrawals.';
      }
    ).finally(function() {
      $scope.loading = false;
    });
  };

  $scope.approveWithdrawal = function(id) {
    $http.put('/api/admin/withdrawals/' + id + '/approve').then(function() {
      $scope.loadWithdrawals();
    });
  };

  $scope.rejectWithdrawal = function(id) {
    $http.put('/api/admin/withdrawals/' + id + '/reject').then(function() {
      $scope.loadWithdrawals();
    });
  };

  $scope.loadWithdrawals(); // Initial load
});