app.controller('AdminDisputesController', function($scope, $http) {
  $scope.disputes = [];

  $scope.load = function() {
    $http.get('/api/admin/disputes')
      .then(res => {
        $scope.disputes = res.data;
      })
      .catch(err => {
        console.error('Dispute load error:', err);
      });
  };

  $scope.load();
});
