angular.module('mainApp')
.factory('GamertagService', function($http, AuthService) {
  const base = '/api/gamertags';

  return {
    getAll() {
      return $http.get(base, {
        headers: AuthService.getAuthHeader()
      });
    },
    save(platform, gamertag) {
      return $http.post(base, { platform, gamertag }, {
        headers: AuthService.getAuthHeader()
      });
    },
    delete(platform) {
      return $http.delete(`${base}/${platform}`, {
        headers: AuthService.getAuthHeader()
      });
    }
  };
});
