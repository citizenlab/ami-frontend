'use strict';
AMIApp.controller('RequestCtrl', ['$scope', '$location', '$window', '$timeout', 'NavCollection', 'AMIRequest', 'components', function ($scope, $location, $window, $timeout, NavCollection, AMIRequest, components) {
  $window.scrollTo(0,0);
  $scope.nextIsLoading = false;
  $scope.previous = function(){
    $location.path('/account');
  }
  if(!AMIRequest.has('subject') || !AMIRequest.has('operator') || !AMIRequest.has('services' || !(typeof _.findWhere(AMIRequest.get('services'), {selected: true}) !== "undefined")) || AMIRequest.has('')){
    $scope.previous();
    return;
  }

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
  $scope.displayInstructions = false;
  $scope.displayEmailExtras = false;

  for(var i=0; i < $scope.components.length; i++){
  	if($scope.components[i].meta.component_type == "Data"){
  		$scope.componentdata.push($scope.components[i].meta);
  	}
  	else if($scope.components[i].meta.component_type == "Question"){
  		$scope.componentquestions.push($scope.components[i].meta);
  	}
  }

  $scope.pdf = {
    isGenerating: false,
    isGenerated: false
  };
  $scope.email = {
    isGenerating: false,
    isGenerated: false
  }
  $scope.emailClick = function(){
      var timer2;
      var timer = $timeout(function(){
        $scope.showEmailExtras();
        $timeout.cancel(timer2);
        timer2 = $timeout(function(){
          $($window).unbind('blur');
        },3000);
      }, 1500);
      $($window).blur(function() {
        $($window).unbind('blur');
        $timeout.cancel(timer);
        $scope.setLetterDoneState();
      });
    }
  $scope.generatePDF = function(){
    $scope.pdf.isGenerating = true;
  }
  $scope.$watch('pdf.isGenerated', function(newVal, oldVal){
    if(newVal === true && (oldVal === false || typeof oldVal == "undefined")){
      $scope.letterDoneState = true;
    }
  });
  $scope.instructionsDisplayToggle = function(){
    if($scope.displayInstructions){
      $scope.displayInstructions = false;
    }
    else{
      $scope.displayInstructions = true;
    }
  }
  $scope.showEmailExtras = function(){
    $scope.displayEmailExtras = true;
  }
  $timeout(function(){
    $scope.email.isGenerating = true;
  }, 100);
  NavCollection.finishSelect('request');
}]);