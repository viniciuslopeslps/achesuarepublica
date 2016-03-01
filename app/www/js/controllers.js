angular.module('starter.controllers', [])

.controller('createUserCtrl', function($scope, $state, $ionicPopup, $http, $ionicLoading) {
    //mudar o ip para testar
    var ip = 'http://192.168.1.106:5000';

    $scope.createUser = function(data) {
      var email = $scope.data.email;
      var password = $scope.data.password;
      var confirmPassword = $scope.data.confirmPassword;
      var name = $scope.data.name;
      var phone = $scope.data.phone;

      console.log(email, password, name, confirmPassword, phone);
      if(data === undefined || email === undefined || password === undefined
      || confirmPassword === undefined || name === undefined || phone === undefined
      || password != confirmPassword){
        var alertPopup = $ionicPopup.alert({
          title: 'ERRO',
          template: 'Complete as informações corretamente'
        });
      }
      else {
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
          $state.go('nav.login');
        });
      }
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
        var ip = 'http://192.168.1.106:5000';

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
            $state.go('navUser.home');
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
.controller('profileCtrl', function($scope, $state, $ionicPopup, $http, $ionicLoading) {
    function saveData(name, email, phone) {
      window.localStorage['name'] = name;
      window.localStorage['email'] = email;
      window.localStorage['phone'] = phone;
    }

    $scope.email = window.localStorage['email'];
    $scope.name = window.localStorage['name'];
    $scope.phone = window.localStorage['phone'];

    var ip = 'http://192.168.1.106:5000';

    $scope.updateUser = function(data) {
      var email = $scope.data.email;
      var name = $scope.data.name;
      var phone = $scope.data.phone;
      var id = window.localStorage['id'];


      if(email==undefined){
        var email = window.localStorage['email'];
      }
      if(name==undefined){
        var name = window.localStorage['name'];
      }
      if(phone==undefined){
        var phone = window.localStorage['phone'];
      }

      $http.post(ip + '/updateUser/'+ email + '/' + name + '/' + phone + '/' + id).
      success(function(response) {
        var dado =  angular.toJson(response);
        var obj = jQuery.parseJSON(dado);
        saveData(name, email, phone);
        var alertPopup = $ionicPopup.alert({
          title: 'Atualizado com sucesso!',
          template: 'Registro de atualizado com sucesso!'
        });
        $state.go('navUser.home');
      }).
      error(function() {
        var alertPopup = $ionicPopup.alert({
          title: 'ERRO',
          template: 'Por favor, confira suas credenciais'
          });
      });
    };

})
.controller('passwordUpdate', function($scope, $state, $ionicPopup, $http, $ionicLoading) {
    $scope.email = window.localStorage['email'];
    $scope.name = window.localStorage['name'];
    $scope.phone = window.localStorage['phone'];


})
;
