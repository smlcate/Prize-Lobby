
mainApp.controller('teamDistributeController', function($scope, $http, $stateParams, $state) {
  $scope.balance = 0;
  $scope.members = [];
  $scope.form = { user_id: null, amount: null };
  $scope.team = {};

  $http.get('/api/teams/' + $stateParams.id).then(function(res) {
    $scope.team = res.data.team;
    $scope.members = res.data.members.filter(m => m.role !== 'owner'); // can't send to self
  });

  $http.get('/api/teams/' + $stateParams.id + '/wallet').then(function(res) {
    $scope.balance = res.data.balance;
  });

  $scope.sendFunds = function() {
    const payload = {
      user_id: $scope.form.user_id,
      amount: Math.round($scope.form.amount * 100) // convert to cents
    };

    $http.post('/api/teams/' + $stateParams.id + '/distribute', payload).then(function() {
      alert('Funds sent!');
      $state.reload();
    }).catch(function(err) {
      alert('Failed to send funds');
      console.error(err);
    });
  };
});
