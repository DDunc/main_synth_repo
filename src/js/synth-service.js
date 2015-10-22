require("./synth-app.js");

(function () {
	"use strict";

	angular.module("synthy").service("SynthService", ["$http", function ($http) {

		var SynthCalls = {
				getAll: function(){
					$http.get("api/get_all")
						.then(function(res){
							$scope.presets = res.data; 
						},function(res){
							console.log(res);
						});
				}
		};

		return SynthCalls;
	}]);

}());
