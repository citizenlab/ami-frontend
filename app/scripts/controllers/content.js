/**************

Copyright 2016 Open Effect

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/

'use strict';
AMIApp.controller('ContentCtrl', ['$scope', 'pageContent', '$translate', 'dataProviderService', 'urls', '$window', function ($scope, pageContent, $translate, dataProviderService, urls, $window) {
	$window.scrollTo(0,0);
	$scope.title = pageContent.title;
	$scope.body = pageContent.content;
	$scope.lang = $translate.use();
	$scope.$watch(function() {
      var newLang = $translate.use();
      if(newLang !== $scope.lang){
      	$scope.lang = newLang;
	      dataProviderService.getItem(urls.apiPagesURL, "/"+pageContent.ID)
	      .then(function(data){
	      	$scope.title = data.title;
	      	$scope.body = data.content;
	      });
  		}
    });
}]);