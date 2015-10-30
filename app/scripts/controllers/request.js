'use strict';
pirsApp.controller('RequestCtrl', ['$scope', '$location', '$window', 'StateDataManager', 'NavCollection', 'AMIRequest', 'components', function ($scope, $location, $window, StateDataManager, NavCollection, AMIRequest, components) {
  $window.scrollTo(0,0);
  $scope.nextIsLoading = false;
  $scope.previous = function(){
    $location.path('/account');
  }
  if(!AMIRequest.has('subject') || !AMIRequest.has('operator') || !AMIRequest.has('services' || !(typeof _.findWhere(AMIRequest.get('services'), {selected: true}) !== "undefined")) || AMIRequest.has('')){
    $scope.previous();
    return;
  }
console.log(AMIRequest.get('subject'));
  $scope.components = components;
  $scope.jurisdiction = AMIRequest.get('jurisdiction');
  $scope.industry = AMIRequest.get('industry');
  $scope.operator = AMIRequest.get('operator');
  $scope.services = AMIRequest.get('services');
  $scope.subject = AMIRequest.get('subject');
  $scope.date = moment().format('MMMM Do, YYYY');

  $scope.servicelist = '';
  for(var i=0; i < $scope.services.length; i++){
  	var dividerChar = "";
  	if(i == $scope.services.length - 1){
  		dividerChar = ""
  	}
  	else if(i == $scope.services.length - 2){
  		dividerChar = " and ";
  	}
  	else{
  		dividerChar = ", ";
  	}
  	$scope.servicelist = $scope.servicelist + $scope.services[i].title + dividerChar;
  }
  if($scope.services.length > 1){
  	$scope.servicelist += " services";
  }
  else{
	$scope.servicelist += " service";
  }

  $scope.componentquestions = [];
  $scope.componentdata = [];

  for(var i=0; i < $scope.components.length; i++){
  	if($scope.components[i].meta.component_type == "Data"){
  		$scope.componentdata.push($scope.components[i].meta);
  	}
  	else if($scope.components[i].meta.component_type == "Question"){
  		$scope.componentquestions.push($scope.components[i].meta);
  	}
  }

  NavCollection.finishSelect('request');
}]);