'use strict';

class LanguageCtrl {
  constructor($scope, $timeout, $location, $window, $translate, AMIRequest, $cookies, urls, envOptions) {

    $scope.languages = envOptions.supportedLanguages;

    $scope.lang = $scope.languages[$translate.use()];
    
    $scope.selectLanguage = function(lang){
      $translate.use(lang.languageCode);
      urls.setLanguageCode(lang.languageCode);
      moment.lang(lang.languageCodeMoment);
      $cookies.put('languageCode', lang.languageCode);
      AMIRequest.drop('operator');
    }
    $scope.$watch(function() {
      $scope.showControls = (AMIRequest.hierarchy.indexOf($location.path().substring(1)) <= 1);
      $scope.lang = $scope.languages[$translate.use()];
    });
  }   
}

module.exports = LanguageCtrl;