app.controller('WalletController', function($scope, $http, AuthService) {
  console.log('[WalletController] Initialized');
  $scope.wallet = {};
  $scope.depositAmount = 1000;
  $scope.withdrawAmount = 0;
  $scope.withdrawMethod = 'paypal';
  $scope.withdrawDetails = '';
  $scope.cardElement = null;

  const STRIPE_PUBLIC_KEY = 'pk_test_51RNyKQDInsWLln2c9JIJ6elbP3Wt7wYdC5IJ2gXn17P6BHjzSfhlASYhBYKSvNM63wh140Wo3lbx0sbC9FezLpCv00rontYUva'; // TODO: Replace for production

  $scope.loadWallet = function() {
    $http.get('/api/wallet/balance').then(function(res) {
      $scope.wallet = res.data;
    });
  };

  $scope.formatAmount = function(amount) {
    return '$' + (amount / 100).toFixed(2);
  };

  $scope.setupStripe = function() {
    const stripe = Stripe(STRIPE_PUBLIC_KEY);
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
          $scope.$applyAsync(() => alert('Payment failed: ' + result.error.message));
        } else {
          console.log('[Stripe] Payment confirmed:', result.paymentIntent.id);
          $scope.$applyAsync(() => alert('Deposit successful!'));
          $scope.loadWallet();
        }
      });
    }).catch(function(err) {
      console.error('Deposit error:', err);
      $scope.$applyAsync(() => alert('Failed to create payment intent.'));
    });
  };

  $scope.requestWithdrawal = function() {
    if (!$scope.withdrawAmount || $scope.withdrawAmount < 100) {
      alert('Please enter a valid withdrawal amount (min $1).');
      return;
    }

    $http.post('/api/withdrawals/withdraw', {
      amount: $scope.withdrawAmount,
      method: $scope.withdrawMethod,
      details: $scope.withdrawDetails
    }).then(function() {
      alert('Withdrawal request submitted.');
      $scope.loadWallet();
    }).catch(function(err) {
      console.error('Withdrawal request error:', err);
      alert('Failed to submit withdrawal request.');
    });
  };

  $scope.loadWallet();
  $scope.setupStripe();
});
