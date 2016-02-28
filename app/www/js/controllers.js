angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('createUserCtrl', function($scope, $state, $ionicPopup, $http, $ionicLoading) {
    $scope.createUser = function(data) {
      var email = $scope.data.email;
      var password = $scope.data.password;
      var name = $scope.data.name;
      var phone = $scope.data.phone;
      console.log(email + name + password + phone);

      $http.post('http://127.0.0.1:5000/createUser/'+ email + '/'+ password + '/' + name + '/' + phone).
      success(function(response) {
        var dado =  angular.toJson(response);
        var obj = jQuery.parseJSON(dado);
        alert(dado);
      }).
      error(function() {
        var alertPopup = $ionicPopup.alert({
          title: 'ERRO',
          template: 'Por favor, confira suas credenciais'
          });
      });
    };
})
;
