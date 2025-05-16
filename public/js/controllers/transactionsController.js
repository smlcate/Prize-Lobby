angular.module('mainApp')
.controller('TransactionsController', function($scope, $http, TransactionsService) {
  $scope.transactions = [];
  $scope.withdrawals = [];
  $scope.filterType = '';

  $scope.formatAmount = function(amount) {
    const dollars = (amount / 100).toFixed(2);
    return (amount >= 0 ? '+' : '-') + '$' + Math.abs(dollars);
  };

  // Load transaction history
  TransactionsService.getAll().then(res => {
    $scope.transactions = res.data;
  });

  // Load withdrawal history
  $http.get('/api/withdrawals/mine').then(function(res) {
    $scope.withdrawals = res.data;
  }).catch(function(err) {
    console.error('Error fetching withdrawals:', err);
  });
});
