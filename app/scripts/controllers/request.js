'use strict';
AMIApp.controller('RequestCtrl', ['$scope', '$location', '$window', '$timeout', 'NavCollection', 'AMIRequest', 'pdfOptionEnabled', '$translate', 'urls', function ($scope, $location, $window, $timeout, NavCollection, AMIRequest, pdfOptionEnabled, $translate, urls) {
  var blurListener;
  var ami_service_ids_en;
  $window.scrollTo(0,0);
  $scope.shareURL = encodeURIComponent($window.location.origin);
  $translate(['finish.share-text', 'finish.atipLink', 'finish.date-format'], {shareURL: $window.location.origin }).then(function (translation) {
    $scope.shareText = encodeURIComponent(translation["finish.share-text"]);
    $scope.atipLink = translation["finish.atipLink"];
    $scope.date = moment().format(translation["finish.date-format"]);
    AMIRequest.set('date', $scope.date);
  });
  var eng_moment = moment();
  eng_moment.locale('en');  
  $scope.date_en = eng_moment.format('MMMM Do, YYYY');
  $scope.nextIsLoading = false;

  $scope.lang = urls.languageCode;
  $scope.lang_en = "en";

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
  if(!AMIRequest.has('subject') || !AMIRequest.has('operator') || !AMIRequest.has('services' || !(typeof _.findWhere(AMIRequest.get('services'), {selected: true}) !== "undefined")) || AMIRequest.has('')){
    $scope.previous();
    return;
  }
  $scope.dropRequest = function(){
    AMIRequest.drop('industry');
  }

  $scope.pdfOptionEnabled = pdfOptionEnabled;
  $scope.components = AMIRequest.get('components');

  $scope.jurisdiction = AMIRequest.get('jurisdiction');
  $scope.industry = AMIRequest.get('industry');
  $scope.operator = AMIRequest.get('operator');
  $scope.services = AMIRequest.get('services');
  $scope.subject = AMIRequest.get('subject');

  $scope.industry_en = AMIRequest.getEnglish('industry', 'industries_en');
  $scope.operator_en = AMIRequest.getEnglish('operator', 'companies_en');
  $scope.subject_en = {};
  console.log($scope.components, AMIRequest.get('components_en'));
  //get all req components in English in proper structure
  $scope.componentdata_en = AMIRequest.getEnglish(null, 'components_en', _.filter($scope.components['data']['items'], function(i){
    return i.selected;
  }));
  $scope.componentquestions_en = AMIRequest.getEnglish(null, 'components_en', _.filter($scope.components['questions']['items'], function(i){
    return i.selected;
  }));
  $scope.componentbanks_en = AMIRequest.getEnglish(null, 'components_en', _.filter($scope.components['dataBanks']['items'], function(i){
    return i.selected;
  }));
  console.log(AMIRequest.get('subject_en'));
  $scope.subject_en.basic_personal_info = AMIRequest.getEnglish(null, AMIRequest.get('subject_en').basic_personal_info, $scope.subject.basic_personal_info);
  //get all serviec identifiers in English in proper structure
  $scope.subject_en.service_identifiers = {};

  ami_service_ids_en =  AMIRequest.get('subject_en').service_identifiers;
  
  _.each(ami_service_ids_en, function(service, service_id, list){
    $scope.subject_en.service_identifiers[service_id] = AMIRequest.getEnglish(null, service, $scope.subject.service_identifiers[service_id]);
  });

  console.log("english_req", $scope.industry_en);
  console.log("english_req", $scope.operator_en);
  console.log("english_req", $scope.componentdata_en);
  console.log("english_req", $scope.componentquestions_en);
  console.log("english_req", $scope.componentbanks_en);
  console.log("english_req", $scope.subject_en.basic_personal_info);
  console.log("english_req", $scope.subject_en.service_identifiers);


  console.log("subject", $scope.subject);
  
  
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

  $scope.displayInstructions = false;
  $scope.displayEmailExtras = false;

  $scope.componentdata = $scope.components['data']['items'];
  $scope.componentquestions = $scope.components['questions']['items'];
  $scope.componentbanks = $scope.components['dataBanks']['items'];
  console.log($scope.componentbanks);
  $scope.letterDoneState = false;

  $scope.pdf = {
    isGenerating: false,
    isGenerated: false
  };
  $scope.email = {
    isGenerating: false,
    isGenerated: false
  }
  blurListener = function(){
    $window.removeEventListener('blur', blurListener, false);
    $timeout.cancel(timer);
  }
  $scope.emailClick = function(){
      var timer2;
      var timer = $timeout(function(){
        $scope.showEmailExtras();
        $timeout.cancel(timer2);
        timer2 = $timeout(function(){
          $window.removeEventListener('blur', blurListener, false);
        },3000);
      }, 1500);
      $window.addEventListener('blur', blurListener, false);
    }
  $scope.generatePDF = function(){
    $scope.pdf.isGenerating = true;
  }
  $scope.$watch('pdf', function(newVal, oldVal){
    if(newVal.isGenerated === true){
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
}]);