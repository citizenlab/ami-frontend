/**************

Copyright 2016 Open Effect

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/

class ContentCtrl {
	constructor($scope, pageContent, $translate, dataProviderService, urls, $window, NavCollection){
		$window.scrollTo(0,0);
		$scope.title = pageContent.title;
		$scope.body = pageContent.content;
		$scope.selectedNavItem = NavCollection.selectedNavItem;
		$scope.lang = $translate.use();
		$scope.$watch(function() {
		var newLang = $translate.use();
		console.log("!!", newLang, $scope.lang);
		if(newLang !== $scope.lang){
			$scope.lang = newLang;
			dataProviderService.getItem(urls.apiPagesURL, "/"+pageContent.ID)
			.then(function(data){
				$scope.title = data.title;
				$scope.body = data.content;
			});
			}
		});
	}
}
module.exports = ['$scope', 'pageContent', '$translate', 'dataProviderService', 'urls', '$window', 'NavCollection', ContentCtrl];