app.controller('WalletController', function($scope, $http, AuthService) {
  console.log('[WalletController] Initialized');
  $scope.wallet = {};
  $scope.depositAmount = 1000;
  $scope.cardElement = null;

  $scope.loadWallet = function() {
    $http.get('/api/wallet/balance').then(function(res) {
      $scope.wallet = res.data;
    });
  };

  $scope.formatAmount = function(amount) {
    return '$' + (amount / 100).toFixed(2);
  };

  $scope.setupStripe = function() {
    const stripe = Stripe('pk_test_51RNyKQDInsWLln2c9JIJ6elbP3Wt7wYdC5IJ2gXn17P6BHjzSfhlASYhBYKSvNM63wh140Wo3lbx0sbC9FezLpCv00rontYUva');
    const elements = stripe.elements();
    $scope.cardElement = elements.create('card');
    $scope.cardElement.mount('#card-element');
    $scope.stripe = stripe;
  };

  $scope.deposit = function() {
    console.log('[WalletController] Starting deposit for amount:', $scope.depositAmount);

    $http.post('/api/wallet/deposit/intent', {
      amount: $scope.depositAmount
    }).then(function(res) {
      const clientSecret = res.data.client_secret;
      console.log('[Stripe] Got client_secret:', clientSecret);

      $scope.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: $scope.cardElement,
          billing_details: {
            email: AuthService.getUserPayload().email
          }
        }
      }).then(function(result) {
        if (result.error) {
          console.error('[Stripe] Payment failed:', result.error.message);
          alert('Payment failed: ' + result.error.message);
        } else {
          console.log('[Stripe] Payment confirmed:', result.paymentIntent.id);
          alert('Deposit successful!');
          $scope.loadWallet();
        }
      });
    }).catch(function(err) {
      console.error('Deposit error:', err);
      alert('Failed to create payment intent.');
    });
  };

  $scope.loadWallet();
  $scope.setupStripe();
});
