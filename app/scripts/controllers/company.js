/**************

Copyright 2016 Open Effect

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/

'use strict';
AMIApp.controller('CompanyCtrl', ['$scope', '$timeout', '$location', '$window', 'NavCollection', 'companies', 'AMIRequest', 'dataProviderService', 'urls', function ($scope, $timeout, $location, $window, NavCollection, companies, AMIRequest, dataProviderService, urls) {
    $window.scrollTo(0,0)
    NavCollection.unRestrict('operator');
    $scope.previous = function(){
      $location.path('/industry');
    }
    $scope.nextIsLoading = false;
    
    if(!AMIRequest.has('industry')){
      $scope.previous();
      return;
    }

    $scope.industry = AMIRequest.get('industry');
    // $scope.companies = companies;
    $scope.companies = companies;

    if(AMIRequest.has('operator')){
      $scope.company = AMIRequest.get('operator');
    }

   
    $scope.$watch('company', function(newCompany, oldCompany){
      if(newCompany === null){
        console.log("drop");
        AMIRequest.drop('operator');
        $scope.services = null;
      }
      else if(newCompany !== oldCompany){
        AMIRequest.set('operator', newCompany);
        dataProviderService.getItem(urls.apiURL, '/operators/' + newCompany.id + '/services')
        .then(function(services){
          if(services.length){
            if(services.length > 1){
              for (var i =  services.length - 1; i >= 0; i--) {
                 services[i].selected = false;
              };
            }
            else{
              services[0].selected = true;
              AMIRequest.set('services', services);
            }
            $scope.services = services;
            $scope.stageComplete();
          }
          else{
            alert("Sorry, no services for this operator.");
          }
        });
      }
      else{
        if(AMIRequest.has('services')){
          if(AMIRequest.get('services').length > 1){
            $scope.services = AMIRequest.get('services');
          }
          else{
            $scope.stageComplete();
          }
        }
      }
    });

$scope.stageComplete = function(){
  $scope.IsServiceSelected = true;
  NavCollection.unRestrict('subject');
}

    $scope.$watch(function(){
      if($scope.services && $scope.services.length > 0){
        AMIRequest.set('services', $scope.services);
        if($scope.checkServiceSelection()){
          $scope.stageComplete();
        }
        else{
          $scope.IsServiceSelected = false;
          NavCollection.restrict('subject');
        }
      }
    });

    $scope.checkServiceSelection = function(){
      for (var i = $scope.services.length - 1; i >= 0; i--) {
        if($scope.services[i].selected){
          return true;
        }
      }
    }

    $scope.showService = function(service){
      return (service.selected === true);
    }
    
    $scope.next = function(){
      if($scope.IsServiceSelected){
        $scope.nextIsLoading = true;
        $location.path('subject');
      }
    }

    $scope.$watch('company', function(newCompany, oldCompany){
      AMIRequest.set('operator', $scope.company);
    });


    NavCollection.finishSelect('operator');
  }]);