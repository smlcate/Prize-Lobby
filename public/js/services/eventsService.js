angular.module('mainApp')
.factory('EventsService', function($http, AuthService) {
  const base = '/api/events';

  return {
    // Get all events (open & completed)
    getAll() {
      return $http.get(base);
    },

    // Get one event by ID
    getById(id) {
      return $http.get(`${base}/${id}`);
    },

    // Create new event (authenticated)
    create(event) {
      return $http.post(`${base}/create`, event, {
        headers: AuthService.getAuthHeader()
      });
    },

    // Join an event (authenticated)
    join(eventId) {
      return $http.post(`/api/events/join/${eventId}`, {}, {
        headers: AuthService.getAuthHeader()
      });
    },
    start(eventId) {
      return $http.post(`/api/events/start/${eventId}`, {}, {
        headers: AuthService.getAuthHeader()
      });
    }

  };
});
