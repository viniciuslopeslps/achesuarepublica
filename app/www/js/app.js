
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
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/users/createUser.html',
          controller: 'profileCtrl'
        }
      }
    })

    .state('nav.login', {
        url: '/login',
        cache: false,
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
          cache: false,
          views: {
            'menuContent': {
              templateUrl: 'templates/base/home.html',
              controller: 'loginCtrl'
            }
          }
      })
      .state('navUser.selectedRoom', {
          url: '/selectedRoom',
          cache: false,
          views: {
            'menuContent': {
              templateUrl: 'templates/rooms/selectedRoom.html',
              controller: 'selectedRoomCtrl'
            }
          }
      })
      .state('navUser.profile', {
          url: '/profile',
          cache: false,
          views: {
            'menuContent': {
              templateUrl: 'templates/users/profileUser.html',
              controller: 'profileCtrl'
            }
          }
      })
      .state('navUser.location', {
          url: '/location',
          cache: false,
          views: {
            'menuContent': {
              templateUrl: 'templates/locations/location.html',
              controller: 'locationCtrl'
            }
          }
      })
      .state('navUser.university', {
          url: '/university',
          cache: false,
          views: {
            'menuContent': {
              templateUrl: 'templates/universities/university.html',
              controller: 'universityCtrl'
            }
          }
      })
      .state('navUser.republic', {
          url: '/republic',
          cache: false,
          views: {
            'menuContent': {
              templateUrl: 'templates/republics/republic.html',
              controller: 'republicCtrl'
            }
          }
      })
      .state('navUser.room', {
          url: '/room',
          cache: false,
          views: {
            'menuContent': {
              templateUrl: 'templates/rooms/room.html',
              controller: 'roomCtrl'
            }
          }
      })
      .state('navUser.searchRooms', {
          url: '/searchRooms',
          cache: false,
          views: {
            'menuContent': {
              templateUrl: 'templates/rooms/searchRooms.html',
              controller: 'searchRoomsCtrl'
            }
          }
        })
        .state('navUser.searchedRoom', {
            url: '/searchedRoom',
            cache: false,
            views: {
              'menuContent': {
                templateUrl: 'templates/rooms/searchedRoom.html',
                controller: 'searchedRoomCtrl'
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
