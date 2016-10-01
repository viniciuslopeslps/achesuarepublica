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
  return 'http://192.168.1.109:5000';
  //return 'http://flask-viniciuslopeslps.c9users.io:8080';
})
.factory('location', function() {
  return {
    saveData : function(id, city, address, state) {
      window.localStorage['city_locat'] = city===undefined?window.localStorage['city_locat']:city;
      window.localStorage['address_locat'] = address===undefined?window.localStorage['address_locat']:address;
      window.localStorage['state_locat'] = state===undefined?window.localStorage['state_locat']:state;
      window.localStorage['id_locat'] = id===undefined? window.localStorage['id_locat']:id;
    },
    clearAll : function() {
      window.localStorage['city_locat'] = " ";
      window.localStorage['address_locat'] = " ";
      window.localStorage['state_locat'] = " ";
      window.localStorage['id_locat'] = " ";
    }
  }
})
.factory('university', function() {
  return {
    saveData : function(id, name, key_locat_uni) {
      window.localStorage['name_uni'] = name===undefined?window.localStorage['name_uni']:name;
      window.localStorage['id_uni'] = id===undefined? window.localStorage['id_uni']:id;
      window.localStorage['key_locat_uni'] = key_locat_uni===undefined? window.localStorage['key_locat_uni']:key_locat_uni;
    },
    clearAll : function() {
      window.localStorage['name_uni'] = " ";
      window.localStorage['id_uni'] = " ";
      window.localStorage['key_locat_uni'] = " ";
    }
  }
})
.factory('republic', function() {
  return {
    saveData : function(id, name, key_locat) {
      window.localStorage['name_rep'] = name===undefined?window.localStorage['name_rep']:name;
      window.localStorage['id_rep'] = id===undefined? window.localStorage['id_rep']:id;
      window.localStorage['key_locat_rep'] = key_locat===undefined? window.localStorage['key_locat_rep']:key_locat;
    },
    clearAll : function() {
      window.localStorage['name_rep'] = " ";
      window.localStorage['id_rep'] = " ";
      window.localStorage['key_locat_rep'] = " ";
    }
  }
})
.factory('room', function() {
  return {
    saveData : function(title, desc, key_locat, key_rep, key_uni, id, price) {
      window.localStorage['title'] = title===undefined?window.localStorage['title']:title;
      window.localStorage['description'] = desc===undefined? window.localStorage['description']:desc;
      window.localStorage['key_locat_room'] = key_locat===undefined? window.localStorage['key_locat_room']:key_locat;
      window.localStorage['key_rep_room'] = key_rep===undefined? window.localStorage['key_rep_room']:key_rep;
      window.localStorage['key_uni_room'] = key_uni===undefined? window.localStorage['key_uni_room']:key_uni;
      window.localStorage['id_room'] = id===undefined? window.localStorage['id_room']:id;
      window.localStorage['price'] = price===undefined? window.localStorage['price']:price;
    },
    clearAll : function() {
      window.localStorage.removeItem("title");
      window.localStorage.removeItem("description");
      window.localStorage.removeItem("key_locat_room");
      window.localStorage.removeItem("key_rep_room");
      window.localStorage.removeItem("key_uni_room");
      window.localStorage.removeItem("id_room");
      window.localStorage.removeItem("price");
    }
  }
})
.factory('redirect', function($state, $ionicHistory) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  $state.go('navUser.home');
})
.factory('redirect', function($state, $ionicHistory) {
  return {
    go : function(path) {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });

      $state.go(path);
    }
  }
})
;
