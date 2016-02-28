angular.module('starter.controllers', [])



.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('createUserCtrl', function($scope, $state, $ionicPopup, $http, $ionicLoading) {
    ip = 'http://192.168.1.106:5000';
    $scope.createUser = function(data) {
      var email = $scope.data.email;
      var password = $scope.data.password;
      var name = $scope.data.name;
      var phone = $scope.data.phone;
      console.log(email + name + password + phone);

      //mudar o ip para testar
      $http.post(ip + '/createUser/'+ email + '/'+ password + '/' + name + '/' + phone).
      success(function(response) {
        var dado =  angular.toJson(response);
        var obj = jQuery.parseJSON(dado);
        var alertPopup = $ionicPopup.alert({
          title: 'Bem vindo ao ache sua república',
          template: 'Usuário inserido com sucesso!'
          });
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
