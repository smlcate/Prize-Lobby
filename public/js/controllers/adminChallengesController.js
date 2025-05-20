// public/js/controllers/adminChallengesController.js
app.controller('AdminChallengesController', function($scope, $http, $window) {
  const token = $window.localStorage.getItem('token');
  const headers = { Authorization: 'Bearer ' + token };

  $scope.challenges = [];

  $http.get('/api/admin/challenges', { headers }).then(res => {
    $scope.challenges = res.data;
    console.log('[AdminChallengesController] Loaded challenges:', $scope.challenges);
  }).catch(err => {
    console.error('❌ Failed to load challenges:', err);
  });
});
