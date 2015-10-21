require('angular/angular');
var route = require('angular-route');

(function() {
	'use strict';

	var app = angular.module('synthy', ['ngRoute']).

	config(["$routeProvider", function ($routeProvider) {
		$routeProvider

		////route home//////////
			.when("/synth", {
			templateUrl: "html/keyboard.html",
			controller: "SynthCtrl",
		})

			.when("/login", {
				templateUrl: "html/login.html",
				controller: "loginController"
			})
		////////////////////////
			.otherwise({
			redirectTo: "/synth",
		});
	}]);
})();