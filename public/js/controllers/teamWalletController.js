
mainApp.controller('teamWalletController', function($scope, $http, $stateParams) {
  $scope.balance = 0;
  $scope.history = [];
  $scope.teamName = '';

  $http.get('/api/teams/' + $stateParams.id).then(function(res) {
    $scope.teamName = res.data.team.name;
  });

  $http.get('/api/teams/' + $stateParams.id + '/wallet').then(function(res) {
    $scope.balance = res.data.balance;
    $scope.history = res.data.history;
  });
});
