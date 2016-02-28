angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('createUserCtrl', function($scope, $state, $ionicPopup, $http, $ionicLoading) {
    $scope.createUser = function(data) {
      var email = $scope.data.email;
      var name = $scope.data.name;
      var password = $scope.data.password;
      var phone = $scope.data.phone;
      console.log(email + name + password + phone);
    };
})
;
