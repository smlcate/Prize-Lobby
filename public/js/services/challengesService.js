mainApp.service('challengesService', function($http) {
  console.log('[challengesService] Loaded');

  this.getAllChallenges = function() {
    return $http.get('/api/challenges');
  };

  this.getChallengeById = function(id) {
    return $http.get('/api/challenges/' + id);
  };

  this.joinChallenge = function(id) {
    return $http.post('/api/challenges/' + id + '/join');
  };
});