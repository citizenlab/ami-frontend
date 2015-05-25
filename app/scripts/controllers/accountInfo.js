/**************

Copyright 2014 Digital Stewardship Initiative Contributors (University of Toronto and Fort Effect Company Corporation)

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/

'use strict';
pirsApp.controller('AccountCtrl', ['$scope', '$location', '$window', 'StateDataManager', 'NavCollection', function ($scope, $location, $window, StateDataManager, NavCollection) {
  $window.scrollTo(0,0);
  $scope.nextIsLoading = false;
  $scope.previous = function(){
    $location.path('/subscriberInfo');
  }
  if(StateDataManager.has('servicesUnderOneAccount')){
    $scope.servicesUnderOneAccount = StateDataManager.get('servicesUnderOneAccount');
  }else{
    $scope.servicesUnderOneAccount = true;
  }
  if(StateDataManager.has('singleAccount')){
    $scope.singleAccount = StateDataManager.get('singleAccount');
  }
  else{
    $scope.singleAccount = {};
  }

  if(!StateDataManager.has('customer') || !StateDataManager.get('company') || !StateDataManager.has('services') || !((typeof _.findWhere(StateDataManager.get('services'), {selected: true})) !== "undefined")){
    $scope.previous();
    return;
  }
  else{
    $scope.services = StateDataManager.get('services');
    $scope.selectedServices = 0;
    angular.forEach($scope.services, function(value, key){
      if(value.selected){
        $scope.selectedServices++;
      }
    }, $scope.selectedServices);
    if($scope.selectedServices == 1){
      $scope.oneService = true;
    }
    $scope.company = StateDataManager.get('company');
    angular.forEach($scope.services, function(service, key){
      if(typeof service.account == "undefined"){
        service.account = {};
      }
      service.getFirstEmail = function(){
        return $scope.services[0].account.email;
      }
      service.getFirstPhone = function(){
        return $scope.services[0].account.phone;
      }
      service.getFirstAccountNumber = function(){
        return $scope.services[0].account.number;
      }
      service.setFirstEmail = function(){
        service.account.email = service.getFirstEmail();
      }
      service.setFirstPhone = function(){
        service.account.phone = service.getFirstPhone();
      }
      service.setFirstAccountNumber = function(){
        service.account.number = service.getFirstAccountNumber();
        console.log(service.account.number);
      }
      $scope.services[key] = service;
    }, $scope.services);
  }
  $scope.requiredFieldsFilled = function(){
    var isFilled = "pristine";
    if($scope.servicesUnderOneAccount){
      console.log($scope.singleAccount);
      if($scope.singleAccount && $scope.singleAccount.number){
        NavCollection.unRestrict('letter');
        return true;
      }
      else{
        NavCollection.restrict('letter');
        return false;
      }
    }
    angular.forEach($scope.services, function(service, key){
      if(!(service.account.number) && service.selected){
        isFilled = false;
      }
      else{
        if(isFilled === "pristine"){
          isFilled = true;
        }
      }
    }, isFilled);
    if(isFilled){
      NavCollection.unRestrict('letter');
    }
    else{
      NavCollection.restrict('letter');
    }
    return isFilled;
  }
  $scope.showService = function(service){
      return (service.selected === true);
    }
  $scope.next = function(){
    if($scope.requiredFieldsFilled()){
      $scope.nextIsLoading = true;
      $location.path('letter');
    }
  }
  $scope.$watch('services', function(){
    StateDataManager.stash('services', $scope.services);
  })
  $scope.$watch('servicesUnderOneAccount', function(){
    StateDataManager.stash('servicesUnderOneAccount', $scope.servicesUnderOneAccount);
    StateDataManager.stash('singleAccount', $scope.singleAccount);
  })

  NavCollection.finishSelect('accountInfo');
}]);