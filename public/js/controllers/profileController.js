// public/js/controllers/profileController.js
angular.module('mainApp')
.controller('ProfileController', function($scope, $http) {
  $scope.profile = null;
  $scope.error = '';
  $scope.newGamertag = { platform: '', gamertag: '' };

  $http.get('/api/users/me')
    .then(function(res) {
      $scope.profile = res.data;
    })
    .catch(function(err) {
      $scope.error = 'Failed to load profile';
    });

  $scope.addGamertag = function() {
    $http.post('/api/gamertags', $scope.newGamertag)
      .then(function() {
        $scope.newGamertag = { platform: '', gamertag: '' };
        return $http.get('/api/users/me');
      })
      .then(function(res) {
        $scope.profile.gamertags = res.data.gamertags;
      })
      .catch(function(err) {
        $scope.error = err.data.error || 'Failed to add gamertag';
      });
  };

  $scope.deleteGamertag = function(id) {
    $http.delete('/api/gamertags/' + id)
      .then(function() {
        return $http.get('/api/users/me');
      })
      .then(function(res) {
        $scope.profile.gamertags = res.data.gamertags;
      });
  };
});
