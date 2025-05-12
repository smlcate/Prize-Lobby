angular.module('mainApp')
.factory('AuthService', function($http, $window) {
  const base = '/api/auth';

  return {
    // Create new user
    signup(user) {
      return $http.post(`${base}/signup`, user);
    },

    // Log in and store token
    login(credentials) {
      return $http.post(`${base}/login`, credentials).then(res => {
        $window.localStorage.setItem('token', res.data.token);
        return res;
      });
    },

    // Remove token on logout
    logout() {
      $window.localStorage.removeItem('token');
    },

    // Return stored token (or null)
    getToken() {
      return $window.localStorage.getItem('token');
    },

    // Return user ID from decoded JWT
    getUserId() {
      const token = $window.localStorage.getItem('token');
      if (!token) return null;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
      } catch (e) {
        return null;
      }
    },

    // Return full JWT payload (e.g. email, id)
    getUserPayload() {
      const token = $window.localStorage.getItem('token');
      if (!token) return null;
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch {
        return null;
      }
    },

    // Get token as auth header
    getAuthHeader() {
      const token = $window.localStorage.getItem('token');
      return token ? { Authorization: 'Bearer ' + token } : {};
    },

    // Check login status
    isLoggedIn() {
      return !!$window.localStorage.getItem('token');
    }
  };
});
