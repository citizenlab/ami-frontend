/**************

Copyright 2016 Open Effect

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/

'use strict';
AMIApp.controller('FinishCtrl', ['$scope', '$location', 'NavCollection', 'dataProviderService', 'AMIRequest', function ($scope, $location, NavCollection, dataProviderService, AMIRequest) {
  $scope.previous = function(){
    $location.path('/letter');
  }
  	$scope.rateLimited = false;
	$scope.statistics = true;
	$scope.subscribe = false;
	$scope.anon = AMIRequest.getAnon();
  $scope.submit = function(){
  	 $scope.serverIsLoading = true;
  	 dataProviderService.postItem("enroll/", {}, "http://0.0.0.0:3000/", {message: "hi"})
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