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

   
  $scope.presets  = [
  {name:'John', age:25, gender:'boy'},
  {name:'Jessie', age:30, gender:'girl'},
  {name:'Johanna', age:28, gender:'girl'},
  {name:'Joy', age:15, gender:'girl'},
  {name:'Mary', age:28, gender:'girl'},
  {name:'Peter', age:95, gender:'boy'},
  {name:'Sebastian', age:50, gender:'boy'},
  {name:'Erika', age:27, gender:'girl'},
  {name:'Patrick', age:40, gender:'boy'},
  {name:'Samantha', age:60, gender:'girl'}
];


}]);











