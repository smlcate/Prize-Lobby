angular.module('mainApp')
.controller('WalletController', function($scope, $http, $location, WalletService, AuthService, $timeout) {
  $scope.balance = 0;
  $scope.amount = null;
  $scope.success = $location.search().success;
  $scope.canceled = $location.search().canceled;

  // Refresh wallet balance from API
  const loadBalance = () => {
    WalletService.getBalance().then(res => {
      $scope.balance = res.data.balance;
    });
  };

  // Handle deposit and redirect to Stripe
  $scope.deposit = function() {
    const cents = Math.round($scope.amount * 100);
    WalletService.deposit(cents).then(res => {
      window.location.href = res.data.url;
    });
  };

  $scope.withdraw = {};

  $scope.submitWithdrawal = function() {
    $http.post('/api/wallet/withdraw', $scope.withdraw, {
      headers: { Authorization: 'Bearer ' + AuthService.getToken() }
    }).then(res => {
      $scope.message = res.data.message;
      $scope.error = '';
      $scope.withdraw = {};
    }).catch(err => {
      $scope.error = err.data.error || 'Failed to request withdrawal';
      $scope.message = '';
    });
  };

  $http.get('/api/wallet/balance', {
    headers: { Authorization: 'Bearer ' + AuthService.getToken() }
  }).then(res => {
    $scope.walletBalance = res.data.balance;
  });


  // If user came back from successful deposit, refresh balance
  if ($scope.success) {
    loadBalance();

    // Optionally clear ?success= query param from URL after 2s
    $timeout(() => {
      $location.search('success', null);
    }, 2000);
  } else {
    loadBalance(); // normal page load
  }
});
