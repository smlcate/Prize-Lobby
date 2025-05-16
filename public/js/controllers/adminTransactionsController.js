app.controller('AdminTransactionsController', function($scope, $http) {
  console.log('[AdminTransactionsController] Loaded');

  $scope.transactions = [];
  $scope.filterType = '';
  $scope.searchEmail = '';

  $scope.formatAmount = function(amount) {
    const dollars = (amount / 100).toFixed(2);
    return (amount >= 0 ? '+' : '-') + '$' + Math.abs(dollars);
  };

  $scope.emailFilter = function(tx) {
    if (!$scope.searchEmail) return true;
    return tx.email.toLowerCase().includes($scope.searchEmail.toLowerCase());
  };

  $http.get('/api/admin/transactions').then(function(res) {
    console.log('[AdminTransactionsController] Loaded transactions:', res.data);
    $scope.transactions = res.data;
  }).catch(function(err) {
    console.error('[AdminTransactionsController] Error loading transactions:', err);
  });

  $scope.exportCSV = function() {
    const headers = ['User Email', 'Type', 'Amount', 'Date'];
    const rows = $scope.transactions
      .filter($scope.emailFilter)
      .filter(tx => !$scope.filterType || tx.type === $scope.filterType)
      .map(tx => [
        tx.email,
        tx.type,
        $scope.formatAmount(tx.amount),
        new Date(tx.created_at).toLocaleString()
      ]);

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.join(',') + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
});
