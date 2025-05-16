angular.module('mainApp')
  .factory('AuthService', function($http, $window) {
    const base = '/api/auth';

    return {
      signup: function(user) {
        return $http.post(base + '/signup', user);
      },

      login: function(credentials) {
        return $http.post(base + '/login', credentials).then(function(res) {
          $window.localStorage.setItem('token', res.data.token);
          return res;
        });
      },

      logout: function() {
        $window.localStorage.removeItem('token');
      },

      getToken: function() {
        return $window.localStorage.getItem('token');
      },

      getUserId: function() {
        const token = $window.localStorage.getItem('token');
        if (!token) return null;
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.id;
        } catch (e) {
          return null;
        }
      },

      getUserPayload: function() {
        const token = $window.localStorage.getItem('token');
        if (!token) return null;
        try {
          return JSON.parse(atob(token.split('.')[1]));
        } catch {
          return null;
        }
      },

      getAuthHeader: function() {
        const token = $window.localStorage.getItem('token');
        return token ? { Authorization: 'Bearer ' + token } : {};
      },

      isLoggedIn: function() {
        return !!$window.localStorage.getItem('token');
      }
    };
  });

angular.module('mainApp').config(function($httpProvider) {
  $httpProvider.interceptors.push(function($window) {
    return {
      request: function(config) {
        const token = $window.localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      }
    };
  });
});
