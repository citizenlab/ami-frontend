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

AMIApp.controller('FeedbackModalCtrl', ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance){
	$scope.ok = function () {
		$uibModalInstance.close();
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
}]);