angular
	.module("shivGroup")
	.controller("uploadController", uploadController);

uploadController.$inject = ['$scope', '$firebaseStorage', '$firebaseAuth', '$firebaseArray'];

function uploadController($scope, $firebaseStorage, $firebaseAuth, $firebaseArray) {
	$scope.init = init;
	$scope.uploadFile = uploadFile;
	$scope.removeImage = removeImage;
	$scope.changeView = changeView;
	const vm = this;
	vm.loggedIn = false;
	vm.googleSignIn = googleSignIn;
	vm.signOut = signOut;
	
	$scope.sectionNames = {
		"bi": "Birthday Images",
		"wi": "Wedding Images",
		"ci": "Corporate Images",
		"bt": "Birthday Thumbnail",
		"wt": "Wedding Thumbnail",
		"ct": "Corporate Thumbnail"
	};

	const thumbnailViews = ["bt", "wt", "ct"];

	function init() {
		firebase.auth().onAuthStateChanged(function(user) {
			if(user) {
				vm.loggedIn = true;
				$scope.loading = false;
				$scope.currentSection = "ct";
				updateRef($scope.currentSection);
				
				//TODO: figure the error scenario of the fetch
				$scope.errorFetchingImages = false;
			} else {
				vm.loggedIn = false;
			}
		});
	}

	function updateRef(sectionCode) {
		if(!vm[sectionCode]) {
			vm[sectionCode] = $firebaseArray(firebase.database().ref().child(sectionCode + '/'));
		}
		$scope.images = vm[sectionCode];
	}

	function removeImage(image) {
		firebase.storage().ref(image.ref).delete();
		$scope.images.$remove(image);
	}

	function uploadFile(file) {
		$scope.loading = true;
		// console.log($scope.file);
		const refString = $scope.currentSection + "/" + $scope.file.name;
		const storageRef = firebase.storage().ref(refString);
		let uploadTask = storageRef.put($scope.file);
		uploadTask.then(function(snapshot) {
			// console.log('snapshot: ', snapshot);
			uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
				if(isThumbnailView() && $scope.images.length > 0) {
					const image = $scope.images[0];
					$scope.images.$remove(image);
					firebase.storage().ref(image.ref).delete();
				}
				$scope.images.$add({'url' : downloadURL, 'ref': refString})
					.then(function(response) {
						// console.log('list db updated');
						$scope.loading = false;
					})
					.catch(function(error) {
						$scope.loading = false;
					});
			})
			.catch(function() {
				$scope.loading = false;
				$scope.$apply();
			});
		})
		.catch(function() {
			$scope.loading = false;
			$scope.$apply();
		});
	}

	function changeView(sectionCode) {
		$scope.currentSection = sectionCode;
		updateRef($scope.currentSection);
	}

	function isThumbnailView() {
		return thumbnailViews.indexOf($scope.currentSection) >= 0;
	}

	function googleSignIn() {
		firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(function(result) {
		}).catch(function(error) {
		});
	}

	function signOut() {
		firebase.auth().signOut().then(function() {
			vm.loggedIn = false;
			$scope.$apply();
		}, function(error) {
		});
	}
}