/**************

Copyright 2014 Digital Stewardship Initiative Contributors (University of Toronto and Fort Effect Company Corporation)

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/

pirsApp.controller('SubscriberCtrl', ['$scope', '$location', '$window', 'StateDataManager', 'NavCollection', function ($scope, $location, $window, StateDataManager, NavCollection) {
  $window.scrollTo(0,0);
  $scope.nextIsLoading = false;
  $scope.previous = function(){
    $location.path('/companyInfo');
  }
  if(!StateDataManager.has('piiTypes')){
    $scope.previous();
    return;
  }
  else{
    if(StateDataManager.has('company')){
      $scope.company = StateDataManager.get('company');
    }
    if(StateDataManager.has('customer')){
      $scope.customer = StateDataManager.get('customer');
    }else{
      $scope.customer = {address: {}};
    }
    // $scope.customer.firstName = "Tester";
    // $scope.customer.lastName = "Testerson";
    // $scope.customer.address.address1 = "47 Test Avenue";
    // $scope.customer.address.address2 = "#123";
    // $scope.customer.address.city = "Testfield";
    // $scope.customer.address.province = "ON";
    // $scope.customer.address.postalcode = "T3S7E4";

    $scope.provinces = [
        {
          "name":"Alberta",
          "code":"AB"
        },
        {
          "name":"British Columbia",
          "code":"BC"
        },
        {
          "name":"Manitoba", 
          "code":"MB"
        },
        {
          "name":"New Brunswick",
          "code":"NB"
        },
        {
          "name":"Newfoundland",
          "code":"NL"
        },
        {
          "name":"Northwest Territories",
          "code":"NT"
        },
        {
          "name":"Nova Scotia",
          "code":"NS"
        },
        {
          "name":"Nunavut",
          "code":"NU"
        },
        {
          "name":"Ontario",
          "code":"ON"
        },
        {
          "name":"Prince Edward Island",
          "code":"PE"
        },
        {
          "name":"Quebec",
          "code":"QC"
        },
        {
          "name":"Saskatchewan",
          "code":"SK"
        },
        {
          "name":"Yukon Territory",
          "code":"YT"
        }
    ]
  }
  $scope.requiredFieldsFilled = function(){
    console.log("province", $scope.customer.address.province)
    var filled = (
    ($scope.customer.firstName)
    && ($scope.customer.lastName)
    && ($scope.customer.address.address1)
    && ($scope.customer.address.city)
    && ($scope.customer.address.province)
    && ($scope.customer.address.province !== "")
    && ($scope.customer.address.postalcode)
    );
    if(filled){
      $scope.customer.isComplete = true;
      NavCollection.unRestrict('accountInfo');
    }
    else{
      $scope.customer.isComplete = false;
      NavCollection.restrict('accountInfo');
    }
    return filled;
  }
  $scope.next = function(){
    if($scope.requiredFieldsFilled()){
      $scope.nextIsLoading = true;
      $location.path('accountInfo');
    }
  }
  $scope.$watch('customer', function(){
    StateDataManager.stash('customer', $scope.customer);
  })
  $scope.showNotice = function(){
    StateDataManager.stash('noticeValue', true);
  }
  if(StateDataManager.has('alreadyDone')){
    $scope.showNotice();
  }
  NavCollection.finishSelect('subscriberInfo');
}]);