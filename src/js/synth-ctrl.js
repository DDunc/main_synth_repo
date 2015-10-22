require("./synth-app.js");


// ========= START OF CONTROLLER ======= //
angular.module('synthy').controller('SynthCtrl', ["SynthService", "$scope", "$http", function(SynthService, $scope, $http) {
 $scope.profile = {};
 $scope.preset = {};

 $scope.signIn = function(){
    $http.get("api/auth/google")
      .then(function(res){
        $scope.profile = res.data; 
        console.log('Authentication successful!');
        
      }, function(res){
        console.log(res);
      }); 
  };

  $scope.getPreset = function(){
    $http.get("api/get_preset")
      .then(function(res){
        $scope.preset = res.data;
        console.log('getting preset successful!');
        
      }, function(res){
        console.log(res);
      }); 
  };

  $scope.savePreset = function(preset){
    $http.post("api/save_preset", preset)
      .then(function(res){
        //do some stuff
        console.log('saving preset successful!');
        
      }, function(res){
        console.log(res);
      }); 
  };

  $scope.removePreset = function(preset){
    $http.delete("api/remove_preset" + preset.ownderId)
      .then(function(res){
        //do some stuff
        console.log('removing preset successful!');
        
      }, function(res){
        console.log(res);
      }); 
  };
}]);