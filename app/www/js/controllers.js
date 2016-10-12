angular.module('starter.controllers',['starter.services', 'ion-autocomplete'])

.controller('loginCtrl', function($scope, $state, $http, alertService, session, ip, redirect){

    $scope.login = function(data) {
      if(data === undefined || data['email'] === undefined || data['password'] ===undefined){
        alertService.alertPopup('ERRO','Por favor complete os campos corretamente');
      }
      else {
        var email = $scope.data.email;
        var password = $scope.data.password;
        var jsSha = new jsSHA(password);
        var hash = jsSha.getHash("SHA-512", "HEX");

        $http.get(ip + '/login/'+ email + '/'+ hash).
        success(function(response) {
          var dado =  angular.toJson(response);
          var obj = jQuery.parseJSON(dado);
          if(obj.user==null){
            alertService.alertPopup('ERRO','Por favor complete os campos corretamente');
          }
          else {
            session.saveData(obj.user.id, obj.user.name, obj.user.email,
              obj.user.phone, obj.user.password, obj.user.admin);
            redirect.go('navUser.home');
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
            'Confira seu email e acesse com a nova senha');
          }
        }).
        error(function() {
          alertService.alertPopup('ERRO', 'Por favor, confira suas credenciais');
        });
        redirect.go('nav.login');
      }
    };
})

.controller('homeCtrl', function($scope, $state, $http, alertService, ip, redirect) {
  $scope.name = window.localStorage['name'];
  $scope.rooms ="";

  $scope.getRooms = function(){
    $http.get(ip + '/getRooms/').
      success(function(response) {
        var dado =  angular.toJson(response);
        var obj = jQuery.parseJSON(dado);
        if(obj['rooms'] !== null){
          $scope.rooms = obj['rooms'];
        }
      }).
      error(function() {
        alertService.alertPopup('ERRO', 'Algo inesperado aconteceu');
      });
  };

  $scope.getRoomById = function(idRoom){
    window.localStorage['id_room_selected'] = idRoom;
    redirect.go('navUser.selectedRoom');
  };

  $scope.getRooms();
})

.controller('selectedRoomCtrl', function($scope, $state, $http, alertService, ip, $ionicModal) {
  $scope.name = window.localStorage['name'];
  $scope.idRoom = window.localStorage['id_room_selected'];

  $scope.getRooms = function(){
    var idRoom = window.localStorage['id_room_selected'];
    $http.get(ip + '/getRoomById/' + idRoom).
      success(function(response) {
        var dado =  angular.toJson(response);
        var obj = jQuery.parseJSON(dado);
        if(obj['room'] !== null){
          $scope.room = obj['room'][0];
          window.localStorage['email_owner'] = (obj['room'][0]['email_owner']);
        }
      }).
      error(function() {
        alertService.alertPopup('ERRO', 'Algo inesperado aconteceu');
      });
  };

  $scope.sendContactEmail = function(data){
    if(data === undefined || data['subject'] === undefined || data['message'] === undefined){
      alertService.alertPopup('ERRO','Por favor complete os campos corretamente');
    }else{
      var emailOwner = window.localStorage['email_owner'];
      var email = window.localStorage['email'];
      var name = window.localStorage['name'];
      var subject = data['subject'];
      var message = data['message'];

      $http.post(ip + '/sendRoomInterested/'+ emailOwner + '/'+ email + '/' + subject + "/" + message).
      success(function(response) {
        var dado =  angular.toJson(response);
        var obj = jQuery.parseJSON(dado);
        alertService.alertPopup('Falta pouco!','Contato realizado com sucesso!');
        delete $scope.data;
      }).
      error(function() {
        alertService.alertPopup('ERRO', 'Por favor, tente novamente mais tarde');
      });
    }
  };

  $ionicModal.fromTemplateUrl('my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  $scope.getRooms();
})

.controller('profileCtrl', function($scope, $state, $ionicPopup, $http, alertService, ip, redirect) {
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
        var jsSha = new jsSHA(password);
        var hash = jsSha.getHash("SHA-512", "HEX");
        var confirmPassword = $scope.data.confirmPassword;
        var name = $scope.data.name;
        var phone = $scope.data.phone;

        $http.post(ip + '/createUser/'+ email + '/'+ hash + '/' + name + '/' + phone).
        success(function(response) {
          var dado =  angular.toJson(response);
          var obj = jQuery.parseJSON(dado);
          alertService.alertPopup('Bem vindo ao ache sua república',
          'Registro de usuário inserido com sucesso!');
          delete $scope.data;
        }).
        error(function() {
          alertService.alertPopup('ERRO', 'Por favor, confira suas credenciais');
        });
        redirect.go('nav.login');
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
          var id = window.localStorage['id_usu'];
          $http.post(ip + '/deleteUser/'+ id).
          success(function(response) {
            var dado =  angular.toJson(response);
            var obj = jQuery.parseJSON(dado);
            alertService.alertPopup('Deletado com sucesso!','Registro deletado com sucesso!');
            redirect.go('nav.login');

          }).
          error(function() {
              alertService.alertPopup('ERRO','Erro ao excluir usuário, verifique se este registro não está relacionado a outros registros');
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
        var id = window.localStorage['id_usu'];
        var password = $scope.data.password;
        var password = $scope.data.passwordConfirm;

        var jsSha = new jsSHA(password);
        var hash = jsSha.getHash("SHA-512", "HEX");

        $http.post(ip + '/updatePassword/'+ hash +"/" + id).
        success(function(response) {
          var dado =  angular.toJson(response);
          var obj = jQuery.parseJSON(dado);
          alertService.alertPopup('Atualizado!', 'Senha atualizada com sucesso!');
        }).
        error(function() {
          alertService.alertPopup('ERRO', 'Por favor, confira suas credenciais');
        });
        redirect.go('nav.login');
      }
    };
})

.controller('logoutCtrl', function($scope, $state, session, redirect){
  $scope.logout = function(){
    session.logout();
    redirect.go('nav.login');
  };
})

.controller('locationCtrl', function($scope, $state, $http, $ionicPopup, alertService, ip, session, location, redirect){

  $scope.states = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

  $scope.createNewLocation = function(data){
    if(data === undefined || data['city'] === undefined || data['state'] ===undefined){
        alertService.alertPopup('ERRO','Por favor complete os campos corretamente');
    }
    else{
        var city_locat = $scope.data.city;
        var state_locat = $scope.data.state;
        var address_locat = $scope.data.address;

        if (address_locat !== undefined && address_locat.length===0){
          address_locat = undefined;
        }

        var id_usu = window.localStorage['id_usu'];

        $http.post(ip + '/createLocation/'+ city_locat + '/'+ state_locat + '/'
        + address_locat + '/' + id_usu).
        success(function(response) {
          location.saveData(undefined, city_locat,address_locat, state_locat);
          alertService.alertPopup('Nova localização!','Registro de localização inserida com sucesso!');
          delete $scope.data;
        }).
        error(function() {
          alertService.alertPopup('ERRO', 'Localização já existente na base de dados!');
        });
    }
  };

  var locationsArray = $scope.locationsArray = [];
  var locationsObjs = $scope.locationsObjs = [];

  $scope.getLocations = function(){
    var locationsArray = $scope.locationsArray = [];
    var locationsObjs = $scope.locationsObjs = [];
    var id_usu = window.localStorage['id_usu'];

    $http.get(ip + '/getLocationsById/' + id_usu).
    success(function(response) {
      var dado =  angular.toJson(response);
      var obj = jQuery.parseJSON(dado);
      var locations = obj["locations"];
      if(locations!== null){
        for (i = 0; i < locations.length; i++) {
          var objctKey = {};
          $scope.locationsArray.push(locations[i]["key_locat"]);
        }
        $scope.locationsObjs.push(locations);
      }
      else{
        alertService.alertPopup('ERRO', 'Não existem cidades cadastradas por esse usuário!');
      }
    }).
    error(function() {
      alertService.alertPopup('ERRO', 'Algo inesperado');
    });
  };

  $scope.locationSelected = function(data){
    var objRespose = data["key_locat"];
    var locationsAnswer = $scope.locationsObjs;
    for(i=0; i < locationsAnswer.length;i++){
        for(a=0; a < locationsAnswer[0].length;a++){
            if(locationsAnswer[i][a]["key_locat"]==objRespose){
              $scope.city = locationsAnswer[i][a]["city_locat"];
              $scope.address = locationsAnswer[i][a]["address_locat"];
              $scope.state = locationsAnswer[i][a]["state_locat"];

              location.saveData(locationsAnswer[i][a]["id_locat"],$scope.city,
              $scope.address, $scope.state);
            }
          };
      };
  };

  $scope.updateLocalization = function(data){
    var city =  $scope.data.city;
    var state =   $scope.data.state;
    var address =   $scope.data.address;

    if (city===undefined){
        var city = window.localStorage['city_locat'];
    }
    if (state===undefined){
        var state = window.localStorage['state_locat'];
    }
    if (address===undefined){
        var address = window.localStorage['address_locat'];
    }

    var idUsu =   window.localStorage['id_usu'];
    var idLocat =   window.localStorage['id_locat'];

    $http.post(ip + '/updateLocation/'+ city + '/'+ state + '/' + address + '/' + idLocat + '/' + idUsu).
    success(function(response) {
      alertService.alertPopup('Alterado!', 'Registro de localização alterado com sucesso!');
      delete $scope.data;
      delete $scope.city;
      delete $scope.state;
      delete $scope.address;
    }).
    error(function() {
      alertService.alertPopup('ERRO', 'Por favor, confira suas credenciais');
    });
  };

  $scope.deleteLocation = function(data){
    var key_locat = data['key_locat'];
    var confirmPopup = $ionicPopup.confirm({
      title: 'Confirmação',
      template: 'Você tem certeza que deseja deletar a localização: ' + data['key_locat']+'?'
    });
    confirmPopup.then(function(res) {
      if(res) {
        var id_locat = window.localStorage['id_locat'];
        $http.post(ip + '/deleteLocation/' + id_locat).
        success(function(response) {
          alertService.alertPopup('Deletado com sucesso!', 'Registro deletado com sucesso!');
          location.clearAll();
          delete $scope.data;
          delete $scope.city;
          delete $scope.state;
          delete $scope.address;
        }).
        error(function() {
            alertService.alertPopup('ERRO','Erro ao excluir localização, verifique se este registro não está relacionado a outros registros');
        });
      }
    });
  };
})

.controller('universityCtrl', function($scope, $state, $http, $ionicPopup, $ionicHistory,alertService, ip, session, location, university, redirect){
    $scope.locationKeys = "";

    $scope.getLocations = function() {
        $http.get(ip + '/getLocationKeys/').
        success(function(response) {
          var dado = angular.toJson(response);
          var obj = jQuery.parseJSON(dado);
          $scope.locationKeys = obj['locations'];
          return obj;
        }).
        error(function() {
          return "ERROR";
        });
      };

    $scope.getFilterItems = function (query) {
      $scope.getLocations();
      var locations = $scope.locationKeys;
      var array = [];
      if (query) {
        for (var i = 0; i < locations.length; i++) {
          if(locations[i].toLowerCase().indexOf(query.toLowerCase())!=-1){
            array.push({id: i, name: locations[i], view: locations[i] + query + locations[i]});
          }
        };
        return {
          items: array
        };
      }
      return {items: []};
    };

    $scope.getLocationKeys = function() {
      $scope.getLocations();
      var locations = $scope.locationKeys;
      if(locations === null || locations === undefined) {
        alertService.alertPopup('ERRO',
        'Não existem localizações cadastradas, por favor primeiramente cadastre uma localização');
      }
      if(locations === "ERROR") {
        alertService.alertPopup('ERRO', 'Por favor, confira suas credenciais');
      }
    };

    $scope.createUniversity = function(data){
      if(data === undefined || data['name'] === undefined || data['locationKey'] ===undefined){
          alertService.alertPopup('ERRO','Por favor complete os campos corretamente');
      }
      else{
          var keyLocat = $scope.data.locationKey;
          var name = $scope.data.name;
          var idUsu =   window.localStorage['id_usu'];

          $http.post(ip + '/createUniversity/'+ name + '/'+ keyLocat + '/' + idUsu).
          success(function(response) {
            alertService.alertPopup('Nova localização!','Registro de localização inserida com sucesso!');
            redirect.go('navUser.university');
            delete $scope.data;
          }).
          error(function() {
            alertService.alertPopup('ERRO', 'Localização já existente na base de dados!');
          });
      }
    };
    var universitiesArray = $scope.universitiesArray = [];
    var universitiesObjs = $scope.universitiesObjs = [];

    $scope.getUniversities = function(){
      $scope.getLocationKeys();
      var universitiesArray = $scope.universitiesArray = [];
      var universitiesObjs = $scope.universitiesObjs = [];
      var idUsu = window.localStorage['id_usu'];

      $http.get(ip + '/getUniversitiesById/' + idUsu).
      success(function(response) {
        var dado =  angular.toJson(response);
        var obj = jQuery.parseJSON(dado);
        var universities = obj["universities"];
        if(universities !== null){
          for (i = 0; i < universities.length; i++) {
            var objctKey = {};
            $scope.universitiesArray.push(universities[i]["key_uni"]);
          }
          $scope.universitiesObjs.push(universities);
        }
        else{
          alertService.alertPopup('ERRO', 'Não existem universidades criadas por esse usuário!');
        }
      }).
      error(function() {
        alertService.alertPopup('ERRO', 'Algo inesperado');
      });
    };

    $scope.universitySelected = function(data){
      var objRespose = data["keyUni"];
      var universitiesAnswer = $scope.universitiesObjs;
      for(i=0; i < universitiesAnswer.length;i++){
          for(a=0; a < universitiesAnswer[0].length;a++){
              if(universitiesAnswer[i][a]["key_uni"]==objRespose){
                $scope.keyUni = universitiesAnswer[i][a]["key_uni"];
                $scope.name = universitiesAnswer[i][a]["name_uni"];
                $scope.locationKey = universitiesAnswer[i][a]["key_locat"];
                university.saveData(universitiesAnswer[i][a]["id_uni"], $scope.name, $scope.locationKey);
              }
            };
        };
    };
    $scope.updateUniversity = function(data){
      var keyUni =  $scope.data.keyUni;
      var name =   $scope.data.name;
      var keyLocatUni =   $scope.data.locationKey;

      if (keyUni === undefined){
          var keyUni = window.localStorage['key_uni'];
      }
      if (name===undefined || name.length === 0){
          var name = window.localStorage['name_uni'];
      }
      if (keyLocatUni===undefined){
          var keyLocatUni = window.localStorage['key_locat_uni'];
      }

      var idUsu =   window.localStorage['id_usu'];
      var idUni =   window.localStorage['id_uni'];

      $http.post(ip + '/updateUniversity/' + name + '/' + keyLocatUni + '/' + idUni + '/' + idUsu).
      success(function(response) {
        alertService.alertPopup('Alterado!', 'Registro de localização alterado com sucesso!');
        delete $scope.name;
        delete $scope.locationKey;
        delete $scope.data;
      }).
      error(function() {
        alertService.alertPopup('ERRO', 'Por favor, confira suas credenciais');
      });

    };

    $scope.deleteUniversity = function(data){
      var confirmPopup = $ionicPopup.confirm({
        title: 'Confirmação',
        template: 'Você tem certeza que deseja remover esta universidade?'
      });
      confirmPopup.then(function(res) {
        if(res) {
          var idUsu = window.localStorage['id_usu'];
          var keyUni = $scope.data.keyUni;
          $http.post(ip + '/deleteUniversity/'+ keyUni + '/' + idUsu).
          success(function(response) {
            alertService.alertPopup('Removido!','Registro removido com sucesso!');
            delete $scope.name;
            delete $scope.locationKey;
            delete $scope.data;
          }).
          error(function() {
            alertService.alertPopup('ERRO', 'Erro ao excluir universidade, verifique se este registro não está relacionado a outros registros');
          });
        }
      });

    };
  })

.controller('republicCtrl', function($scope, $state, $http, $ionicPopup, $ionicHistory,alertService, ip, session, location, republic, redirect){
  $scope.locationKeys = "";

  $scope.getLocations = function() {
      $http.get(ip + '/getLocationKeys/').
      success(function(response) {
        var dado = angular.toJson(response);
        var obj = jQuery.parseJSON(dado);
        $scope.locationKeys = obj['locations'];
        return obj;
      }).
      error(function() {
        return "ERROR";
      });
    };

  $scope.getFilterItems = function (query) {
    $scope.getLocations();
    var locations = $scope.locationKeys;
    var array = [];
    if (query) {
      for (var i = 0; i < locations.length; i++) {
        if(locations[i].toLowerCase().indexOf(query.toLowerCase())!=-1){
          array.push({id: i, name: locations[i], view: locations[i] + query + locations[i]});
        }
      };
      return {
        items: array
      };
    }
    return {items: []};
  };

  $scope.getLocationKeys = function() {
    $scope.getLocations();
    var locations = $scope.locationKeys;
    if(locations === null || locations === undefined) {
      alertService.alertPopup('ERRO',
      'Não existem localizações cadastradas, por favor primeiramente cadastre uma localização');
    }
    if(locations === "ERROR") {
      alertService.alertPopup('ERRO', 'Por favor, confira suas credenciais');
    }
  };

  $scope.createRepublic = function(data){
    if(data === undefined || data['name'] === undefined || data['locationKey'] ===undefined){
      alertService.alertPopup('ERRO','Por favor complete os campos corretamente');
    }
    else{
      var key_locat = $scope.data.locationKey;
      var name_rep = $scope.data.name;
      var id_usu =   window.localStorage['id_usu'];

      $http.post(ip + '/createRepublic/' + name_rep + "/" + key_locat + "/" + id_usu).
      success(function(response) {
        alertService.alertPopup('Nova República!','Registro de república inserida com sucesso!');
        delete $scope.data;
      }).
      error(function() {
        alertService.alertPopup('ERRO', 'República já existente na base de dados!');
      });
    }
  };
  var republicArray = $scope.republicArray = [];
  var republicObjs = $scope.republicObjs = [];

  $scope.getRepublics = function(){
    $scope.getLocationKeys();
    var republicArray = $scope.republicArray = [];
    var republicObjs = $scope.republicObjs = [];
    var idUsu = window.localStorage['id_usu'];

    $http.get(ip + '/getRepublicsById/' + idUsu).
      success(function(response) {
        var dado =  angular.toJson(response);
        var obj = jQuery.parseJSON(dado);
        var republics = obj["republics"];
        if(republics !== null){
          for (i = 0; i < republics.length; i++) {
            var objctKey = {};
              $scope.republicArray.push(republics[i]["key_rep"]);
            }
            $scope.republicObjs.push(republics);
          }
        else{
            alertService.alertPopup('ERRO', 'Não existem repúblicas criadas por esse usuário!');
        }
    }).
    error(function() {
      alertService.alertPopup('ERRO', 'Erro ao excluir república, verifique se este registro não está relacionado a outros registros');
    });
  };

  $scope.republicSelected = function(data){
    var objRespose = data["keyRep"];
    var republicAnswer = $scope.republicObjs;
    for(i=0; i < republicAnswer.length;i++){
        for(a=0; a < republicAnswer[0].length;a++){
            if(republicAnswer[i][a]["key_rep"]==objRespose){
              $scope.name = republicAnswer[i][a]["name_rep"];
              $scope.locationKey = republicAnswer[i][a]["key_locat"];
              $scope.idRep = republicAnswer[i][a]["id_rep"];
              republic.saveData($scope.idRep, $scope.republicName, $scope.locationKey);
            }
        };
     };
  };
  $scope.updateRepublic = function(data){
    if(data === undefined || data['keyRep'] === undefined){
        alertService.alertPopup('Alteração', 'É preciso de uma república para alterar!');
    }
    else {
      var name = $scope.data.name;
      var keyLocatRep = $scope.data.locationKey;

      if (name === undefined || name.length === 0){
          var name = window.localStorage['name_rep'];
      }
      if (keyLocatRep === undefined){
          var keyLocatRep = window.localStorage['key_locat_rep'];
      }

      var idUsu = window.localStorage['id_usu'];
      var idRep = window.localStorage['id_rep'];

      $http.post(ip + '/updateRepublic/' + name + '/' + keyLocatRep + '/' + idRep + '/' + idUsu).
        success(function(response) {
          delete $scope.data;
          delete $scope.name;
          delete $scope.locationKey;

          alertService.alertPopup('Alterado!', 'Registro de república alterado com sucesso!');
      }).
      error(function() {
          alertService.alertPopup('ERRO', 'Por favor, confira suas credenciais');
      });
    }
  };

  $scope.deleteRepublic = function(data){
    var confirmPopup = $ionicPopup.confirm({
      title: 'Confirmação',
      template: 'Você tem certeza que deseja remover esta república?'
    });
    confirmPopup.then(function(res) {
      if(res) {
        var idUsu = window.localStorage['id_usu'];
        var idRep = window.localStorage['id_rep'];

        $http.post(ip + '/deleteRepublic/'+ idRep + '/' + idUsu).
        success(function(response) {

          delete $scope.data;
          delete $scope.name;
          delete $scope.locationKey;

          alertService.alertPopup('Removido!','Registro removido com sucesso!');
        }).
        error(function() {
          alertService.alertPopup('ERRO', 'Erro ao exluir república, verifique se este registro não está relacionado a outros registros');
        });
      }
    });
  };
})

.controller('roomCtrl', function($scope, $state, $http, alertService, ip, redirect, room) {
  $scope.locationKeys = "";
  $scope.universityKeys = "";
  $scope.republicKeys = "";

  //localizações
  $scope.getLocations = function() {
      $http.get(ip + '/getLocationKeys/').
      success(function(response) {
        var dado = angular.toJson(response);
        var obj = jQuery.parseJSON(dado);
        $scope.locationKeys = obj['locations'];
        return obj;
      }).
      error(function() {
        return "ERROR";
      });
    };

  $scope.getLocationItems = function (query) {
    $scope.getLocations();
    var locations = $scope.locationKeys;
    var array = [];
    if (query) {
      for (var i = 0; i < locations.length; i++) {
        if(locations[i].toLowerCase().indexOf(query.toLowerCase())!=-1){
          array.push({id: i, name: locations[i], view: locations[i] + query + locations[i]});
        }
      };
      return {
        items: array
      };
    }
    return {items: []};
  };

  $scope.getLocationKeys = function() {
    $scope.getLocations();
    var locations = $scope.locationKeys;
    if(locations === null || locations === undefined) {
      alertService.alertPopup('ERRO',
      'Não existem localizações cadastradas, por favor primeiramente cadastre uma localização');
    }
    if(locations === "ERROR") {
      alertService.alertPopup('ERRO', 'Por favor, confira suas credenciais');
    }
  };

  //universidades
  $scope.getUniversities = function() {
    $http.get(ip + '/getUnivertisyKeys/').
    success(function(response) {
      var dado =  angular.toJson(response);
      var obj = jQuery.parseJSON(dado);
      $scope.universityKeys = obj['universities'];
      return obj;
    }).
    error(function() {
      return "ERROR";
    });
  };

  $scope.getUniversityItems = function (query) {
    $scope.getUniversities();
    var universities = $scope.universityKeys;
    var array = [];
    if (query) {
      for (var i = 0; i < universities.length; i++) {
        if(universities[i].toLowerCase().indexOf(query.toLowerCase())!=-1){
          array.push({id: i, name: universities[i], view: universities[i] + query + universities[i]});
        }
      };
      return {
          items: array
        };
      }
      return {items: []};
  };

  $scope.getUniversitiesKeys = function() {
    $scope.getUniversities();
    var universities = $scope.universityKeys;
    if(universities === null || universities === undefined) {
      alertService.alertPopup('ERRO',
       'Não existem Universidades cadastradas, por favor primeiramente cadastre uma universidade');
    }
    if(universities === "ERROR") {
      alertService.alertPopup('ERRO', 'Por favor, confira suas credenciais');
    }
  };

  //republica
  $scope.getRepublics = function() {
    $http.get(ip + '/getRepublicKeys/').
    success(function(response) {
      var dado =  angular.toJson(response);
      var obj = jQuery.parseJSON(dado);
      $scope.republicKeys = obj['republics'];
      return obj;
    }).
    error(function() {
      return "ERROR";
    });
  };

  $scope.getRepublicItems = function (query) {
    $scope.getRepublics();
    var republics = $scope.republicKeys;
    var array = [];
    if (query) {
      for (var i = 0; i < republics.length; i++) {
        if(republics[i].toLowerCase().indexOf(query.toLowerCase())!=-1){
          array.push({id: i, name: republics[i], view: republics[i] + query + republics[i]});
        }
      };
      return {
          items: array
        };
      }
      return {items: []};
  };

  $scope.getRepublicKeys = function() {
    $scope.getRepublics();
    var republics = $scope.republicKeys;
    if(republics === "ERROR") {
      alertService.alertPopup('ERRO', 'Por favor, confira suas credenciais');
    }
  };

  ///

  $scope.getAllFkData = function(){
    $scope.getLocationKeys();
    $scope.getUniversitiesKeys();
    $scope.getRepublicKeys();
  };

  $scope.createRoom = function(data){
    if(data === undefined || data['locationKey'] === undefined ||
        data['universityKey'] === undefined || data['description'] === undefined ||
        data['title'] === undefined || data['price'] === undefined){
        alertService.alertPopup('ERRO','Por favor complete os campos corretamente');
    }
    else{
      var locationKey = $scope.data.locationKey;
      var universityKey = $scope.data.universityKey;
      var republicKey = $scope.data.republicKey;
      var description = $scope.data.description;
      var price = $scope.data.price;
      var title = $scope.data.title;
      var idUsu =   window.localStorage['id_usu'];

      if(republicKey === undefined){
        republicKey = null;
      }
      $http.post(ip + '/createRoom/' + locationKey + "/" + universityKey + "/"
        + republicKey + "/" + description + "/" + title + "/" + idUsu + "/" + price).
        success(function(response) {
          alertService.alertPopup('Nova Quarto!','Registro de quarto inserido com sucesso!');
          delete $scope.data;
          redirect.go('navUser.room');
        }).
        error(function() {
          alertService.alertPopup('ERRO', 'Quarto já existente na base de dados!');
        });
    }
  };

  $scope.getRoomsByUser = function(){
    var roomArray = $scope.roomArray = [];
    var roomObjs = $scope.roomObjs = [];
    var idUsu = window.localStorage['id_usu'];

    $http.get(ip + '/getRoomsByUser/' + idUsu).
    success(function(response) {
      var dado =  angular.toJson(response);
      var obj = jQuery.parseJSON(dado);
      var rooms = obj["rooms"];
      if(rooms !== null){
        for (i = 0; i < rooms.length; i++) {
          var objctKey = {};
          $scope.roomArray.push(rooms[i]["title"]);
        }
        $scope.roomObjs.push(rooms);
      }
      else{
        alertService.alertPopup('ERRO', 'Não existem quartos criadas por esse usuário!');
      }
    }).
    error(function() {
      alertService.alertPopup('ERRO', 'Algo inesperado aconteceu, tente novamente!');
    });
  };

  $scope.roomSelected = function(data){
    $scope.getAllFkData();
    var objRespose = data["selectTitle"];
    var roomAnswer = $scope.roomObjs;
    for(i=0; i < roomAnswer.length;i++){
        for(a=0; a < roomAnswer[0].length;a++){
            if(roomAnswer[i][a]["title"]==objRespose){
              $scope.description = roomAnswer[i][a]["description"];
              $scope.title = roomAnswer[i][a]["title"];
              $scope.locationKey = roomAnswer[i][a]["key_locat"];
              $scope.universityKey = roomAnswer[i][a]["key_uni"];
              $scope.republicKey = roomAnswer[i][a]["key_rep"];
              $scope.idRoom = roomAnswer[i][a]["id_room"];
              $scope.price = roomAnswer[i][a]["price"];
              room.saveData($scope.title, $scope.description, $scope.locationKey,
                 $scope.republicKey, $scope.universityKey, $scope.idRoom, $scope.price);
            }
        }
      }
  };

  $scope.updateRoom = function(data){
    var desc = $scope.data.description;
    var title = $scope.data.title;
    var universityKey = $scope.data.universityKey;
    var republicKey = $scope.data.republicKey;
    var locationKey = $scope.data.locationKey;
    var price = $scope.data.price;

    if (desc === undefined){
      var desc = window.localStorage['description'];
    }
    if (title === undefined){
      var title = window.localStorage['title'];
    }
    if (universityKey === undefined){
      var universityKey = window.localStorage['key_uni_room'];
    }
    if (universityKey === undefined){
      var universityKey = window.localStorage['key_uni_room'];
    }
    if (republicKey === undefined){
      var republicKey = window.localStorage['key_rep_room'];
    }
    if (locationKey === undefined){
      var locationKey = window.localStorage['key_locat_room'];
    }
    if (price === undefined){
      var price = window.localStorage['price'];
    }

    var idRoom = window.localStorage['id_room'];
    var idUsu = window.localStorage['id_usu'];

    if(republicKey === undefined || republicKey.length === 0){
      republicKey = null;
    }

    $http.post(ip + '/updateRoom/' + locationKey + "/" + universityKey + "/"
      + republicKey + "/" + desc + "/" + title + "/" + price + "/" + idUsu + "/" + idRoom).
      success(function(response) {
        alertService.alertPopup('Quarto alterado!','Registro de quarto alterado com sucesso!');
        delete $scope.data;
        delete $scope.locationKey;
        delete $scope.republicKey;
        delete $scope.universityKey;
        delete $scope.title;
        delete $scope.description;
        delete $scope.price;
        room.clearAll();
      }).
      error(function() {
        alertService.alertPopup('ERRO', 'Quarto já existente na base de dados!');
      });
  };

  $scope.deleteRoom = function(data){
    var idRoom = window.localStorage['id_room'];
    var idUsu = window.localStorage['id_usu'];
    $http.post(ip + '/deleteRoom/' + idRoom + "/" + idUsu).
      success(function(response) {
        alertService.alertPopup('Quarto removido','Registro de quarto removido com sucesso!');
        delete $scope.data;
        delete $scope.locationKey;
        delete $scope.republicKey;
        delete $scope.universityKey;
        delete $scope.title;
        delete $scope.description;
        delete $scope.price;

        room.clearAll();
      }).
      error(function() {
        alertService.alertPopup('ERRO', 'Algo inesperado aconteceu!');
      });
  };
})

.controller('searchRoomsCtrl', function($scope, $state, $http, alertService, ip, redirect) {
  $scope.price = 100;
  $scope.rooms = [];

  $scope.searchRoom = function(data){
    if(data === undefined || data['location'] === undefined &&
        data['university'] === undefined && data['republic'] === undefined){
        alertService.alertPopup('ERRO','É preciso no minimo um campo para buscar');
    }
    else{
      window.localStorage["search_room_price"] = $scope.price;
      window.localStorage["search_room_location"] = $scope.data.location;
      window.localStorage["search_room_republic"] = $scope.data.republic;
      window.localStorage["search_room_university"] = $scope.data.university;
      redirect.go('navUser.searchedRoom');
    }
  };
})

.controller('searchedRoomCtrl', function($scope, $state, $http, alertService, ip, redirect) {
  var price = window.localStorage["search_room_price"];
  var location = window.localStorage["search_room_location"];
  var republic = window.localStorage["search_room_republic"];
  var university = window.localStorage["search_room_university"];

  $scope.getRoomById = function(idRoom){
    window.localStorage['id_room_selected'] = idRoom;
    redirect.go('navUser.selectedRoom');
  };

  $http.get(ip + '/getSearchRooms/' + location + "/" + republic + "/" + university + "/" + price).
    success(function(response) {
      var dado =  angular.toJson(response);
      var obj = jQuery.parseJSON(dado);
      var rooms = obj["rooms"];

      if(rooms !== null && rooms.length > 0){
          $scope.rooms = rooms;
      }
      else{
        alertService.alertPopup('ERRO', 'Não existem quartos pesquisados com essas regras!');
        redirect.go('navUser.searchRooms');
      }
    }).
    error(function() {
      alertService.alertPopup('ERRO', 'Algo inesperado aconteceu!');
    });
})
;
