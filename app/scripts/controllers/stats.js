/**************

Copyright 2016 Open Effect

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/

'use strict';
AMIApp.controller('StatsCtrl', ['$scope', 'total', 'byDate', 'byCompany', 'operators', '$translate', 'dataProviderService', 'urls', '$window', function ($scope, total, byDate, byCompany, operators, $translate, dataProviderService, urls, $window) {
	var companyLabels = [];
	var companyData = [];
	var dateLabels = [];
	var dateData = [];

	$window.scrollTo(0,0);
	$scope.total = total;
	$scope.options = {
	      animation: false
	  }
	$scope.operators = operators;
	console.log(operators);
	_.each( byCompany, function( val, key ) {
	  if ( val ) {
	  	var operator_id = parseInt(val["operator_id"]);
	  	console.log(operator_id);
	  	var operator = _.findWhere(operators, {id: operator_id});
	  	var title = operator.title;
	  	
	    companyLabels.push(title);
	    companyData.push(val["count"]);
	  }
	});

	_.each( byDate, function( val, key ) {
	  if ( val ) {
	    dateLabels.push(val["request_date"]);
	    dateData.push(val["count"]);
	  }
	});

	$scope.byCompany = {
		labels: companyLabels, 
		data: [companyData]
	};
	$scope.byDate = {
		labels: dateLabels,
		data: [dateData]
	};
}]);