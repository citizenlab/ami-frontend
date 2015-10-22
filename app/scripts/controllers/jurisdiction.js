'use strict';
pirsApp.controller('JurisdictionCtrl', ['$scope', '$timeout', '$location', '$window', 'AMIRequest', 'dataProviderService', function ($scope, $timeout, $location, $window, AMIRequest, dataProviderService) {
    $scope.jurisdictions = {};
    AMIRequest.set('jurisdiction', dataProviderService.getItem("jurisdictions")
    .then(function(jurisdictions){
      $scope.jurisdictions = jurisdictions;
      $scope.jurisdiction = jurisdictions[0];
      return jurisdictions[0];
    }));
    $scope.$watch('jurisdiction', function(newJurisdiction, oldJurisdiction){
      AMIRequest.set('jurisdiction', newJurisdiction);
    });
}]);