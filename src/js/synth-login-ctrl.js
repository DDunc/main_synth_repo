require("./synth-app.js");

angular.module("synthy").controller('loginController', ['$scope', '$http', function($scope, $http) {
  
  $scope.signIn = function(){
    $http.get("api/auth/google")
      .then(function(res){
        //do some stuff
        console.log('Authentication successful!');
        
      }, function(res){
        console.log(res);
      }); 
  };

}]);
