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
            var timer = $timeout(function(){
                makePDF();
            }, 1000);
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
            componentdata: '='
        }
    };
});