'use strict';
var requestTemplate = angular.module('requestTemplate', []);
requestTemplate.directive('requestTemplate', function ($compile, dataProviderService, urls, $timeout, $location, $q) {
    var linker = function (scope, element, attrs) {
        console.log("change");
        var jurisdiction = scope.jurisdiction.id;
        var industry = scope.industry.id;
        var lang = scope.lang;
        var pdfForm;
        var itemPath = "/jurisdictions/" + jurisdiction + "/industries/" + industry+ "/request_template";
        dataProviderService.getItem(urls.apiURL(lang), itemPath).then(function (response) {
              element.html(response[0].content);
              $compile(element.contents())(scope);
        scope.$watch('lang', function (v) {
          console.log('lang', v)
          var itemPath = "/jurisdictions/" + jurisdiction + "/industries/" + industry+ "/request_template";
          dataProviderService.getItem(urls.apiURL(v), itemPath).then(function (response) {
              element.html(response[0].content);
              $compile(element.contents())(scope);
              $timeout(function(){
                scope.email.contents = buildEmail();
                scope.email.isGenerating = false;
                scope.email.isGenerated = true;
              }, 100);
        });
        scope.$watch('pdf.isGenerating', function(newVal, oldVal){
            if(newVal === true && oldVal === false){
              makePDF(element);
            }
        });
        $timeout(function(){
                scope.email.contents = buildEmail();
                scope.email.isGenerating = false;
                scope.email.isGenerated = true;
        }, 100);
        });
        });

        var makePDF = function($element){
            var requestLetter = new Document("letter", [11.7647, 11.7647, 11.7647, 11.7647]);

            // convert HTML in #request element to canvas-based document
            requestLetter.writeHTMLtoDoc($element[0]);

            // convert series of canvases into PDF
            requestLetter.createPDF();
            requestLetter.savePDF();
            scope.pdf.isGenerating = false;
            scope.pdf.isGenerated = true;
        }

        var buildEmail = function(){
                    scope.makePDF = makePDF
            var to, subject, body, email, el, clone, listItems;
            to = scope.operator.meta.privacy_officer_email;
            subject = scope.emailsubject;
            
            el = element[0];
            listItems = el.getElementsByTagName("li")
            var listIndex = 0;
            angular.forEach(listItems, function(value, key){
              var listSymbol = "* ";
              var newList = true;
              if(key > 0 && listItems[key-1].parentNode !== listItems[key].parentNode){
                var newList = false;
              }
              if(varNewList){
                  listIndex = 0;
              }
              if(listItems[key].parentNode.tagName == "OL"){
                if(listItems[key].parentNode.getAttribute("type") == "A"){
                    listSymbol = String.fromCharCode(97 + key).toUpperCase()+". ";
                }
                else{
                    listSymbol = key+1+". ";
                }
              }
              listItems[key].innerHTML = listSymbol + listItems[key].innerHTML + "<br/>";
            });
            
            body = getInnerText(el).replace(/^\s+|\s+$/g, '').replace(/\n,'\r\n'/);
            
            angular.forEach(listItems, function(value, key){
              listItems[key].innerHTML = listItems[key].innerHTML.substring(2);
              // $(this).find('br').remove();
            });
            console.log("body", body, el);
            email = "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
            return email;
          }

          var getInnerText = function(el) {
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
    };

    return {
        restrict: 'E',
        link: linker,
        scope: {
            component: '=',
            operator: '=',
            subject: '=',
            jurisdiction: '=',
            industry: '=',
            services: '=',
            servicelist: '=',
            date: '=',
            componentquestions: '=',
            componentdata: '=',
            componentbanks: '=',
            pdf: '=',
            email: '=',
            emailsubject: '=',
            pdffilenameprefix: '=',
            lang: '='
        }
    };
});