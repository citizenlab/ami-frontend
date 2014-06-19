/**************

Copyright 2014 Digital Stewardship Initiative Contributors (University of Toronto and Fort Effect Company Corporation)

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/

'use strict';
pirsApp.controller('MainCtrl', ['$scope', 'StateDataManager', 'NavCollection', '$location', function ($scope, StateDataManager, NavCollection, $location) {
    $scope.nextIsLoading = false;
    if(StateDataManager.has('faqShow')){
      $scope.show = StateDataManager.get('faqShow');
    }
    else {
      $scope.show = false;
    }
    $scope.showToggle = function(){
      if($scope.show){
        $scope.show = false;
      }
      else{
        $scope.show = true;
      }
      StateDataManager.stash('faqShow', $scope.show);
    }
    $scope.next = function(){
      $scope.nextIsLoading = true;
      $location.path('companyInfo');
    }
    NavCollection.finishSelect('home');
}]);