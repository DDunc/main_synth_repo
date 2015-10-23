require("./synth-app.js");


// ========= START OF CONTROLLER ======= //
angular.module('synthy').controller('SynthCtrl', ["$scope", "$http", function($scope, $http) {
 // $scope.profile = {};
 // $scope.preset = {};

 $scope.signIn = function(){
    $http.get("/auth/google")
      .then(function(res){
        $scope.profile = res.data;
        console.log('Authentication successful!');
        
      }, function(res){
        console.log(res);
      }); 
  };

  // $scope.getPreset = function(){
  //   $http.get("api/get_preset")
  //     .then(function(res){
  //       $scope.preset = res.data;
  //       console.log('getting preset successful!');
        
  //     }, function(res){
  //       console.log(res);
  //     });
  // };

  $scope.savePreset = function(preset){
    $http.post("api/save_preset", preset)
      .then(function(res){
        //$scope.saveSuccess = "last preset saved successfully";
      console.log('saving preset successful!');
        $scope.getPreset();
        //do some stuff
      }, function(res){
        console.log("something went wrong");
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


  $scope.getPreset = function(){
     $http.get("api/get_preset")
        .then(function(res){
            $scope.userPresets = res.data;
        },function(res){
          console.log("ERRORORORO");
        });
    };

  $scope.getAll = function(){
    $http.get("api/get_all")
      .then(function(res){
        console.log(res);
        $scope.allPresets = res.data;
      },function(res){
        console.log(res);
      });
  };

}]);











