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
      window.localStorage['id'] = id===undefined?window.localStorage['id']:id;
      window.localStorage['name'] = name===undefined?window.localStorage['name']:name;
      window.localStorage['email'] = email===undefined?window.localStorage['email']:email;
      window.localStorage['phone'] = phone===undefined?window.localStorage['phone']:phone;
      window.localStorage['password'] = password===undefined?window.localStorage['password']:password;
      window.localStorage['admin'] = admin===undefined?window.localStorage['admin']:admin;
    },
    logout : function() {
      window.localStorage['id'] = " ";
      window.localStorage['name'] = " ";
      window.localStorage['email'] = " ";
      window.localStorage['phone'] = " ";
      window.localStorage['password'] = " ";
      window.localStorage['admin'] = " ";
    }
  }
})
.factory('ip', function() {
  return 'http://192.168.1.106:5000';
})
;
