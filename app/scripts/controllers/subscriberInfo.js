/**************

Copyright 2014 Digital Stewardship Initiative Contributors (University of Toronto and Fort Effect Company Corporation)

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/

pirsApp.controller('SubscriberCtrl', ['$scope', '$location', '$window', 'StateDataManager', 'NavCollection', 'AMIRequest', 'identifiers', function ($scope, $location, $window, StateDataManager, NavCollection, AMIRequest, identifiers) {
  $window.scrollTo(0,0);
  $scope.nextIsLoading = false;
  
  $scope.previous = function(){
    $location.path('/company');
  }
  if(!AMIRequest.has('services')){
    $scope.previous();
    return;
  }
  $scope.services = AMIRequest.get('services');
  if(identifiers){
    if(AMIRequest.has('subject')){
      $scope.subject = AMIRequest.get('subject');
    }
    else{
      $scope.subject = {};
      $scope.subject.basic_personal_info = {};
      $scope.subject.service_identifiers = {};
      console.log("subject overwrite", $scope.subject);
      AMIRequest.set('subject', $scope.subject);
    }
    console.log($scope.subject);
    if(identifiers['basic_personal_info']){
      $scope.basic_identifiers = identifiers['basic_personal_info'];
    }
    $scope.service_identifiers = identifiers;
    delete $scope.service_identifiers['basic_personal_info'];
    for(i in $scope.service_identifiers){
      if(typeof $scope.subject.service_identifiers[i] == "undefined"){
        $scope.subject.service_identifiers[i] = {};
      }
    }
  }
    if(AMIRequest.has('operator')){
      $scope.company = AMIRequest.get('operator');
    }
    if(AMIRequest.has('subject')){
      $scope.customer = AMIRequest.get('subject');
    }else{
      $scope.customer = {address: {}};
    }

    $scope.$watch('subject', function(newVal, oldVal){
      console.log("subject", newVal);
      AMIRequest.set('subject', newVal);
    });
    

  $scope.next = function(){
    if($scope.requiredFieldsFilled()){
      $scope.nextIsLoading = true;
      $location.path('account');
    }
  }
  
  NavCollection.finishSelect('subject');
  NavCollection.unRestrict('request');
}]);