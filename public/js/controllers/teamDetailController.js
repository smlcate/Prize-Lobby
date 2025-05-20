
mainApp.controller('teamDetailController', function($scope, $http, $stateParams, $state) {
  $scope.team = {};
  $scope.members = [];
  $scope.canManage = false;
  $scope.isOwner = false;

  $http.get('/api/teams/' + $stateParams.id).then(function(res) {
    $scope.team = res.data.team;
    $scope.members = res.data.members;
    const me = $scope.members.find(m => m.username === window.currentUser);
    if (me) {
      $scope.canManage = me.role === 'owner' || me.role === 'co-leader';
      $scope.isOwner = me.role === 'owner';
    }
  });

  $scope.promote = function(userId) {
    $http.post('/api/teams/' + $scope.team.id + '/promote', { user_id: userId, new_role: 'co-leader' })
      .then(() => $state.reload());
  };

  $scope.kick = function(userId) {
    $http.post('/api/teams/' + $scope.team.id + '/kick', { user_id: userId })
      .then(() => $state.reload());
  };

  $scope.leave = function() {
    $http.post('/api/teams/' + $scope.team.id + '/leave').then(() => $state.go('team-list'));
  };

  $scope.disband = function() {
    $http.delete('/api/teams/' + $scope.team.id).then(() => $state.go('team-list'));
  };
});
