
angular.module('starter', ['ionic', 'starter.controllers'])

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
    templateUrl: 'templates/unkwonUserMenu.html'
  })

  .state('nav.createUser', {
      url: '/createUser',
      views: {
        'menuContent': {
          templateUrl: 'templates/createUser.html',
          controller: 'createUserCtrl'
        }
      }
    })

    .state('nav.login', {
        url: '/login',
        views: {
          'menuContent': {
            templateUrl: 'templates/login.html',
            controller: 'loginCtrl'
          }
        }
      })

      .state('navUser', {
        url: '/navUser',
        abstract: true,
        templateUrl: 'templates/kwonUserMenu.html'
      })

      .state('navUser.home', {
          url: '/home',
          views: {
            'menuContent': {
              templateUrl: 'templates/home.html',
              controller: 'loginCtrl'
            }
          }
      })
      .state('navUser.profile', {
          url: '/profile',
          views: {
            'menuContent': {
              templateUrl: 'templates/profile.html',
              controller: 'profileCtrl'
            }
          }
      })
      .state('navUser.passwordUpdate', {
          url: '/passwordUpdate',
          views: {
            'menuContent': {
              templateUrl: 'templates/passwordUpdate.html',
              controller: 'passwordUpdateCtrl'
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
