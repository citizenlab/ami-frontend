'use strict';
var ngJSPDF = angular.module('ngJSPDF', []);
ngJSPDF.service("PdfLetter", function(){
  var generator = {};
  generator.generate = function(e, callback){
    var callback = callback;
    console.log(e);
     
    var pdf = new jsPDF('p', 'pt', 'letter')
    , div = document.createElement('div')
    , filtered = e
    , source
    , margins = {
      top: 80,
      bottom: 60,
      left: 40,
      width: 522
    },
    specialElementHandlers = {
               '#bypassme': function(element, renderer) {
                   return true;
               }
           };
    div.innerHTML = filtered.html();
    console.log(filtered.html());
    source = div;
    pdf.fromHTML(
      source // HTML string or DOM elem ref.
      , margins.left // x coord
      , margins.top // y coord
      , {
        'width': margins.width // max width of content on PDF
        // , 'height': margins.height
         ,'elementHandlers': specialElementHandlers
      },
      function (dispose) {
        // dispose: object with X, Y of the last line add to the PDF
        //          this allow the insertion of new lines after html

          pdf.save('Right_to_information_request.pdf');
          callback();
        },
      margins
    )
  }
  return generator;
});