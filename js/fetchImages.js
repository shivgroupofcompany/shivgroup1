angular.module("shivGroupWebsite", ['firebase']);
  // Initialize Firebase
var config = {
	apiKey: "AIzaSyDjJTLI4MU3uqfPbUTwAxm3414Dq40YhKE",
	authDomain: "shivgroup-4c3c6.firebaseapp.com",
	databaseURL: "https://shivgroup-4c3c6.firebaseio.com",
	projectId: "shivgroup-4c3c6",
	storageBucket: "shivgroup-4c3c6.appspot.com",
	messagingSenderId: "603686389840"
};
firebase.initializeApp(config);

angular
	.module("shivGroupWebsite")
	.controller("fetchController", fetchController);

fetchController.$inject = ['$scope', '$firebaseArray'];

function fetchController($scope, $firebaseArray) {
	$firebaseArray(firebase.database().ref("bt/"))
		.$loaded()
		.then(function(response) {
			$scope.btPath = response[0].url;
			// console.log('response: ', response);
		});
	$firebaseArray(firebase.database().ref("wt/"))
		.$loaded()
		.then(function(response) {
			$scope.wtPath = response[0].url;
			// console.log('response: ', response);
		});
	$firebaseArray(firebase.database().ref("ct/"))
		.$loaded()
		.then(function(response) {
			$scope.ctPath = response[0].url;
			// console.log('response: ', response);
		});
}