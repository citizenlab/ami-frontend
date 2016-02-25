/**************

Copyright 2016 Open Effect

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/

'use strict';

AMIApp.controller('FinishCtrl', ['$scope', '$location', 'NavCollection', 'dataProviderService', 'urls', 'AMIRequest', function ($scope, $location, NavCollection, dataProviderService, urls, AMIRequest) {
  var findEmail = function(subject){
    var email = null;
    var keys;
    for(var property in subject.basic_personal_info){
      console.log(subject.basic_personal_info[property]);
      if(subject.basic_personal_info[property]['title'].match(/email/i)){
        email = subject.basic_personal_info[property]['value'];
      }
      if(email){
        break;
      }
    }
    return email;
  }
  $scope.previous = function(){
    $location.path('/letter');
  }
  // $scope.token = token.csrf;
  $scope.email = {};
  $scope.rateLimited = false;
	$scope.statistics = true;
	$scope.subscribe = false;
	$scope.anon = AMIRequest.getAnon();
  $scope.servicelist = '';
  for(var i=0; i < $scope.anon.services.length; i++){
    var dividerChar = "";
    if(i == $scope.anon.services.length - 1){
      dividerChar = ""
    }
    else if(i == $scope.anon.services.length - 2){
      dividerChar = " and ";
    }
    else{
      dividerChar = ", ";
    }
    $scope.servicelist = $scope.servicelist + $scope.anon.services[i].title + dividerChar;
  }
  if($scope.anon.services.length > 1){
    $scope.servicelist += " services";
  }
  else{
  $scope.servicelist += " service";
  }
  if(AMIRequest.has('subject')){
    $scope.email.address = findEmail(AMIRequest.get('subject'));
  }

  console.log($scope.email);

  $scope.requiredFieldsFilled = function(){
    console.log($scope.email);
    if(!$scope.statistics){
      return false;
    }
    if($scope.subscribe && ($scope.email.address === "" || !$scope.email.address)){
      return false;
    }
    return true;
  }

  $scope.$watch('subscribe', function(newVal){
    if(newVal){
      if(AMIRequest.has('subject')){
        $scope.email.address = findEmail(AMIRequest.get('subject'));
      }
      else{
        $scope.email = {};
      }
    }
    else{
      $scope.email = {}
    }
  })

  $scope.submit = function(){
  	 $scope.serverIsLoading = true;
  	 dataProviderService.postItem(urls.enrollmentURL(), "/enroll/", {}, 
  	 	{
        data: $scope.anon,
        subscribe: $scope.subscribe,
        email: $scope.email
        // ,"_csrf": encodeURIComponent($scope.token)
      })
  	 .then(function(response){
  	 	$scope.serverIsLoading = false;
  	 	$scope.serverError = false;
  	 	$scope.serverDown = false;
  	 	$scope.response = response.title;
      $scope.responseStatuses = {};
      $scope.responseStatuses[response.title.statusCode] = true;
  	 	$scope.success = true;
  	 }, function(response){
  	 	$scope.serverIsLoading = false;
  	 	$scope.serverError = true;
  	 	if(response.status === -1){
  	 		$scope.serverDown = true;
  	 	}
  	 	else{
  	 		$scope.serverDown = false;
  	 	}
  	 	if(response.status === 429){
  	 		$scope.rateLimited = true;
  	 	}
  	 });
  }
}]);