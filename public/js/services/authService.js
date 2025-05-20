angular.module('mainApp')
.factory('AuthService', function($window) {
  const auth = {};

  auth.saveToken = function(token) {
    $window.localStorage['token'] = token;
  };

  auth.getToken = function() {
    return $window.localStorage['token'];
  };

  auth.decodeToken = function() {
    const token = auth.getToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  };

  auth.getUserPayload = function() {
    return auth.decodeToken();
  };

  auth.isLoggedIn = function() {
    const payload = auth.decodeToken();
    if (!payload) return false;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      auth.logout();
      return false;
    }

    return true;
  };

  auth.logout = function() {
    $window.localStorage.removeItem('token');
    $window.localStorage.removeItem('user_id');
  };

  auth.getAuthHeader = function() {
    const token = auth.getToken();
    return { Authorization: 'Bearer ' + token };
  };

  return auth;
});
