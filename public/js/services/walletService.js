angular.module('mainApp')
.factory('WalletService', function($http, AuthService) {
  return {
    getBalance() {
      return $http.get('/api/wallet/balance', {
        headers: AuthService.getAuthHeader()
      });
    },
    createDepositIntent(amount) {
      return $http.post('/api/wallet/deposit/intent', { amount }, {
        headers: AuthService.getAuthHeader()
      });
    },
    createCheckout(amount) {
      return $http.post('/api/wallet/checkout', { amount }, {
        headers: AuthService.getAuthHeader()
      });
    }
  };
});
