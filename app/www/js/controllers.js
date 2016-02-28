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

      $http.post('http://127.0.0.1:5000/createUser/'+ email + '/'+password).
      success(function(response) {
        //se obtiver sucesso, é armazenado a resposta
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
