'use strict';
class StatsCtrl {
constructor($scope, total, byDate, byCompany, operators, $translate, dataProviderService, urls, $window){
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
	  	try{
		  	var title = operator.title;
		    companyLabels.push(title);
		    companyData.push(val["count"]);
		}
		catch(e){
			console.log("ignoring custom company from stats");
		}
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
}
};
module.exports = ['$scope', 'total', 'byDate', 'byCompany', 'operators', '$translate', 'dataProviderService', 'urls', '$window', StatsCtrl];