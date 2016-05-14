angular.module('starter.controllers',['starter.services'])

.controller('loginCtrl', function($scope, $state, $http, alertService, session, ip, redirect){

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
            'Confira seu email e logue com a nova senha');
          }
        }).
        error(function() {
          alertService.alertPopup('ERRO', 'Por favor, confira suas credenciais');
        });
        redirect.go('nav.login');
      }
    };
})

.controller('homeCtrl', function($scope, $state, $http, alertService, ip) {
  $scope.name = window.localStorage['name'];
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
        var id = window.localStorage['id_usu'];
        var password = $scope.data.password;
        var password = $scope.data.passwordConfirm;

        $http.post(ip + '/updatePassword/'+ password +"/" + id).
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
    if(data === undefined || data['city'] === undefined || data['state'] ===undefined
        || data['address'] ===undefined){
        alertService.alertPopup('ERRO','Por favor complete os campos corretamente');
    }
    else{
        var city_locat = $scope.data.city;
        var state_locat = $scope.data.state;
        var address_locat = $scope.data.address;
        var id_usu = window.localStorage['id_usu'];

        $http.post(ip + '/createLocation/'+ city_locat + '/'+ state_locat + '/'
        + address_locat + '/' + id_usu).
        success(function(response) {
          location.saveData(undefined, city_locat,address_locat, state_locat);
          alertService.alertPopup('Nova localização!','Registro de localização inserida com sucesso!');
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
    var city_locat =  $scope.data.city_locat;
    var state_locat =   $scope.data.state_locat;
    var address_locat =   $scope.data.address_locat;

    if (city_locat===undefined){
        var city_locat = window.localStorage['city_locat'];
    }
    if (state_locat===undefined){
        var state_locat = window.localStorage['state_locat'];
    }
    if (address_locat===undefined){
        var address_locat = window.localStorage['address_locat'];
    }

    var id_usu =   window.localStorage['id_usu'];
    var id_locat =   window.localStorage['id_locat'];

    $http.post(ip + '/updateLocation/'+ city_locat + '/'+ state_locat + '/' + address_locat +
     '/' + id_locat + '/' + id_usu).
    success(function(response) {
      alertService.alertPopup('Alterado!', 'Registro de localização alterado com sucesso!');
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
        }).
        error(function() {
            alertService.alertPopup('ERRO','Erro ao excluir localização');
        });
      }
    });
  };
})

.controller('universityCtrl', function($scope, $state, $http, $ionicPopup, $ionicHistory,alertService, ip, session, location, university, redirect){
    $scope.getLocationKeys = function(){
      $http.get(ip + '/getLocationKeys/').
      success(function(response) {
        var dado =  angular.toJson(response);
        var obj = jQuery.parseJSON(dado);
        if(obj['locations'] === null){
          alertService.alertPopup('ERRO',
           'Não existem localizações cadastradas, por favor primeiramente cadastre uma localização');
        }
        else{
          $scope.locationKeys = obj['locations'];
        }
      }).
      error(function() {
        alertService.alertPopup('ERRO', 'Por favor, confira suas credenciais');
      });
    };

    $scope.createUniversity = function(data){
      if(data === undefined || data['nameUniversity'] === undefined || data['locationKey'] ===undefined){
          alertService.alertPopup('ERRO','Por favor complete os campos corretamente');
      }
      else{
          var key_locat = $scope.data.locationKey;
          var name_uni = $scope.data.nameUniversity;
          var id_usu =   window.localStorage['id_usu'];

          $http.post(ip + '/createUniversity/'+ name_uni + '/'+ key_locat + '/' + id_usu).
          success(function(response) {
            alertService.alertPopup('Nova localização!','Registro de localização inserida com sucesso!');
            redirect.go('navUser.university');
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
      var id_usu = window.localStorage['id_usu'];

      $http.get(ip + '/getUniversitiesById/' + id_usu).
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
      var objRespose = data["key_uni"];
      var universitiesAnswer = $scope.universitiesObjs;
      for(i=0; i < universitiesAnswer.length;i++){
          for(a=0; a < universitiesAnswer[0].length;a++){
              if(universitiesAnswer[i][a]["key_uni"]==objRespose){
                $scope.key_uni = universitiesAnswer[i][a]["key_uni"];
                $scope.name_uni = universitiesAnswer[i][a]["name_uni"];
                $scope.locationKey = universitiesAnswer[i][a]["key_locat"];
                university.saveData(universitiesAnswer[i][a]["id_uni"], $scope.name_uni, $scope.key_locat);
              }
            };
        };
    };
    $scope.updateUniversity = function(data){
      var key_uni =  $scope.data.key_uni;
      var name_uni =   $scope.data.name_uni;
      var key_locat_uni =   $scope.data.locationKey;

      if (key_uni === undefined){
          var key_uni = window.localStorage['key_uni'];
      }
      if (name_uni===undefined){
          var name_uni = window.localStorage['name_uni'];
      }
      if (key_locat_uni===undefined){
          var key_locat_uni = window.localStorage['key_locat_uni'];
      }

      var id_usu =   window.localStorage['id_usu'];
      var id_uni =   window.localStorage['id_uni'];

      $http.post(ip + '/updateUniversity/' + name_uni + '/' + key_locat_uni + '/' + id_uni + '/' + id_usu).
      success(function(response) {
        alertService.alertPopup('Alterado!', 'Registro de localização alterado com sucesso!');
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
          var id_usu = window.localStorage['id_usu'];
          var key_uni = $scope.data.key_uni;
          $http.post(ip + '/deleteUniversity/'+ key_uni + '/' + id_usu).
          success(function(response) {
            alertService.alertPopup('Removido!','Registro removido com sucesso!');
          }).
          error(function() {
            alertService.alertPopup('ERRO', 'Alguma coisa aconteceu, tente novamente!');
          });
        }
      });

    };

  })

.controller('republicCtrl', function($scope, $state, $http, $ionicPopup, $ionicHistory,alertService, ip, session, location, republic, redirect){
      $scope.getLocationKeys = function(){
        $http.get(ip + '/getLocationKeys/').
        success(function(response) {
          var dado =  angular.toJson(response);
          var obj = jQuery.parseJSON(dado);
          if(obj['locations'] === null){
            alertService.alertPopup('ERRO',
             'Não existem localizações cadastradas, por favor primeiramente cadastre uma localização');
          }
          else{
            $scope.locationKeys = obj['locations'];
          }
        }).
        error(function() {
          alertService.alertPopup('ERRO', 'Por favor, confira suas credenciais');
        });
      };

      $scope.createRepublic = function(data){
        if(data === undefined || data['nameRepublic'] === undefined || data['locationKey'] ===undefined){
            alertService.alertPopup('ERRO','Por favor complete os campos corretamente');
        }
        else{
          var key_locat = $scope.data.locationKey;
          var name_rep = $scope.data.nameRepublic;
          var id_usu =   window.localStorage['id_usu'];

            $http.post(ip + '/createRepublic/' + name_rep + "/" + key_locat + "/" + id_usu).
            success(function(response) {
              alertService.alertPopup('Nova República!','Registro de república inserida com sucesso!');
              redirect.go('navUser.republic');
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
          alertService.alertPopup('ERRO', 'Algo inesperado aconteceu, tente novamente!');
        });
      };

      $scope.republicSelected = function(data){
        var objRespose = data["key_rep"];
        var republicAnswer = $scope.republicObjs;
        for(i=0; i < republicAnswer.length;i++){
            for(a=0; a < republicAnswer[0].length;a++){
                if(republicAnswer[i][a]["key_rep"]==objRespose){
                  $scope.republicName = republicAnswer[i][a]["name_rep"];
                  $scope.locationKey = republicAnswer[i][a]["key_locat"];
                  $scope.idRep = republicAnswer[i][a]["id_rep"];
                  republic.saveData($scope.idRep, $scope.republicName, $scope.locationKey);
                }
              };
          };
      };
      $scope.updateRepublic = function(data){
        var republicName = $scope.data.republicName;
        var keyLocatRep = $scope.data.locationKey;

        if (republicName === undefined){
            var republicName = window.localStorage['name_rep'];
        }
        if (keyLocatRep === undefined){
            var keyLocatRep = window.localStorage['key_locat_rep'];
        }

        var idUsu = window.localStorage['id_usu'];
        var idRep = window.localStorage['id_rep'];

        $http.post(ip + '/updateRepublic/' + republicName + '/' + keyLocatRep + '/' + idRep + '/' + idUsu).
        success(function(response) {
          delete $scope.data;
          alertService.alertPopup('Alterado!', 'Registro de república alterado com sucesso!');
        }).
        error(function() {
          alertService.alertPopup('ERRO', 'Por favor, confira suas credenciais');
        });

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
              alertService.alertPopup('Removido!','Registro removido com sucesso!');
              redirect.go('navUser.home');
            }).
            error(function() {
              alertService.alertPopup('ERRO', 'Alguma coisa aconteceu, tente novamente!');
            });
          }
        });

      };

    })

.controller('roomCtrl', function($scope, $state, $http, alertService, ip, redirect, room) {
  $scope.getLocationKeys = function(){
    $http.get(ip + '/getLocationKeys/').
    success(function(response) {
      var dado =  angular.toJson(response);
      var obj = jQuery.parseJSON(dado);
      if(obj['locations'] === null){
        alertService.alertPopup('ERRO',
         'Não existem localizações cadastradas, por favor primeiramente cadastre uma localização');
      }
      else{
        $scope.locationKeys = obj['locations'];
      }
    }).
    error(function() {
      alertService.alertPopup('ERRO', 'Por favor, confira suas credenciais');
    });
  };

  $scope.getUniversitiesKeys = function(){
    $http.get(ip + '/getUnivertisyKeys/').
    success(function(response) {
      var dado =  angular.toJson(response);
      var obj = jQuery.parseJSON(dado);
      if(obj['universities'] === null){
        alertService.alertPopup('ERRO',
         'Não existem Universidades cadastradas, por favor primeiramente cadastre uma universidade');
      }
      else{
        $scope.universityKeys = obj['universities'];
      }
    }).
    error(function() {
      alertService.alertPopup('ERRO', 'Por favor, confira suas credenciais');
    });
  };
  $scope.getRepublicKeys = function(){
    $http.get(ip + '/getRepublicKeys/').
    success(function(response) {
      var dado =  angular.toJson(response);
      var obj = jQuery.parseJSON(dado);
      if(obj['republics'] === null){
        $scope.republicKeys = null;
      }
      else{
        $scope.republicKeys = obj['republics'];
      }
    }).
    error(function() {
      alertService.alertPopup('ERRO', 'Por favor, confira suas credenciais');
    });
  };
  $scope.getAllFkData = function(){
    $scope.getLocationKeys();
    $scope.getUniversitiesKeys();
    $scope.getRepublicKeys();
  };
  $scope.createRoom = function(data){
    if(data === undefined || data['locationKey'] === undefined ||
        data['universityKey'] === undefined || data['description'] === undefined ||
        data['title'] === undefined){
        alertService.alertPopup('ERRO','Por favor complete os campos corretamente');
    }
    else{
      var locationKey = $scope.data.locationKey;
      var universityKey = $scope.data.universityKey;
      var republicKey = $scope.data.republicKey;
      var description = $scope.data.description;
      var title = $scope.data.title;
      var idUsu =   window.localStorage['id_usu'];

      if(republicKey === undefined){
        republicKey = null;
      }
      $http.post(ip + '/createRoom/' + locationKey + "/" + universityKey + "/"
        + republicKey + "/" + description + "/" + title + "/" + idUsu).
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
              room.saveData($scope.title, $scope.description, $scope.locationKey,
                 $scope.republicKey, $scope.universityKey, $scope.idRoom);
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

    var idRoom = window.localStorage['id_room'];
    var idUsu = window.localStorage['id_usu'];

    if(republicKey === undefined || republicKey.length === 0){
      republicKey = null;
    }

    $http.post(ip + '/updateRoom/' + locationKey + "/" + universityKey + "/"
      + republicKey + "/" + desc + "/" + title + "/" + idUsu + "/" + idRoom).
      success(function(response) {
        alertService.alertPopup('Nova Quarto!','Registro de quarto alterado com sucesso!');
        delete $scope.data;
        delete $scope.locationKey;
        delete $scope.republicKey;
        delete $scope.universityKey;
        delete $scope.title;
        delete $scope.description;
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
        room.clearAll();
      }).
      error(function() {
        alertService.alertPopup('ERRO', 'Algo inesperado aconteceu!');
      });
  };
})
;
