/**************

Copyright 2016 Open Effect

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/

'use strict';
AMIApp.controller('MainCtrl', ['$scope', 'AMIRequest', 'NavCollection', '$location', 'cmsStatus', function ($scope, AMIRequest, NavCollection, $location) {

    $scope.nextIsLoading = false;
    $scope.jurisdiction = AMIRequest.get('jurisdiction');
    $scope.component = {};

    $scope.show = false;

    $scope.showToggle = function(){
      if($scope.show){
        $scope.show = false;
      }
      else{
        $scope.show = true;
      }
    }
    console.log(Object.keys(NavCollection));

    $scope.$watch(function() {
      $scope.nextStage = NavCollection.nextItem();
      var jurisdiction;
      jurisdiction = AMIRequest.get('jurisdiction');
      $scope.jurisdiction = jurisdiction;
    });
}]);