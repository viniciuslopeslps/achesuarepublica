angular.module('starter.controllers',['starter.services'])

.controller('loginCtrl', function($scope, $state, $ionicPopup, $http, $ionicLoading, alertService){
  function logout() {
    window.localStorage['id'] = " ";
    window.localStorage['name'] = " ";
    window.localStorage['email'] = " ";
    window.localStorage['phone'] = " ";
    window.localStorage['password'] = " ";
    window.localStorage['admin'] = " ";
  }

    function saveData(id, name, email, phone, password, admin) {
      window.localStorage['id'] = id===undefined?window.localStorage['id']:id;
      window.localStorage['name'] = name===undefined?window.localStorage['name']:name;
      window.localStorage['email'] = email===undefined?window.localStorage['email']:email;
      window.localStorage['phone'] = phone===undefined?window.localStorage['phone']:phone;
      window.localStorage['password'] = password===undefined?window.localStorage['password']:password;
      window.localStorage['admin'] = admin===undefined?window.localStorage['admin']:admin;
    }
    $scope.login = function(data) {
      if(data === undefined || data['email'] === undefined || data['password'] ===undefined){
        alertService.alertPopup('ERRO','Por favor complete os campos corretamente');
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
          alertService.alertPopup('ERRO','Por favor complete os campos corretamente');
        });

      }
    };

})

.controller('homeCtrl', function($scope, $state, $ionicPopup, $http, $ionicLoading, alertService) {
  $scope.name = window.localStorage['name'];
})

.controller('profileCtrl', function($scope, $state, $ionicPopup, $http, $ionicLoading,alertService) {

    $scope.email = window.localStorage['email'];
    $scope.name = window.localStorage['name'];
    $scope.phone = window.localStorage['phone'];

    var ip = 'http://192.168.1.106:5000';
    $scope.createUser = function(data) {
      var email = $scope.data.email;
      var password = $scope.data.password;
      var confirmPassword = $scope.data.confirmPassword;
      var name = $scope.data.name;
      var phone = $scope.data.phone;

      if(data === undefined || email === undefined || password === undefined
      || confirmPassword === undefined || name === undefined || phone === undefined
      || password != confirmPassword){
        alertService.alertPopup('ERRO','Por favor complete os campos corretamente');
      }
      else {
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
      var id = window.localStorage['id'];

      var confirmPopup = $ionicPopup.confirm({
        title: 'Confirmação',
        template: 'Você tem certeza que deseja deletar sua conta?'
      });
      confirmPopup.then(function(res) {
        if(res) {
          $http.post(ip + '/deleteUser/'+ id).
          success(function(response) {
            var dado =  angular.toJson(response);
            var obj = jQuery.parseJSON(dado);
            var alertPopup = $ionicPopup.alert({
              title: 'Deletado com sucesso!',
              template: 'Registro deletado com sucesso!'
            });
            $state.go('nav.login');
          }).
          error(function() {
              alertService.alertPopup('ERRO','Por favor confira suas credenciais');
          });
        }
      });
    };
})

.controller('passwordUpdateCtrl', function($scope, $state, $ionicPopup, $http, alertService) {
    $scope.passwordUpdate = function(data){
      if(data===undefined){
        alertService.alertPopup('ERRO','Por favor complete os campos corretamente');
      }
      var id = window.localStorage['id'];
    };
})

.controller('logoutCtrl', function($scope, $state){
  $scope.logout = function(){
    logout();
    $state.go('nav.login');
  };
})

;
