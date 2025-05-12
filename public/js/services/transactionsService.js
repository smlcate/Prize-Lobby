angular.module('mainApp')
.factory('TransactionsService', function($http, AuthService) {
  const headers = () => ({
    headers: {
      Authorization: 'Bearer ' + AuthService.getToken()
    }
  });

  return {
    getAll() {
      return $http.get('/api/transactions', headers());
    }
  };
});
