'use strict';
var formItem = angular.module('formItem', []);
formItem.directive('formItem', function ($compile, dataProviderService) {
    var templates = {
      text: '<label for="{{id}}">{{label}}<input type="text" class="form-control" name="{{id}}" ng-model="val"/>',
      select: '<label for="{{id}}">{{label}}<select name="{{id}}" class="form-control" ng-model="val" ng-options="option as option.title for option in options track by option.value" ng-model="selected"></select>'
    }

    var linker = function (scope, element, attrs) {
        var id = scope.id;
        var fieldtype = scope.fieldtype;
        var template;
        if(typeof scope.model[scope.id] !== "undefined" && typeof scope.model[scope.id]['value'] !== "undefined"){
          scope.val = scope.model[scope.id]['value'];
        }
        else{
          scope.val = "";
        }
        console.log(arguments);
        switch(fieldtype){
          case "Text":
            template = templates['text'];
          break;
          case "Select":
            template = templates['select'];
          break;
          default:
            template = templates['text'];
          break;
        }
        element.html(template);
        scope.$watch('val', function(newVal, oldVal){
          // Accommodate select objects
          if(typeof newVal.title !== "undefined"){
            newVal = newVal.title;
          }
          // Handle empty fields
          if(typeof newVal !== "undefined" && newVal !== ""){
            scope.model[scope.id] = {title: scope.label, value: newVal, weight: scope.weight};
          }
          else{
            delete scope.model[scope.id];
          }
        });
        $compile(element.contents())(scope);
    };

    return {
        restrict: 'E',
        link: linker,
        scope: {
            id: '=',
            fieldtype: '=',
            label: '=',
            options: '=',
            weight: '=',
            model: '=ngModel'
        }
    };
});