require("./synth-app.js");

(function () {
	"use strict";

	angular.module("synthy").service("SynthService", ["$http", function ($http) {

		var SynthCalls = {
			get: function (id) {
				if (angular.isDefined(id)) {
					// return $githubGist(id).read();
					return $http.get(urlRoot + "/synth/" + id, {
//						headers: {'Authorization': 'token ' + token,}
					});
				} else {
					// return $http.get(urlRoot);
					console.warn('root url');
				}
			},
			update: function (model) {
				return $http.patch(urlRoot + "/synth/" + model.id, model, {
//					headers: {
//						'Authorization': 'token ' + 'value',
//					}
				});
			},
			create: function (model) {
				return $http.patch(urlRoot + "/synth/", model, {
					headers: {
						'Authorization': 'token ' + token,
					}
				});
			},
			delete: function (id) {
				return $http.delete(urlRoot + "/synth/" + id, {
//					headers: {
//						'Authorization': 'token ' + 'value',
//					}
				});
			}
		};
		return SynthCalls;
	}]);

}());
