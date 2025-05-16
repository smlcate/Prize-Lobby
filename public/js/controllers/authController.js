angular.module('mainApp')
.controller('AuthController', function($scope, $state, AuthService) {
  $scope.user = {};

  $scope.login = function() {
    console.log('🧪 Login form submitted:', $scope.user);
    AuthService.login($scope.user).then(() => {
      $state.go('events');
    }).catch(() => {
      alert('Login failed');
    });
  };

  $scope.signup = function() {
    AuthService.signup($scope.user).then(() => {
      $state.go('login');
    }).catch(() => {
      alert('Signup failed');
    });
  };
});
