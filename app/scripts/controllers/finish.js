/**************

Copyright 2016 Open Effect

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/

'use strict';

AMIApp.controller('FinishCtrl', ['$scope', '$location', 'NavCollection', 'dataProviderService', 'AMIRequest', function ($scope, $location, NavCollection, dataProviderService, AMIRequest) {
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
  $scope.email = {};
  $scope.rateLimited = false;
	$scope.statistics = true;
	$scope.subscribe = false;
	$scope.anon = AMIRequest.getAnon();
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

  $scope.submit = function(){
  	 $scope.serverIsLoading = true;
  	 dataProviderService.postItem("enroll/", {}, "http://0.0.0.0:3000/", 
  	 	{
        data: $scope.anon,
        subscribe: $scope.subscribe,
        email: $scope.email
      })
  	 .then(function(response){
  	 	$scope.serverIsLoading = false;
  	 	$scope.serverError = false;
  	 	$scope.serverDown = false;
  	 	$scope.response = response;
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

  NavCollection.finishSelect('finish');
}]);