app.controller('WithdrawController', function($scope, $http) {
  $scope.withdraw = {
    amount: 0,
    method: 'PayPal',
    details: ''
  };

  $scope.message = '';
  $scope.error = '';

  $scope.submitWithdrawal = function() {
    $scope.message = '';
    $scope.error = '';

    const cents = Math.round($scope.withdraw.amount * 100);
    if (cents <= 0) {
      $scope.error = 'Withdrawal amount must be greater than $0.';
      return;
    }

    $http.post('/api/withdrawals/request', {
      amount: cents,
      method: $scope.withdraw.method,
      details: $scope.withdraw.details
    }).then(function(res) {
      $scope.message = 'Withdrawal request submitted!';
      $scope.withdraw = { amount: 0, method: 'PayPal', details: '' };
    }).catch(function(err) {
      console.error('Withdraw error:', err);
      $scope.error = err.data?.error || 'Withdrawal failed. Please try again.';
    });
  };

  // Load user's past withdrawals
  $http.get('/api/withdrawals/mine').then(function(res) {
    $scope.withdrawals = res.data;
  }).catch(function(err) {
    console.error('Error fetching withdrawals:', err);
  });
});
