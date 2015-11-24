'use strict';
AMIApp.controller('JurisdictionCtrl', ['$scope', '$timeout', '$location', '$window', 'AMIRequest', 'dataProviderService', 'urls', 'jurisdictionID', function ($scope, $timeout, $location, $window, AMIRequest, dataProviderService, urls, jurisdictionID) {
    AMIRequest.set('jurisdiction', dataProviderService.getItem(urls.apiURL, "/jurisdictions/" + jurisdictionID)
    .then(function(jurisdiction){
      $scope.jurisdiction = jurisdiction;
      AMIRequest.set('jurisdiction', jurisdiction);
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