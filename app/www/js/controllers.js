angular.module('starter.controllers',['starter.services'])

.controller('loginCtrl', function($scope, $state, $http, alertService, session, ip){

    $scope.login = function(data) {
      if(data === undefined || data['email'] === undefined || data['password'] ===undefined){
        alertService.alertPopup('ERRO','Por favor complete os campos corretamente');
      }
      else {
        var email = $scope.data.email;
        var password = $scope.data.password;

        $http.get(ip + '/login/'+ email + '/'+ password).
        success(function(response) {
          var dado =  angular.toJson(response);
          var obj = jQuery.parseJSON(dado);
          if(obj.user==null){
            alertService.alertPopup('ERRO','Por favor complete os campos corretamente');
          }
          else {
            session.saveData(obj.user.id, obj.user.name, obj.user.email,
              obj.user.phone, obj.user.password, obj.user.admin);
            $state.go('navUser.home');
          }
        }).
        error(function() {
          alertService.alertPopup('ERRO','Por favor complete os campos corretamente');
        });
      }
    };

    $scope.resetPassword = function(data){
      if(data === undefined || data['email'] === undefined){
        alertService.alertPopup('ERRO','Por favor complete com o email que você cadastrou');
      }
      else {
        var email = $scope.data.email;

        $http.post(ip + '/resetPassword/'+ email).
        success(function(response) {
          var dado =  angular.toJson(response);
          var obj = jQuery.parseJSON(dado);
          if(obj.answer==null){
            alertService.alertPopup('ERRO','Usuário inexistente');
          }
          else{
            alertService.alertPopup('Senha redefinida',
            'Confira seu email e logue com a nova senha');
          }
        }).
        error(function() {
          alertService.alertPopup('ERRO', 'Por favor, confira suas credenciais');
        });
        $state.go('nav.login');
      }
    };
})

.controller('homeCtrl', function($scope, $state, $http, alertService, ip) {
  $scope.name = window.localStorage['name'];
})

.controller('profileCtrl', function($scope, $state, $ionicPopup, $http,alertService, ip) {
    $scope.email = window.localStorage['email'];
    $scope.name = window.localStorage['name'];
    $scope.phone = window.localStorage['phone'];

    $scope.createUser = function(data) {
      if (data === undefined || data['email'] === undefined || data['password'] === undefined
        || data['confirmPassword'] === undefined || data['name'] === undefined ||
        data['phone'] === undefined || data['password'] !== data['confirmPassword']){

        alertService.alertPopup('ERRO','Por favor complete os campos corretamente');

      } else {

        var email = $scope.data.email;
        var password = $scope.data.password;
        var confirmPassword = $scope.data.confirmPassword;
        var name = $scope.data.name;
        var phone = $scope.data.phone;

        $http.post(ip + '/createUser/'+ email + '/'+ password + '/' + name + '/' + phone).
        success(function(response) {
          var dado =  angular.toJson(response);
          var obj = jQuery.parseJSON(dado);
          alertService.alertPopup('Bem vindo ao ache sua república',
          'Registro de usuário inserido com sucesso!');
        }).
        error(function() {
          alertService.alertPopup('ERRO', 'Por favor, confira suas credenciais');
        });
        $state.go('nav.login');
      }
    };
    $scope.updateUser = function(data) {
      var email = $scope.data.email;
      var name = $scope.data.name;
      var phone = $scope.data.phone;
      var id = window.localStorage['id_usu'];

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
        $scope.saveData = function(){
          saveData(undefined, name, email, phone);
        };

        alertService.alertPopup('Atualizado com sucesso!','Registro atualizado com sucesso!');
        $state.go('navUser.home');
      }).
      error(function() {
          alertService.alertPopup('ERRO','Por favor confira suas credenciais');
      });
    };
    $scope.deleteUser = function(data){
      var confirmPopup = $ionicPopup.confirm({
        title: 'Confirmação',
        template: 'Você tem certeza que deseja deletar sua conta?'
      });
      confirmPopup.then(function(res) {
        if(res) {
          var id = window.localStorage['id'];
          $http.post(ip + '/deleteUser/'+ id).
          success(function(response) {
            var dado =  angular.toJson(response);
            var obj = jQuery.parseJSON(dado);
            alertService.alertPopup('Deletado com sucesso!','Registro deletado com sucesso!');
            $state.go('nav.login');
          }).
          error(function() {
              alertService.alertPopup('ERRO','Por favor confira suas credenciais');
          });
        }
      });
    };
    $scope.passwordUpdate = function(data){
      if(data === undefined || data['password'] === undefined || data['passwordConfirm'] === undefined
      || data['password'] !== data['passwordConfirm']){
        alertService.alertPopup('ERRO','Por favor complete os campos corretamente');
      }
      else {
        var id = window.localStorage['id'];
        var password = $scope.data.password;
        var password = $scope.data.passwordConfirm;

        $http.post(ip + '/updatePassword/'+ password +"/" + id).
        success(function(response) {
          var dado =  angular.toJson(response);
          var obj = jQuery.parseJSON(dado);
          alertService.alertPopup('Atualizado!',
          'Senha atualizada com sucesso!');
        }).
        error(function() {
          alertService.alertPopup('ERRO', 'Por favor, confira suas credenciais');
        });
        $state.go('nav.login');
      }
    };
})

.controller('logoutCtrl', function($scope, $state, session){
  $scope.logout = function(){
    session.logout();
    $state.go('nav.login');
  };
})

.controller('locationCtrl', function($scope, $state, $http,alertService, ip, session){

  $scope.locations = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

  $scope.createNewLocation = function(data){
    if(data === undefined || data['city'] === undefined || data['state'] ===undefined
        || data['address'] ===undefined || data['number'] ===undefined){
        alertService.alertPopup('ERRO','Por favor complete os campos corretamente');
    }
    else{
        var city = $scope.data.city;
        var state = $scope.data.state;
        var address = $scope.data.address;
        var number = $scope.data.number;
        var id_usu = window.localStorage['id_usu'];

        $http.post(ip + '/createLocation/'+ city + '/'+ state + '/' + address + '/' + number + '/' + id_usu).
        success(function(response) {
          var dado =  angular.toJson(response);
          var obj = jQuery.parseJSON(dado);
          alertService.alertPopup('Nova localização!',
          'Registro de localização inserida com sucesso!');
        }).
        error(function() {
          alertService.alertPopup('ERRO', 'Por favor, confira suas credenciais');
        });
    }
  };
})
;
