
angular.module('starter', ['ionic', 'starter.controllers','starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('nav', {
    url: '/nav',
    abstract: true,
    templateUrl: 'templates/base/unkwonUserMenu.html'
  })

  .state('nav.createUser', {
      url: '/createUser',
      views: {
        'menuContent': {
          templateUrl: 'templates/users/createUser.html',
          controller: 'profileCtrl'
        }
      }
    })

    .state('nav.login', {
        url: '/login',
        views: {
          'menuContent': {
            templateUrl: 'templates/users/login.html',
            controller: 'loginCtrl'
          }
        }
      })

      .state('navUser', {
        url: '/navUser',
        abstract: true,
        templateUrl: 'templates/base/kwonUserMenu.html'
      })

      .state('navUser.home', {
          url: '/home',
          views: {
            'menuContent': {
              templateUrl: 'templates/base/home.html',
              controller: 'loginCtrl'
            }
          }
      })
      .state('navUser.profile', {
          url: '/profile',
          views: {
            'menuContent': {
              templateUrl: 'templates/users/profileUserIdea.html',
              controller: 'profileCtrl'
            }
          }
      })
      .state('navUser.location', {
          url: '/location',
          views: {
            'menuContent': {
              templateUrl: 'templates/location/location.html',
              controller: 'locationCtrl'
            }
          }
      })
      .state('logout', {
        url: '/logout',
        controller:'logoutCtrl'
      })

  $urlRouterProvider.otherwise('/nav/login');
})
;
