'use strict';
var requestTemplate = angular.module('requestTemplate', []);
requestTemplate.directive('requestTemplate', function ($compile, dataProviderService, urls, $timeout, $location) {
    var linker = function (scope, element, attrs) {
        var jurisdiction = scope.jurisdiction.id;
        var industry = scope.industry.id;
        var pdfForm;
        var itemPath = "/jurisdictions/" + jurisdiction + "/industries/" + industry+ "/request_template";
        dataProviderService.getItem(urls.apiURL(), itemPath).then(function (response) {
            element.html(response[0].content);
            $compile(element.contents())(scope);

            scope.$watch('pdf.isGenerating', function(newVal, oldVal){
                if(newVal === true && oldVal === false){
                    makePDF(element);
                    scope.pdf.isGenerating = false;
                    scope.pdf.isGenerated = true;
                }
            });
            $timeout(function(){
                    scope.email.contents = buildEmail();
                    scope.email.isGenerating = false;
                    scope.email.isGenerated = true;
            }, 100);
        });

        var makePDF = function($element){
            var requestLetter = new Document("A4", [11.7647, 11.7647, 11.7647, 11.7647]);

            // convert HTML in #request element to canvas-based document
            requestLetter.writeHTMLtoDoc($element[0]);

            // convert series of canvases into PDF
            requestLetter.createPDF();
            requestLetter.savePDF();
        }

        var buildEmail = function(){
            var to, subject, body, email, el, clone, listItems;
            to = scope.operator.meta.privacy_officer_email;
            subject = scope.emailsubject;
            
            el = element[0];
            listItems = el.getElementsByTagName("ins")
            angular.forEach(listItems, function(value, key){
              listItems[key].innerHTML = "* " + listItems[key].innerHTML + "<br/>";
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
            pdf: '=',
            email: '=',
            emailsubject: '=',
            pdffilenameprefix: '='
        }
    };
});