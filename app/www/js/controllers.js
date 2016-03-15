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

  $scope.states = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

  $scope.createNewLocation = function(data){
    if(data === undefined || data['city'] === undefined || data['state'] ===undefined
        || data['address'] ===undefined || data['number'] ===undefined){
        alertService.alertPopup('ERRO','Por favor complete os campos corretamente');
    }
    else{
        var city_locat = $scope.data.city;
        var state_locat = $scope.data.state;
        var address_locat = $scope.data.address;
        var number_locat = $scope.data.number;
        var id_usu = window.localStorage['id_usu'];

        $http.post(ip + '/createLocation/'+ city_locat + '/'+ state_locat + '/'
        + address_locat + '/' + number_locat + '/' + id_usu).
        success(function(response) {
          var dado =  angular.toJson(response);
          var obj = jQuery.parseJSON(dado);

          window.localStorage['city_locat'] = city_locat;
          window.localStorage['number_locat'] = number_locat;
          window.localStorage['address_locat'] = address_locat;
          window.localStorage['state_locat'] = state_locat;

          alertService.alertPopup('Nova localização!',
          'Registro de localização inserida com sucesso!');
        }).
        error(function() {
          alertService.alertPopup('ERRO', 'Por favor, confira suas credenciais');
        });
    }
  };
  $scope.states = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

  var locationsArray = $scope.locationsArray = [];
  var locationsObjs = $scope.locationsObjs = [];

  $scope.getLocations = function(){
    var locationsArray = $scope.locationsArray = [];
    var locationsObjs = $scope.locationsObjs = [];
    var id_usu = window.localStorage['id_usu'];

    $http.get(ip + '/getLocations/' + id_usu).
    success(function(response) {
      var dado =  angular.toJson(response);
      var obj = jQuery.parseJSON(dado);
      var locations = obj["locations"];
      for (i = 0; i < locations.length; i++) {
        var objctKey = {};
        $scope.locationsArray.push(locations[i]["key_locat"]);
      }
      $scope.locationsObjs.push(locations);
    }).
    error(function() {
      alertService.alertPopup('ERRO', 'Algo inesperado');
    });
  };

  $scope.locationSelected = function(data){
    var objRespose = data["key_locat"];
    var locationsAnswer = $scope.locationsObjs;
    for(i=0; i < locationsAnswer.length;i++){
        for(a=0; a <= locationsAnswer.length;a++){
            if(locationsAnswer[i][a]["key_locat"]==objRespose){
              $scope.city = locationsAnswer[i][a]["city_locat"];
              $scope.number = locationsAnswer[i][a]["number_locat"];
              $scope.address = locationsAnswer[i][a]["address_locat"];
              $scope.state = locationsAnswer[i][a]["state_locat"];

              window.localStorage['city_locat'] = $scope.city;
              window.localStorage['number_locat'] = $scope.number;
              window.localStorage['address_locat'] = $scope.address;
              window.localStorage['state_locat'] = $scope.state;
              window.localStorage['id_locat'] = locationsAnswer[i][a]["id_locat"];
            }
          };
      };
  };

  $scope.updateLocalization = function(data){
    var city_locat =  $scope.data.city_locat;
    var state_locat =   $scope.data.state_locat;
    var address_locat =   $scope.data.address_locat;
    var number_locat =  $scope.data.number_locat;

    if (city_locat===undefined){
        var city_locat = window.localStorage['city_locat'];
    }
    if (state_locat===undefined){
        var state_locat = window.localStorage['state_locat'];
    }
    if (address_locat===undefined){
        var address_locat = window.localStorage['address_locat'];
    }
    if (number_locat===undefined){
        var number_locat = window.localStorage['number_locat'];
    }
    var id_usu =   window.localStorage['id_usu'];
    var id_locat =   window.localStorage['id_locat'];

    $http.post(ip + '/updateLocation/'+ city_locat + '/'+ state_locat + '/' + address_locat + '/' + number_locat
    + '/' + id_locat + '/' + id_usu).
    success(function(response) {
      var dado =  angular.toJson(response);
      var obj = jQuery.parseJSON(dado);
      alertService.alertPopup('Nova localização!',
      'Registro de localização inserida com sucesso!');
    }).
    error(function() {
      alertService.alertPopup('ERRO', 'Por favor, confira suas credenciais');
    });
  };
})
;
