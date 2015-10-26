/**************

Copyright 2014 Digital Stewardship Initiative Contributors (University of Toronto and Fort Effect Company Corporation)

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/

'use strict';
pirsApp.controller('CompanyCtrl', ['$scope', '$timeout', '$location', '$window', 'StateDataManager', 'NavCollection', 'companies', 'AMIRequest', 'dataProviderService', function ($scope, $timeout, $location, $window, StateDataManager, NavCollection, companies, AMIRequest, dataProviderService) {
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
      if(newCompany !== oldCompany){
        AMIRequest.set('operator', newCompany);
        dataProviderService.getItem('operators/' + newCompany.id + '/services')
        .then(function(services){
          if(services.length){
            if(services.length > 1){
              $scope.services = services;
              for (var i =  services.length - 1; i >= 0; i--) {
                 services[i].selected = false;
              };
            }
            else{
              delete $scope.services;
              services[0].selected = true;
              AMIRequest.set('services', services);
              $scope.stageComplete();
            }
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
    // if(StateDataManager.has('company')){
    //   $scope.company = StateDataManager.get('company');
    // }
    // if(StateDataManager.has('services')){
    //   $scope.services = StateDataManager.get('services');
    // }
    // else{
    //   $scope.services = [];
    // }
    // $scope.prepServices = function(){
    //   $scope.services = [];
    //   angular.forEach($scope.company.getServices(), function(service, key){
    //     this.push({
    //       selected: false,
    //       serviceObj: service
    //     })
    //   }, $scope.services);
    //   StateDataManager.stash('services', $scope.services);
    // }
    $scope.$watch(function(){
      if($scope.services && $scope.services.length > 0){
        AMIRequest.set('services', $scope.services);
        if($scope.checkServiceSelection()){
          $scope.stageComplete();
        }
        else{
          $scope.IsServiceSelected = false;
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
      console.log(service, $scope.services);
      return (service.selected === true);
    }
    
    $scope.next = function(){
      if($scope.IsServiceSelected){
        $scope.nextIsLoading = true;
        $location.path('subject');
      }
    }

    // $scope.customer = {address:{}};
    // $scope.pii = $scope.services.getAddress();
    $scope.$watch('company', function(newCompany, oldCompany){
      AMIRequest.set('operator', $scope.company);
      // var customer;
      // if(typeof $scope.company !== "undefined"){
      //   console.log(newCompany);
      //   StateDataManager.stash('company', $scope.company);
      //   if(StateDataManager.get('company') !== oldCompany){
      //     $scope.prepServices();
      //     if(StateDataManager.has('customer')){
      //       customer = StateDataManager.get('customer');
      //       customer.accountNo = null;
      //       customer.phone = null;
      //       customer.email = null;
      //       StateDataManager.stash('customer', customer);
      //     }
      //     if(StateDataManager.has('servicesUnderOneAccount')){
      //       StateDataManager.pop('servicesUnderOneAccount')
      //     }
      //     if(StateDataManager.has('singleAccount')){
      //       StateDataManager.pop('singleAccount');
      //     }
      //     if(StateDataManager.has('alreadyDone')){
      //       StateDataManager.pop('alreadyDone');
      //     }
      //     if(StateDataManager.has('letterDoneState')){
      //       StateDataManager.pop('letterDoneState');
      //     }
      //   }
      // }
    });


    NavCollection.finishSelect('operator');
  }]);