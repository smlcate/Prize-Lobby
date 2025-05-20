angular.module('mainApp')
.factory('ChallengesService', function($http, AuthService) {
  return {
    getAll() {
      return $http.get('/api/challenges', { headers: AuthService.getAuthHeader() });
    },
    getById(id) {
      return $http.get(`/api/challenges/${id}`, { headers: AuthService.getAuthHeader() });
    },
    join(id) {
      return $http.post(`/api/challenges/${id}/join`, {}, { headers: AuthService.getAuthHeader() });
    }
  };
});
