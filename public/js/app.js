var app = angular.module('mainApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  // Add auth token to all HTTP requests
  $httpProvider.interceptors.push(function($window) {
    return {
      request: function(config) {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      }
    };
  });

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '../partials/home.html',
      controller: 'MainController'
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
    .state('challenges', {
      url: '/challenges',
      templateUrl: 'partials/challenges.html',
      controller: 'ChallengesController'
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
    .state('matchDetail', {
      url: '/match/:id',
      templateUrl: 'partials/matchdetail.html',
      controller: 'MatchController'
    })
    .state('bracket', {
      url: '/bracket/:event_id',
      templateUrl: 'partials/bracket.html',
      controller: 'BracketController'
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

    .state('admin.events', {
      url: '/events',
      templateUrl: 'partials/admin-events.html',
      controller: 'AdminEventsController'
    })
    .state('admin.withdrawals', {
      url: '/admin/withdrawals',
      templateUrl: 'partials/admin-withdrawals.html',
      controller: 'AdminWithdrawalsController'
    })
    .state('admin-transactions', {
      url: '/admin/transactions',
      templateUrl: 'partials/admin-transactions.html',
      controller: 'AdminTransactionsController'
    })
    .state('admin.fees', {
      url: '/fees',
      templateUrl: 'partials/admin-fees.html',
      controller: 'AdminController'
    })
    .state('adminEvents', {
      url: '/admin/events',
      templateUrl: 'partials/admin-events.html',
      controller: 'AdminEventsController'
    })
    .state('withdraw', {
      url: '/wallet/withdraw',
      templateUrl: 'partials/withdraw.html',
      controller: 'WalletController'
    })
    .state('/verify', {
      templateUrl: 'partials/verify-match.html',
      controller: 'VerifyMatchController'
    })


});

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



app.run(function(SocketService) {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload && payload.id) {
        SocketService.register(payload.id);
        console.log('🔔 Registered Socket.IO for user', payload.id);
      }
    } catch (e) {
      console.error('Failed to decode JWT for Socket.IO registration:', e);
    }
  }
});


app.run(function($rootScope, $state) {
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
    console.log('🌐 Routing to:', toState.name, 'with params:', toParams);
  });
});
