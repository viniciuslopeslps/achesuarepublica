angular.module('starter.services', [])
.factory('alertService', function($ionicPopup) {
  return {
    alertPopup : function(messageTitle, messageBody) {
      var alertPopup = $ionicPopup.alert({
        title: messageTitle,
        template: messageBody
      });
    }
  }
})
.factory('session', function() {
  return {
    saveData : function(id, name, email, phone, password, admin) {
      window.localStorage['id_usu'] = id===undefined?window.localStorage['id_usu']:id;
      window.localStorage['name'] = name===undefined?window.localStorage['name']:name;
      window.localStorage['email'] = email===undefined?window.localStorage['email']:email;
      window.localStorage['phone'] = phone===undefined?window.localStorage['phone']:phone;
      window.localStorage['password'] = password===undefined?window.localStorage['password']:password;
      window.localStorage['admin'] = admin===undefined?window.localStorage['admin']:admin;
    },
    logout : function() {
      window.localStorage['id_usu'] = " ";
      window.localStorage['name'] = " ";
      window.localStorage['email'] = " ";
      window.localStorage['phone'] = " ";
      window.localStorage['password'] = " ";
      window.localStorage['admin'] = " ";
    }
  }
})
.factory('ip', function() {
  return 'http://192.168.1.105:5000';
})
.factory('location', function() {
  return {
    saveData : function(id, city, number, address, state) {
      window.localStorage['city_locat'] = city===undefined?window.localStorage['city_locat']:city;
      window.localStorage['number_locat'] = number===undefined?window.localStorage['number_locat']:number;
      window.localStorage['address_locat'] = address===undefined?window.localStorage['address_locat']:address;
      window.localStorage['state_locat'] = state===undefined?window.localStorage['state_locat']:state;
      window.localStorage['id_locat'] = id===undefined? window.localStorage['id_locat']:id;
    },
    clearAll : function() {
      window.localStorage['city_locat'] = " ";
      window.localStorage['number_locat'] = " ";
      window.localStorage['address_locat'] = " ";
      window.localStorage['state_locat'] = " ";
      window.localStorage['id_locat'] = " ";
    }
  }
})
;
