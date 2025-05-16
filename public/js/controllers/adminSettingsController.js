
app.controller('AdminSettingsController', function($scope, $http) {
  $scope.settings = {};
  $scope.success = '';
  $scope.error = '';
  $scope.loading = false;

  function loadSettings() {
    $http.get('/api/admin/settings/platform-fee')
      .then(function(res) {
        $scope.settings = res.data;
      })
      .catch(function(err) {
        console.error('Failed to load settings:', err);
        $scope.error = 'Could not load settings';
      });
  }

  $scope.saveSettings = function() {
    $scope.loading = true;
    $http.put('/api/admin/settings/platform-fee', $scope.settings)
      .then(function(res) {
        $scope.success = 'Settings saved successfully.';
        $scope.error = '';
        $scope.settings = res.data; // Reload saved values from backend
      })
      .catch(function(err) {
        console.error('Failed to save settings:', err);
        $scope.error = 'Failed to save settings.';
        $scope.success = '';
      })
      .finally(function() {
        $scope.loading = false;
      });
  };

  loadSettings();
});
