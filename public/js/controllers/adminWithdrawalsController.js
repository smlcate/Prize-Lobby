app.controller('AdminWithdrawalsController', function($scope, $http) {
  console.log('[AdminWithdrawalsController] Loaded');

  $scope.withdrawals = [];

  $scope.loadWithdrawals = function() {
    $http.get('/api/admin/withdrawals').then(function(res) {
      $scope.withdrawals = res.data;
    });
  };

  $scope.approveWithdrawal = function(id) {
    if (!confirm('Approve this withdrawal?')) return;
    $http.post('/api/admin/withdrawals/' + id + '/approve')
      .then(function() {
        alert('Withdrawal approved');
        $scope.loadWithdrawals();
      }).catch(function(err) {
        console.error('Approve error:', err);
        alert('Failed to approve withdrawal');
      });
  };

  $scope.denyWithdrawal = function(id) {
    if (!confirm('Deny this withdrawal?')) return;
    $http.post('/api/admin/withdrawals/' + id + '/deny')
      .then(function() {
        alert('Withdrawal denied');
        $scope.loadWithdrawals();
      }).catch(function(err) {
        console.error('Deny error:', err);
        alert('Failed to deny withdrawal');
      });
  };

  $scope.loadWithdrawals();
});
