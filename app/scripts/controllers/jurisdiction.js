'use strict';
AMIApp.controller('LanguageCtrl', ['$scope', '$timeout', '$location', '$window', '$translate', function ($scope, $timeout, $location, $window, $translate) {

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

    $scope.lang = $scope.languages[$translate.proposedLanguage()];
    
    $scope.selectLanguage = function(lang){
      $translate.use(lang.languageCode)
    }
    $scope.$watch(function() {
      $scope.lang = $scope.languages[$translate.proposedLanguage()];
    });
    
}]);