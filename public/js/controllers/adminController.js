angular.module('mainApp')
.controller('AdminController', function($scope, $http, AuthService) {
  const headers = {
    headers: { Authorization: 'Bearer ' + AuthService.getToken() }
  };

  $scope.fee = '';
  $scope.message = '';
  $scope.error = '';

  $scope.filterStatus = '';

  // Load current fee
  $http.get('/api/admin/settings/platform-fee', headers).then(res => {
    $scope.fee = parseFloat(res.data.fee);
  });

  $scope.updateFee = function() {
    $http.post('/api/admin/settings/platform-fee', { fee: $scope.fee }, headers).then(res => {
      $scope.message = res.data.message;
      $scope.error = '';
    }).catch(err => {
      $scope.error = err.data.error || 'Failed to update fee.';
      $scope.message = '';
    });
  };

  $scope.events = [];

  $scope.loadEvents = function() {
    $http.get('/api/admin/events', {
      headers: { Authorization: 'Bearer ' + AuthService.getToken() }
    }).then(res => {
      $scope.events = res.data;
    });
  };

  $scope.startEvent = function(eventId) {
    if (confirm('Start this event?')) {
      $http.post('/api/events/' + eventId + '/start', {}, {
        headers: { Authorization: 'Bearer ' + AuthService.getToken() }
      }).then(() => {
        $scope.loadEvents();
      });
    }
  };

  $scope.completeEvent = function(eventId) {
    if (confirm('Complete this event and payout prize?')) {
      $http.post('/api/events/' + eventId + '/complete', {}, {
        headers: { Authorization: 'Bearer ' + AuthService.getToken() }
      }).then(() => {
        $scope.loadEvents();
      });
    }
  };

  $scope.loadEvents();

  $scope.withdrawals = [];

$scope.loadWithdrawals = function() {
  $http.get('/api/admin/withdrawals', {
    headers: { Authorization: 'Bearer ' + AuthService.getToken() }
  }).then(res => {
    $scope.withdrawals = res.data;
  });
};

$scope.approveWithdrawal = function(id) {
  $http.post(`/api/admin/withdrawals/${id}/approve`, {}, {
    headers: { Authorization: 'Bearer ' + AuthService.getToken() }
  }).then(() => $scope.loadWithdrawals());
};

$scope.rejectWithdrawal = function(id) {
  if (confirm('Reject this withdrawal and refund the user?')) {
    $http.post(`/api/admin/withdrawals/${id}/reject`, {}, {
      headers: { Authorization: 'Bearer ' + AuthService.getToken() }
    }).then(() => $scope.loadWithdrawals());
  }
};

$scope.loadWithdrawals();


});
