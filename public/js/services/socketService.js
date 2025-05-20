
app.factory('socket', function($rootScope) {
  const socket = io();

  return {
    register: function(id) {
      socket.emit('register', { id: id });
    },
    on: function(eventName, callback) {
      socket.on(eventName, function() {
        const args = arguments;
        $rootScope.$apply(function() {
          callback.apply(socket, args);
        });
      });
    },
    emit: function(eventName, data, callback) {
      socket.emit(eventName, data, function() {
        const args = arguments;
        $rootScope.$apply(function() {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});
