angular.module('mainApp')
.controller('GamertagController', function($scope, GamertagService) {
  $scope.tags = [];
  $scope.newTag = { platform: '', gamertag: '' };

  const loadTags = () => {
    GamertagService.getAll().then(res => {
      $scope.tags = res.data;
    });
  };

  $scope.saveTag = () => {
    GamertagService.save($scope.newTag.platform, $scope.newTag.gamertag).then(() => {
      $scope.newTag = { platform: '', gamertag: '' };
      loadTags();
    });
  };

  $scope.deleteTag = (platform) => {
    GamertagService.delete(platform).then(() => {
      loadTags();
    });
  };

  loadTags();
});
