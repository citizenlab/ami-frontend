'use strict';
AMIApp.controller('JurisdictionCtrl', ['$scope', '$timeout', '$location', '$window', 'AMIRequest', 'dataProviderService', function ($scope, $timeout, $location, $window, AMIRequest, dataProviderService) {
    $scope.jurisdictions = {};
    AMIRequest.set('jurisdiction', dataProviderService.getItem("jurisdictions")
    .then(function(jurisdictions){
      $scope.jurisdictions = jurisdictions;
      $scope.jurisdiction = jurisdictions[0];
      AMIRequest.set('jurisdiction', jurisdictions[0]);
      return jurisdictions[0];
    }));
    $scope.selectJurisdiction = function(jurisdiction){
      AMIRequest.set('jurisdiction', jurisdiction);
    }
    $scope.$watch(function() {
      var jurisdiction;
      jurisdiction = AMIRequest.get('jurisdiction');
      $scope.jurisdiction = jurisdiction;
    });
}]);