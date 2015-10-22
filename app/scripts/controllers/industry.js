/**************

Copyright 2014 Digital Stewardship Initiative Contributors (University of Toronto and Fort Effect Company Corporation)

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/

'use strict';
pirsApp.controller('IndustryCtrl', ['$scope', '$timeout', '$location', '$window', 'StateDataManager', 'NavCollection', 'industries', 'AMIRequest', 'dataProviderService', function ($scope, $timeout, $location, $window, StateDataManager, NavCollection, industries, AMIRequest, dataProviderService) {
    $scope.jurisdiction = AMIRequest.get('jurisdiction');
    $window.scrollTo(0,0)
    NavCollection.unRestrict('industry');
    $scope.previous = function(){
      $location.path('/');
    }
    $scope.nextIsLoading = false;
    // $scope.companies = companies;
    $scope.industries = industries;
    
    $scope.next = function(){
      if($scope.isIndustrySelected){
        $scope.nextIsLoading = true;
        $location.path('companyInfo');
      }
    }
    $scope.$watch('industry', function(oldIndustry, newIndustry){
      if($scope.industry && $scope.industry.id){
        AMIRequest.set('industry', $scope.industry);
        $scope.isIndustrySelected = true;
      }
    })
    $scope.$watch(function() {
      var jurisdiction;
      jurisdiction = AMIRequest.get('jurisdiction');
      if($scope.jurisdiction !== jurisdiction){
        $scope.jurisdiction = jurisdiction;
        dataProviderService.getItem("jurisdictions/" + jurisdiction.id + "/industries")
        .then(function(industries){
          $scope.industries = industries;
          $scope.industry = {};
          AMIRequest.set('industry', {});
        });
      }
    });
    NavCollection.finishSelect('industry');
  }]);