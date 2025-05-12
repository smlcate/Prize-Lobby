angular.module('mainApp')
.factory('WalletService', function($http, AuthService) {
  return {
    getBalance() {
      return $http.get('/api/wallet/balance', {
        headers: AuthService.getAuthHeader()
      });
    },
    deposit(amount) {
      return $http.post('/api/wallet/deposit', { amount }, {
        headers: AuthService.getAuthHeader()
      });
    }
  };
});
