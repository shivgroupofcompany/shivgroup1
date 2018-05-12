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
	$scope.init = init;

	function init(page) {
		if(page === 'home') {
			loadHomePageImages();
		} else if(page === 'birthday') {
			$firebaseArray(firebase.database().ref().child('bi/'))
				.$loaded()
				.then(function(response) {
					$scope.images = response;
					console.log('$scope.images: ', $scope.images);
				});
		} else if(page === 'wedding') {
			$firebaseArray(firebase.database().ref().child('wi/'))
				.$loaded()
				.then(function(response) {
					$scope.images = response;
				});	
		} else if(page === 'corporate') {
			$firebaseArray(firebase.database().ref().child('ci/'))
				.$loaded()
				.then(function(response) {
					$scope.images = response;
				});
		}
	}

	function loadHomePageImages() {
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
}