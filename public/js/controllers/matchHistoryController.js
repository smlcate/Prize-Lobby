
mainApp.controller('matchHistoryController', function($scope, $http) {
  $scope.matchHistory = [];

  $http.get('/api/users/me/match-history').then(function(res) {
    $scope.matchHistory = res.data;
  }).catch(function(err) {
    alert('Failed to load match history');
    console.error(err);
  });
});
