'use strict';
AMIApp.controller('JurisdictionCtrl', ['$scope', '$timeout', '$location', '$window', 'AMIRequest', 'dataProviderService', 'urls', 'jurisdictionID', function ($scope, $timeout, $location, $window, AMIRequest, dataProviderService, urls, jurisdictionID) {
    $scope.jurisdiction = AMIRequest.get('jurisdiction');
    $scope.selectJurisdiction = function(jurisdiction){
      AMIRequest.set('jurisdiction', jurisdiction);
    }
    $scope.$watch(function() {
      var jurisdiction;
      jurisdiction = AMIRequest.get('jurisdiction');
      $scope.jurisdiction = jurisdiction;
    });
}]);