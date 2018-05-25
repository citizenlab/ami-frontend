'use strict';

class HeaderCtrl {
  	constructor($scope, $translate) {
		$translate.onReady().then(function(){
			$scope.$watch(function(){
				$scope.lang = $translate.use();
			});
		});
	}
}

module.exports = ["$scope", "$translate", HeaderCtrl];