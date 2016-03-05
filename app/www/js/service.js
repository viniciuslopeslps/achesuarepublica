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
;
