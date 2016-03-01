'use strict';
var requestTemplate = angular.module('requestTemplate', []);
requestTemplate.directive('requestTemplate', function ($compile, dataProviderService, urls, $timeout, $location) {
    var linker = function (scope, element, attrs) {
        var jurisdiction = scope.jurisdiction.id;
        var industry = scope.industry.id;
        var pdfForm;
        var itemPath = "/jurisdictions/" + jurisdiction + "/industries/" + industry+ "/request_template";
        dataProviderService.getItem(urls.apiURL(), itemPath).then(function (response) {
            pdfForm = '<form method="post" style="display:none" action="' + urls.enrollmentURL() + '/pdf' + '" target="_blank"></form><div class="letter">';
            element.html(pdfForm + response[0].content) + "</div>";
            $compile(element.contents())(scope);
        });
        scope.$watch('pdf.isGenerating', function(newVal, oldVal){
            if(newVal === true && oldVal === false){
                // makePDF();
                makeServerPDF(element);
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

        var makeServerPDF = function($element){
            var form = angular.element($element).find('form')[0];
            var letter = angular.element($element).find('div')[0].innerHTML
            var input = document.createElement('input');
            var html = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></head><body>' + letter + '</body></html>';
            console.log(html);
            input.setAttribute('name', 'html');
            input.setAttribute('value', html);
            form.appendChild(input);
            form.submit();
            form.removeChild(input);
            // $element[0].submit();
            // dataProviderService.postItem(urls.enrollmentURL(), '/pdf', {}, {
            //     "html": "<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\"></head><body>該保留資料所屬的語言</body></html>"
            //     },
            //     "binary"
            // )
            // .then(function(response){
            //     var blob = new Blob([ response ], { type : 'application/pdf' });
            //     console.log(blob);
            //     var file = (window.URL || window.webkitURL).createObjectURL(response);
            //     // console.log(file);
            // });
        };

        var makePDF = function(){
            var doc = new jsPDF();
            var filename;

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
            filename = scope.pdffilenameprefix + '_' + scope.operator.title + ".pdf"
            doc.save(filename);
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