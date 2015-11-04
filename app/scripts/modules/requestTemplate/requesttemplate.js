'use strict';
var requestTemplate = angular.module('requestTemplate', []);
requestTemplate.directive('requestTemplate', function ($compile, dataProviderService, $timeout) {
    var linker = function (scope, element, attrs) {
        var jurisdiction = scope.jurisdiction.id;
        var industry = scope.industry.id;
        var itemPath = "jurisdictions/" + jurisdiction + "/industries/" + industry+ "/request_template";
        dataProviderService.getItem(itemPath).then(function (response) {
            element.html(response[0].content);
            $compile(element.contents())(scope);
        });
        scope.$watch('pdf.isGenerating', function(newVal, oldVal){
            if(newVal === true && oldVal === false){
                makePDF();
                scope.pdf.isGenerating = false;
                scope.pdf.isGenerated = true;
            }
        });
        scope.$watch('email.isGenerating', function(newVal, oldVal){
            if(newVal === true && oldVal === false){
                scope.email.contents = buildEmail();
                scope.email.isGenerating = false;
                scope.email.isGenerated = true;
            }
        });

        var makePDF = function(){
            var doc = new jsPDF();

            // We'll make our own renderer to skip this editor
            var specialElementHandlers = {
                '#editor': function(element, renderer){
                    return true;
                }
            };

            // All units are in the set measurement for the document
            // This can be changed to "pt" (points), "mm" (Default), "cm", "in"
            console.log(element[0].innerHTML);
            doc.fromHTML(element[0].innerHTML, 15, 15, {
                'width': 170, 
                'elementHandlers': specialElementHandlers
            });

            doc.save('Right_to_information_request.pdf');
        }

        var buildEmail = function(){
            var to, subject, body, email, el, clone;
            to = scope.operator.meta.privacy_officer_email;
            subject = "Formal Request for Personal Information Held By Your Company"
            
            el = $(element[0]);
                      
            el.find('li').each(function(){
              var html;
              html = this.innerHTML
              this.innerHTML = "* " + html + "<br/>";
            });
            
            body = getInnerText(el.get(0)).replace(/^\s+|\s+$/g, '').replace(/\n,'\r\n'/);
            
            el.find('li').each(function(){
              var html;
              html = this.innerHTML
              this.innerHTML = html.substring(2);
              // $(this).find('br').remove();
            });

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
            email: '='
        }
    };
});