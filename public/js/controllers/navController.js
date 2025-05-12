angular.module('mainApp')
.controller('NavController', function($scope, $http, $state, AuthService, WalletService) {
  $scope.isLoggedIn = AuthService.isLoggedIn;
  $scope.user = AuthService.getUserPayload();
  $scope.balance = 0;

  // Load balance only if logged in
  if ($scope.isLoggedIn()) {
    WalletService.getBalance().then(res => {
      $scope.balance = res.data.balance;
    });
  }

  $scope.logout = function() {
    AuthService.logout();
    $scope.user = null;
    $scope.balance = 0;
    $state.go('home');
  };

  $scope.isAdmin = false;

  if (AuthService.getToken()) {
    $http.get('/api/auth/me', {
      headers: { Authorization: 'Bearer ' + AuthService.getToken() }
    }).then(res => {
      $scope.isAdmin = res.data.is_admin;
    });
  }


});
