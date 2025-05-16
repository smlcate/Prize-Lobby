app.factory('SocketService', function() {
  const socket = io();

  return {
    register: function(userId) {
      socket.emit('register', userId);
    },
    onNotification: function(callback) {
      socket.on('notification', callback);
    }
  };
});
