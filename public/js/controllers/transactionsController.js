angular.module('mainApp')
.controller('TransactionsController', function($scope, TransactionsService) {
  $scope.transactions = [];
  $scope.filterType = '';

  $scope.formatAmount = function(amount) {
    const dollars = (amount / 100).toFixed(2);
    return (amount >= 0 ? '+' : '-') + '$' + Math.abs(dollars);
  };

  TransactionsService.getAll().then(res => {
    $scope.transactions = res.data;
  });
});
