<<<<<<< HEAD
var angular = require('angular/angular');
=======
require('angular/angular');
>>>>>>> 12e8b22f66d0acac9a848720a44de1a6ef9cee44
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
		////////////////////////
			.otherwise({
			redirectTo: "/synth",
		});
	}]);
})();