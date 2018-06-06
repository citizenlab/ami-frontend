/**************

Copyright 2016 Open Effect

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/

'use strict';
class IndustryCtrl {
  constructor($scope, $timeout, $location, $window, NavCollection, industries, industries_en, AMIRequest, dataProviderService, urls, $translate, envOptions) {
    $scope.jurisdiction = AMIRequest.get('jurisdiction');
    AMIRequest.set('industries_en', industries_en);
    $window.scrollTo(0,0)
    $scope.previous = function(){
      $location.path('/');
    }
    $scope.nextIsLoading = false;
    // $scope.companies = companies;
    $scope.industries = industries;
    
    if(AMIRequest.has('industry')){
      $scope.industry = AMIRequest.get('industry');
      $scope.isIndustrySelected = true;
    }

    $scope.selectIndustry = function(industry){
      $scope.industry = industry;
      $scope.isIndustrySelected = true;
      $location.path(NavCollection.nextItem().id);
    }

    $scope.$watch('industry', function(oldIndustry, newIndustry){
      if(newIndustry === null){
        AMIRequest.drop('industry');
      }
      if($scope.industry && $scope.industry.id){
        AMIRequest.set('industry', $scope.industry);
        $scope.isIndustrySelected = true;
        //NavCollection.unRestrict('operator');
      }
      else{
        AMIRequest.drop('industry');
        $scope.isIndustrySelected = false;
        //NavCollection.restrict('operator');
      }
    });
    $scope.lang = $translate.use();

    $scope.$watch(function(){
      $scope.nextStage = NavCollection.nextItem();
      var newLang = $translate.use();
	  console.log("!!", newLang, $scope.lang);
      if(newLang !== $scope.lang){
      	$scope.lang = newLang;
        var params = {"per_page": 100}
        dataProviderService.getItem(urls.apiURL(), "/jurisdictions/" + envOptions.jurisdictionID + "/industries")
	      .then(function(industries){
	      	$scope.industries = industries;
	      });
  		}
    });
  }
}
module.exports = ['$scope', '$timeout', '$location', '$window', 'NavCollection', 'industries', 'industries_en', 'AMIRequest', 'dataProviderService', 'urls', '$translate', 'envOptions', IndustryCtrl];