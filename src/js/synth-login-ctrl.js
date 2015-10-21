require("./synth-app.js");

angular.module("synthy").controller('loginController', ['$scope', '$http', '$window', function($scope, $http, $window) {
  
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
