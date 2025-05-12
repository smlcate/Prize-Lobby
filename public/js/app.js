var app = angular.module('mainApp', ['ui.router'])

app.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider

  // // HOME STATES AND NESTED VIEWS ========================================
  .state('home', {
      url: '/',
      templateUrl: '../partials/home.html'
  })
  .state('login', {
      url: '/login',
      templateUrl: '../partials/login.html',
      controller: 'AuthController'
  })
  .state('signup', {
      url: '/signup',
      templateUrl: '../partials//signup.html',
      controller: 'AuthController'
  })
  .state('profile', {
    url: '/profile',
    templateUrl: 'partials/profile.html',
    controller: 'ProfileController'
  })
  .state('events', {
    url: '/events',
    templateUrl: 'partials/eventlist.html',
    controller: 'EventsController'
  })
  .state('createEvent', {
    url: '/create',
    templateUrl: 'partials/createevent.html',
    controller: 'EventsController'
  })
  .state('eventDetail', {
    url: '/event/:id',
    templateUrl: 'partials/eventdetail.html',
    controller: 'EventsController'
  })
  .state('gamertags', {
    url: '/gamertags',
    templateUrl: 'partials/gamertags.html',
    controller: 'GamertagController'
  })
  .state('wallet', {
    url: '/wallet?success&canceled',
    templateUrl: 'partials/wallet.html',
    controller: 'WalletController'
  })
  .state('transactions', {
    url: '/transactions',
    templateUrl: 'partials/transactions.html',
    controller: 'TransactionsController'
  })
  .state('admin', {
    url: '/admin',
    templateUrl: 'partials/admin.html',
    controller: 'AdminController'
  })
  .state('withdraw', {
    url: '/wallet/withdraw',
    templateUrl: 'partials/withdraw.html',
    controller: 'WalletController'
  })


})

app.run(function($transitions, $window, $state) {
  $transitions.onStart({}, function(trans) {
    const token = $window.localStorage.getItem('token');
    const toState = trans.to().name;

    // Protected routes
    const protectedRoutes = ['profile', 'createEvent', 'eventDetail'];

    if (protectedRoutes.includes(toState) && !token) {
      return $state.target('home');
    }
  });
});
