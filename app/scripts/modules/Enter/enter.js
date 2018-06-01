'use strict';
var ngEnter = function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
        if(event.which === 13) {
            scope.$apply(function (){
                scope.$eval(attrs.ngEnter);
            });
            event.preventDefault();
        }
    });
};
module.exports = ngEnter;