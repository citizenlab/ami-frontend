'use strict';
var requestTemplate = angular.module('requestTemplate', []);
requestTemplate.directive('requestTemplate', function ($compile, dataProviderService) {
    var linker = function (scope, element, attrs) {
        var jurisdiction = scope.jurisdiction.id;
        var industry = scope.industry.id;
        var itemPath = "jurisdictions/" + jurisdiction + "/industries/" + industry+ "/request_template";
        dataProviderService.getItem(itemPath).then(function (response) {
            element.html(response[0].meta.request_body);
            $compile(element.contents())(scope);
        });
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