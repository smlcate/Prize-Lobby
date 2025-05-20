app.controller('TransactionsController', function($scope, $http, AuthService) {
  $scope.transactions = [];
  $scope.withdrawals = [];
  $scope.loading = true;
  $scope.error = null;

  $scope.formatAmount = function(amount) {
    return '$' + (amount / 100).toFixed(2);
  };

  $http.get('/api/transactions', {
    headers: AuthService.getAuthHeader()
  }).then(function(res) {
    $scope.transactions = res.data;
  }).catch(function(err) {
    console.error('❌ Failed to load transactions:', err);
    $scope.error = 'Failed to load transactions.';
  });

  $http.get('/api/withdrawals', {
    headers: AuthService.getAuthHeader()
  }).then(function(res) {
    $scope.withdrawals = res.data;
  }).catch(function(err) {
    console.error('❌ Failed to load withdrawals:', err);
    $scope.error = 'Failed to load withdrawals.';
  }).finally(function() {
    $scope.loading = false;
  });
});