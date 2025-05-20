app.controller('AdminSettingsController', function($scope, $http) {
  $scope.settings = {};
  $scope.message = '';

  $http.get('/api/admin/settings/platform-fee').then(res => {
    $scope.settings = res.data;
  });

  $scope.save = function() {
    $http.put('/api/admin/settings/platform-fee', {
      platform_fee_percent: $scope.settings.platform_fee_percent
    }).then(() => {
      $scope.message = 'Saved!';
    }).catch(err => {
      console.error('Save failed:', err);
    });
  };
});
