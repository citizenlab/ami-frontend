/**************

Copyright 2014 Digital Stewardship Initiative Contributors (University of Toronto and Fort Effect Company Corporation)

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/

pirsApp.controller('LetterCtrl', ['$scope', '$location', '$timeout', '$window','StateDataManager', 'PdfLetter', 'NavCollection', function ($scope, $location, $timeout, $window, StateDataManager, PdfLetter, NavCollection) {
  var noticeTimer;

  $window.scrollTo(0,0)
  $scope.previous = function(){
    $location.path('/accountInfo');
  }
  
  if((!StateDataManager.has('piiTypes')) || ((!StateDataManager.has('customer')) && !StateDataManager.get('customer').isComplete)){
    $scope.previous();
    return;
  }
  NavCollection.unRestrict('finish');
  $scope.letter = {
    isGenerating: false,
    isGenerated: false
  };
  $scope.customer = StateDataManager.get('customer');
  $scope.company = StateDataManager.get('company');
  $scope.services = StateDataManager.get('services');
  $scope.piiTypes = StateDataManager.get('piiTypes');

  if(StateDataManager.has('letterDoneState')){
    $scope.letterDoneState = StateDataManager.get('letterDoneState');
  }
  
  $scope.servicesUnderOneAccount = StateDataManager.get('servicesUnderOneAccount');
  if($scope.servicesUnderOneAccount){
    $scope.singleAccount =  StateDataManager.get('singleAccount');
  }

  $scope.date = moment().format('MMMM Do, YYYY');
  $scope.displayInstructions = false;
  $scope.displayEmailExtras = false;

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
  
  $scope.showEmailExtras = function(){
    $scope.displayEmailExtras = true;
  }

  $scope.setLetterDoneState = function(){
    $timeout(function(){
      $scope.letterDoneState = true;
      StateDataManager.stash('letterDoneState', $scope.letterDoneState);
    }, 10);
  }
  $scope.instructionsDisplayToggle = function(){
    if($scope.displayInstructions){
      $scope.displayInstructions = false;
    }
    else{
      $scope.displayInstructions = true;
    }
  }
  $scope.save = function(){
    PdfLetter.generate($('#letter'), function(){
      $timeout(function(){
        $scope.letter.isGenerating = false;
        $scope.letter.isGenerated = true;
        $scope.setLetterDoneState();
      }, 50);
    });
    $scope.letter.isGenerating = true;
    $scope.letter.isGenerated = false;
  };

  $scope.showService = function(service){
    return (service.selected === "selected");
  }

  $scope.buildEmail = function(){
    var to, subject, body, email, el;
    to = $scope.company.email;
    subject = "Formal Request for Personal Information Held By Your Company"
    el = $("#richLetter");
    el.find('.piiItem').each(function(){
      var html;
      html = this.innerHTML
      this.innerHTML = "* " + html + "<br/>";
    });
    body = getInnerText(el.get(0)).replace(/^\s+|\s+$/g, '').replace(/\n,'\r\n'/);
    el.find('.piiItem').each(function(){
      var html;
      html = this.innerHTML
      this.innerHTML = html.substring(2);
      $(this).find('br').remove();
    });
    email = "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    return email;
  }

  $timeout(function(){
    $scope.email = $scope.buildEmail();
  }, 10);
  NavCollection.finishSelect('letter');
}]);

function getInnerText(el) {
  var sel, range, innerText = "";
  if (typeof document.selection != "undefined" && typeof document.body.createTextRange != "undefined") {
      range = document.body.createTextRange();
      range.moveToElementText(el);
      innerText = range.text;
  } else if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
      sel = window.getSelection();
      sel.selectAllChildren(el);
      innerText = "" + sel;
      sel.removeAllRanges();
  }
  return innerText;
}