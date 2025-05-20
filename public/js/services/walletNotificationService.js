
app.factory('walletNotificationService', function($rootScope) {
  return {
    init: function(socket) {
      socket.on('wallet:team:credit', function(data) {
        $rootScope.$broadcast('wallet:team:credit', data);
      });
    }
  };
});
