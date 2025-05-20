app.controller('NotificationsController', function($scope, $http, socket) {
  $scope.notifications = [];
  $scope.error = '';

  $scope.loadNotifications = function() {
    $http.get('/api/notifications')
      .then(res => {
        $scope.notifications = res.data;
      })
      .catch(err => {
        $scope.error = 'Failed to load notifications.';
      });
  };

  $scope.markAsRead = function(notificationId) {
    $http.post(`/api/notifications/${notificationId}/read`)
      .then(() => $scope.loadNotifications());
  };

  socket.onNotification(function(note) {
    $scope.notifications.unshift(note);
    $scope.$apply();
  });

  $scope.loadNotifications();
});
