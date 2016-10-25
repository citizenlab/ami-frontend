'use strict';
AMIApp.controller('FeedbackCtrl', ['$scope', '$uibModal', function ($scope, $uibModal){
	$scope.open = function (size) {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'views/feedbackModalContent.html',
			controller: 'FeedbackModalCtrl',
			size: 'large'
		});
	}
}]);

AMIApp.controller('FeedbackModalCtrl', ['$scope', '$uibModalInstance', 'dataProviderService', '$timeout', 'urls', function ($scope, $uibModalInstance, dataProviderService, $timeout, urls){
	$scope.formData = {
		ordinals: {},
		text: {}
	};
	$scope.requiredFieldsFilled = function(){
		angular.forEach($scope.formData.text, function(value, index){
			if(value === ""){
				delete $scope.formData.text[index];
			}
		});
		if(!Object.keys($scope.formData.ordinals).length && !Object.keys($scope.formData.text).length){
		 	return false;
		}
		return true;
	}

	$scope.processForm = function(){
		 console.log($scope.formData);
		 $scope.serverIsLoading = true;
	  	 dataProviderService.postItem(urls.enrollmentURL, "/feedback/", {}, 
	  	 	{
	        ordinals: $scope.formData.ordinals,
	        text: $scope.formData.text
	      })
	  	 .then(function(response){
	  	 	$scope.serverIsLoading = false;
	  	 	$scope.serverError = false;
	  	 	$scope.serverDown = false;
	  	 	$scope.response = response.title;
	     	$scope.responseStatuses = {};
	      	$scope.responseStatuses[response.message.statusCode] = true;
	  	 	$scope.success = true;

	  	 	//Close modal on success
	  	 	$timeout($scope.ok, 550);
	  	 }, function(response){
	  	 	$scope.serverIsLoading = false;
	  	 	$scope.serverError = true;
	  	 	if(response.status === -1){
	  	 		$scope.serverDown = true;
	  	 	}
	  	 	else{
	  	 		$scope.serverDown = false;
	  	 	}
	  	 	if(response.status === 429){
	  	 		$scope.rateLimited = true;
	  	 	}
	  	 });
	}

	$scope.ok = function () {
		$uibModalInstance.close();
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
}]);