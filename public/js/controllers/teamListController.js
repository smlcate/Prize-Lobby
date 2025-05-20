
mainApp.controller('teamListController', function($scope, $http, $state) {
  $scope.myTeams = [];
  $scope.newTeam = {};

  $scope.loadTeams = function() {
    if (window.currentUser) {
    $http.get('/api/teams/mine').then(function(res) {
      $scope.myTeams = res.data;
    });
  };

  $scope.createTeam = function() {
    $http.post('/api/teams', $scope.newTeam).then(function() {
      $scope.newTeam = {};
      $scope.loadTeams();
    });
  };

  $scope.viewTeam = function(teamId) {
    $state.go('team-detail', { id: teamId });
  };

  $scope.loadTeams();
});
