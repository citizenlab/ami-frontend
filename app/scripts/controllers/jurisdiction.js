'use strict';
AMIApp.controller('LanguageCtrl', ['$scope', '$timeout', '$location', '$window', '$translate', 'AMIRequest', '$cookies', function ($scope, $timeout, $location, $window, $translate, AMIRequest, $cookies) {

	$scope.languages = {
		"en": {
			"title": "English",
			"languageCode": "en"
		},
		"zh": {
			"title": "中文",
			"languageCode": "zh"
		}
	};

    $scope.lang = $scope.languages[$translate.use()];
    
    $scope.selectLanguage = function(lang){
      $translate.use(lang.languageCode);
      $cookies.put('languageCode', lang.languageCode);
      AMIRequest.drop('operator');
    }
    $scope.$watch(function() {
      $scope.showControls = (AMIRequest.hierarchy.indexOf($location.path().substring(1)) <= 1);
      $scope.lang = $scope.languages[$translate.use()];
    });
    
}]);
AMIApp.controller('LangStyle', ['$scope', '$translate', function ($scope, $translate) {

    $scope.lang = $translate.use();
    
    $scope.$watch(function() {
      $scope.lang = $translate.use();
    });
    
}]);