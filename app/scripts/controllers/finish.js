/**************

Copyright 2016 Open Effect

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/

'use strict';

AMIApp.controller('FinishCtrl', ['$scope', '$location', 'NavCollection', 'dataProviderService', 'urls', 'AMIRequest', function ($scope, $location, NavCollection, dataProviderService, urls, AMIRequest) {
    $scope.$watch(function(){
     $scope.previousStage = NavCollection.previousItem();
    $scope.nextStage = NavCollection.nextItem();
  });
  $scope.previous = function(){
    $location.url($scope.previousStage.id);
  }
  $scope.next = function(){
    $location.url($scope.nextStage.id);
  }

  $scope.url = window.location.origin;
  $scope.serverResponse = AMIRequest.serverResponse;
  
  $scope.$watch('AMIRequest.serverResponse', function(){
    $scope.serverResponse = AMIRequest.serverResponse;
  });
}]);