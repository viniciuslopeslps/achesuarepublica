angular.module('starter.controllers', [])

.controller('createUserCtrl', function($scope, $state, $ionicPopup, $http, $ionicLoading) {
    //mudar o ip para testar
    var ip = 'http://192.168.0.12:5000';

    $scope.createUser = function(data) {
      var email = $scope.data.email;
      var password = $scope.data.password;
      var name = $scope.data.name;
      var phone = $scope.data.phone;
      console.log(email + name + password + phone);

      $http.post(ip + '/createUser/'+ email + '/'+ password + '/' + name + '/' + phone).
      success(function(response) {
        var dado =  angular.toJson(response);
        var obj = jQuery.parseJSON(dado);
        var alertPopup = $ionicPopup.alert({
          title: 'Bem vindo ao ache sua república!',
          template: 'Registro de usuário inserido com sucesso!'
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
.controller('loginCtrl', function($scope, $state, $ionicPopup, $http, $ionicLoading){
    function saveData(id, name, email, phone, password, admin) {
      window.localStorage['id'] = id;
      window.localStorage['name'] = name;
      window.localStorage['email'] = email;
      window.localStorage['phone'] = phone;
      window.localStorage['password'] = password;
      window.localStorage['admin'] = admin;
    }
    $scope.login = function(data) {
      if(data === undefined || data['email'] === undefined || data['password'] ===undefined){
        var alertPopup = $ionicPopup.alert({
          title: 'ERRO',
          template: 'Complete as informações corretamente'
        });
      }
      else {
        var email = $scope.data.email;
        var password = $scope.data.password;
        var ip = 'http://192.168.0.12:5000';

        $http.get(ip + '/login/'+ email + '/'+ password).
        success(function(response) {
          var dado =  angular.toJson(response);
          var obj = jQuery.parseJSON(dado);
          if(obj.user==null){
            var alertPopup = $ionicPopup.alert({
              title: 'ERRO',
              template: 'Por favor, confira suas credenciais'
            });
          }
          else {
            saveData(obj.user.id, obj.user.name, obj.user.email, obj.user.phone, obj.user.password, obj.user.admin);
            $state.go('home');
          }
        }).
        error(function() {
          var alertPopup = $ionicPopup.alert({
            title: 'ERRO',
            template: 'Por favor, confira suas credenciais'
          });
        });
      }
    };

})
.controller('homeCtrl', function($scope, $state, $ionicPopup, $http, $ionicLoading) {
  $scope.name = window.localStorage['name'];
})
;
