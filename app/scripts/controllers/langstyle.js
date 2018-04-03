class LangStyleCtrl {
	constructor($scope, $translate) {

		$scope.lang = $translate.use();
		
		$scope.$watch(function() {
		$scope.lang = $translate.use();
		});
		
	}
}
module.exports = LangStyleCtrl;