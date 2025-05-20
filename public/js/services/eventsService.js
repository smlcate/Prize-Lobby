angular.module('mainApp')
.factory('EventsService', function($http, AuthService) {
  const base = '/api/events';

  return {
    getAll() {
      return $http.get(base, { headers: AuthService.getAuthHeader() });
    },
    getById(id) {
      return $http.get(`${base}/${id}`, { headers: AuthService.getAuthHeader() });
    },
    create(event) {
      return $http.post(base, event, { headers: AuthService.getAuthHeader() });
    },
    join(eventId) {
      return $http.post(`${base}/${eventId}/join`, {}, { headers: AuthService.getAuthHeader() });
    },
    start(eventId) {
      return $http.post('/api/matches/start', { event_id: eventId }, {
        headers: AuthService.getAuthHeader()
      });
    }
  };
});
