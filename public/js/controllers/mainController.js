app.controller('MainController', function($scope, $http, socket, walletNotificationService, AuthService, $rootScope) {
  walletNotificationService.init(socket);

  $scope.wallet = {};

  $scope.loadWallet = function() {
    $http.get('/api/wallet/balance', { headers: AuthService.getAuthHeader() }).then(function(res) {
      $scope.wallet = res.data;
    }).catch(function(err) {
      console.error('❌ Failed to load wallet balance:', err);
    });
  };

  if (AuthService.isLoggedIn()) {
    $scope.loadWallet();
  }

  $rootScope.$on('user:login', function() {
    $scope.loadWallet();
  });

  socket.on('wallet:user:credit', function(data) {
    $scope.wallet.balance = data.balance;
    $scope.$apply();
  });
});