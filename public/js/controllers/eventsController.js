angular.module('mainApp')
.controller('EventsController', function($scope, $stateParams, $state, EventsService, AuthService) {
  $scope.events = [];
  $scope.pastEvents = [];
  $scope.newEvent = {};
  $scope.event = null;

  // Fetch all events
  if ($state.is('events')) {
    EventsService.getAll().then(res => {
      $scope.events = res.data.filter(e => e.status !== 'completed');
      $scope.pastEvents = res.data.filter(e => e.status === 'completed');
    });
  }

  // Fetch event by ID
  if ($stateParams.id) {
    EventsService.getById($stateParams.id).then(res => {
      $scope.event = res.data;
    });
  }

  // Create new event
  $scope.createEvent = function() {
    EventsService.create($scope.newEvent).then(() => {
      $state.go('events');
    });
  };

  // Join event
  $scope.joinEvent = function(eventId) {
    EventsService.join(eventId).then(() => {
      alert('Joined event!');
      $state.reload();
    }, err => {
      alert(err.data.error || 'Could not join');
    });
  };

  $scope.startEvent = function(eventId) {
    EventsService.start(eventId).then(() => {
      alert('Event started!');
      $state.reload();
    });
  };

});
