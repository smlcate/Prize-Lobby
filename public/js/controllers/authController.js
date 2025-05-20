app.controller('AuthController', function($scope, $http, $window, $state, AuthService, $rootScope, $stateParams) {
  $scope.form = {};
  $scope.error = '';
  $scope.mode = $stateParams.mode || 'login';

  $scope.login = function() {
    $http.post('/api/auth/login', $scope.form).then(function(res) {
      AuthService.saveToken(res.data.token);
      try {
        const payload = JSON.parse(atob(res.data.token.split('.')[1]));
        $window.currentUser = payload;
      } catch (err) {
        console.error('Token parse error:', err);
      }
      $scope.error = '';
      $rootScope.$broadcast('user:login');
      $state.go('home');
    }).catch(function(err) {
      console.error('Login error:', err);
      $scope.error = 'Login failed. Please check your email and password.';
    });
  };

  $scope.signup = function() {
    $http.post('/api/auth/signup', $scope.form).then(function() {
      $scope.error = '';
      alert('Signup successful! You may now log in.');
      $scope.mode = 'login';
    }).catch(function(err) {
      console.error('Signup error:', err);
      $scope.error = err.data?.error || 'Signup failed. Please try again.';
    });
  };
});