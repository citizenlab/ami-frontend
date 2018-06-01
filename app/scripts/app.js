/**************

Copyright 2016 Open Effect

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/
const config = __CONFIG__;
import angular from "angular";
import ngRoute from "angular-route";
import ngEnter from "./modules/Enter/enter";
import ngCookies from "angular-cookies";
import ngMessages from "angular-messages";
import ngSanitize from "angular-sanitize";
import ngclipboard from "angular-clipboard";
import ngTranslate from "angular-translate";
import "angular-translate-loader-static-files";
window.Page = require("./modules/canvasDoc/canvasdoc").Page;
window.Document = require("./modules/canvasDoc/canvasdoc").Document;

window.SVGInjector = require("svg-injector");
import angularChart from "angular-chart.js";
import dataProviderService from "./modules/dataProviderService/dataproviderservice";
import ProgressBarNav from "./modules/ProgressBarNav/progressbarnav";
import FormItem from "./modules/formItem/formitem";
import AMIRequest from "./modules/AMIRequest/amirequest";
import requestTemplate from "./modules/requestTemplate/requesttemplate";
import LanguageCtrl from "./controllers/language";
import LangStyleCtrl from "./controllers/langstyle";
import IndustryCtrl from "./controllers/industry";
import CompanyCtrl from "./controllers/company";
import QuestionsCtrl from "./controllers/questions";
import SubscriberCtrl from "./controllers/subscriberInfo";
import RequestCtrl from "./controllers/request";
import StatsCtrl from "./controllers/stats";
import HeaderCtrl from "./controllers/header";

// Wire up custom libraries into the angular 
angular.module('ngEnter', []).directive('ngEnter', ngEnter);
angular.module('dataProviderService', []).factory('dataProviderService', dataProviderService);
angular.module('ProgressBarNav', []).service('NavCollection', ProgressBarNav.navCollection).controller('ProgressCtrl', ProgressBarNav.controller);
angular.module('requestTemplate', []).directive('requestTemplate', requestTemplate);
angular.module('AMIRequest', []).service("AMIRequest", AMIRequest);
angular.module('formItem', []).directive('formItem', FormItem);

'use strict';
console.log(config);
var AMIApp = angular.module('AMIApp', [
    'ngRoute',
    'ngEnter',
    'ngCookies',
    'ngMessages',
    'ngSanitize',
    'dataProviderService',
    'ProgressBarNav',
    'formItem',
    'requestTemplate',
    'AMIRequest',
    'pascalprecht.translate',
    'angular-clipboard',
    'chart.js'
  ])
  .config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
  }])
  .constant("envOptions", config)
  .controller("LangStyle", LangStyleCtrl)
  .controller("LanguageCtrl", LanguageCtrl)
  .controller("IndustryCtrl", IndustryCtrl)
  .controller("CompanyCtrl", CompanyCtrl)
  .controller("QuestionsCtrl", QuestionsCtrl)
  .controller("SubscriberCtrl", SubscriberCtrl)
  .controller("RequestCtrl", RequestCtrl)
  .controller("StatsCtrl", StatsCtrl)
  .controller("HeaderCtrl", HeaderCtrl)
  .service('cmsStatus', ['$location', 'NavCollection', function($location, NavCollection){
    var online = false;
    var firstRun = true;
    var path;
    var redirect = false;
    this.isOnline = function(status){
      if(typeof status === "undefined"){
        return online;
      }
      if(!firstRun && !online && status){
        redirect = true;
      }
      else{
        redirect = false;
      }
      if(status === true){
        online = true;
        NavCollection.unRestrict('start');
      }
      else{
        online = false;
        NavCollection.restrict('start');
        $location.path('/offline');
      }
      if(redirect){
        if(NavCollection.selectedNavItem){
          path = NavCollection.selectedNavItem.id;
          console.log(NavCollection.selectedNavItem);
          console.log(path);
        }
        else{
          path = "/";
        }
        $location.path(path);
      }
      firstRun = false;
    }
  }])
  .service('urls', ['envOptions', '$translate', function(envOptions, $translate){
    var self = this
    this.languageCode = envOptions.languageCode;
    this.setLanguageCode = function(languageCode){
      this.languageCode = languageCode;
    }
    this.apiURL = function(lang){
      var url;
      if(typeof lang == "undefined"){
        lang = self.languageCode;
      }
      url = envOptions.apiDomain + envOptions.apiRoot + "/" + lang + envOptions.apiPath;
      console.log(url);
      return url;
    }
    this.apiPagesURL = function(lang){
      var url;
      if(typeof lang == "undefined"){
        lang = self.languageCode;
      }
      url = envOptions.apiDomain + envOptions.apiRoot + "/" + lang + "/wp-json/pages";
      console.log(url);
      return url;
    }
    this.enrollmentURL = function(){
      return envOptions.enrollmentDomain + envOptions.enrollmentApiPath;
    }
    return this;
  }])
  .config(['$compileProvider', function($compileProvider){
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https|mailto|whatsapp|http):/);
    $compileProvider.debugInfoEnabled(false);
  }])
  .config(['$cookiesProvider', function($cookiesProvider){
    $cookiesProvider.defaults.secure = true;
  }])
  .config(['$translateProvider', function($translateProvider) {
    $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
    $translateProvider.useStaticFilesLoader({
      prefix: 'translations/locale-',
      suffix: '.json'
    });
  }])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
      .when('/', {
        templateUrl: 'views/industry.html',
        controller: 'IndustryCtrl',
        resolve: {
          industries: ["dataProviderService", "urls", "AMIRequest", "envOptions", function(dataProviderService, urls, AMIRequest, envOptions) {
            var params = {"per_page": 100}
            return dataProviderService.getItem(urls.apiURL(), "/jurisdictions/" + envOptions.jurisdictionID + "/industries", params);
          }],
          industries_en: ["dataProviderService", "urls", "AMIRequest", "envOptions", function(dataProviderService, urls, AMIRequest, envOptions) {
            var params = {"per_page": 100}
            return dataProviderService.getItem(urls.apiURL('en'), "/jurisdictions/" + envOptions.jurisdictionID + "/industries", params);
          }]
          // ,
          // links: ["dataProviderService", "urls", "AMIRequest", "envOptions", function(dataProviderService, urls, AMIRequest, envOptions) {
          //   return dataProviderService.getItem(urls.apiURL(), "/jurisdictions/" + envOptions.jurisdictionID + "/links");
          // }]
        }
      })
      .when('/operator', {
        templateUrl: 'views/company.html',
        controller: 'CompanyCtrl',
        resolve: {
          companies: ["dataProviderService", "urls", "AMIRequest", function(dataProviderService, urls, AMIRequest) {
            var industry = AMIRequest.get('industry');
            var jurisdiction = AMIRequest.get('jurisdiction');
            var params = {"per_page": 100}
            return dataProviderService.getItem(urls.apiURL(), "/jurisdictions/" + jurisdiction.id + "/industries/" + industry.id + "/operators", params);
          }],
          companies_en: ["dataProviderService", "urls", "AMIRequest", function(dataProviderService, urls, AMIRequest) {
            var industry = AMIRequest.get('industry');
            var jurisdiction = AMIRequest.get('jurisdiction');
            var params = {"per_page": 100}
            return dataProviderService.getItem(urls.apiURL('en'), "/jurisdictions/" + jurisdiction.id + "/industries/" + industry.id + "/operators", params);
          }]
        },
      })
      .when('/subject', {
        templateUrl: 'views/subscriber.html',
        controller: 'SubscriberCtrl',
        resolve: {
          identifiers: ["dataProviderService", "urls", "AMIRequest", function(dataProviderService, urls, AMIRequest){
            var opts = getIdentifierOpts(AMIRequest)
            return dataProviderService.getItem(urls.apiURL(), opts.path, opts.params);
          }],
          identifiers_en: ["dataProviderService", "urls", "AMIRequest", function(dataProviderService, urls, AMIRequest){
            var opts = getIdentifierOpts(AMIRequest)
            return dataProviderService.getItem(urls.apiURL('en'), opts.path, opts.params);
          }],
        },
      })
      .when('/stats', {
        templateUrl: 'views/stats.html',
        controller: 'StatsCtrl',
        resolve: {
          operators: ["dataProviderService", "urls", "AMIRequest", "envOptions", function(dataProviderService, urls, AMIRequest, envOptions) {
            var jurisdiction = parseInt(envOptions.jurisdictionID);
            var params = {"per_page": 100}
            return dataProviderService.getItem(urls.apiURL(), "/jurisdictions/" + jurisdiction + "/operators", params);
          }],
          total: ["dataProviderService", "urls", "$location", "envOptions", function(dataProviderService, urls, $location, envOptions) {
            var jurisdiction = parseInt(envOptions.jurisdictionID);
            return dataProviderService.getItem(urls.enrollmentURL(), "/stats/getTotal/" + jurisdiction, {}, {}, false);
          }],
          byCompany: ["dataProviderService", "urls", "$location", "envOptions", function(dataProviderService, urls, $location, envOptions) {
            var jurisdiction = parseInt(envOptions.jurisdictionID);
            return dataProviderService.getItem(urls.enrollmentURL(), "/stats/getByCompany/" + jurisdiction, {}, {}, false);
          }],
          byDate: ["dataProviderService", "urls", "$location", "envOptions", function(dataProviderService, urls, $location, envOptions) {
            var jurisdiction = parseInt(envOptions.jurisdictionID);
            return dataProviderService.getItem(urls.enrollmentURL(), "/stats/getByDate/" + jurisdiction, {}, {}, false);
          }]
        },
      })
      .when('/account', {
        templateUrl: 'views/accountInfo.html',
        controller: 'AccountCtrl'
      })
      .when('/press-kit', {
        templateUrl: 'views/remoteContent.html',
        controller: 'ContentCtrl',
        resolve: {
          pageContent: ["dataProviderService", "urls", "AMIRequest", function(dataProviderService, urls, AMIRequest) {
            var industry = AMIRequest.get('industry');
            var jurisdiction = AMIRequest.get('jurisdiction');
            return dataProviderService.getItem(urls.apiPagesURL, "/2");
          }]
        },
      })
      .when('/faq', {
        templateUrl: 'views/remoteContent.html',
        controller: 'ContentCtrl',
        resolve: {
          pageContent: ["dataProviderService", "urls", "AMIRequest", function(dataProviderService, urls, AMIRequest) {
            var industry = AMIRequest.get('industry');
            var jurisdiction = AMIRequest.get('jurisdiction');
            return dataProviderService.getItem(urls.apiPagesURL, "/171");
          }]
        },
      })
      .when('/about', {
        templateUrl: 'views/remoteContent.html',
        controller: 'ContentCtrl',
        resolve: {
          pageContent: ["dataProviderService", "urls", "AMIRequest", function(dataProviderService, urls, AMIRequest) {
            var industry = AMIRequest.get('industry');
            var jurisdiction = AMIRequest.get('jurisdiction');
            return dataProviderService.getItem(urls.apiPagesURL, "/168");
          }]
        },
      })
      .when('/contact', {
        templateUrl: 'views/remoteContent.html',
        controller: 'ContentCtrl',
        resolve: {
          pageContent: ["dataProviderService", "urls", "AMIRequest", function(dataProviderService, urls, AMIRequest) {
            var industry = AMIRequest.get('industry');
            var jurisdiction = AMIRequest.get('jurisdiction');
            return dataProviderService.getItem(urls.apiPagesURL, "/165");
          }]
        },
      })
      .when('/know-your-rights', {
        templateUrl: 'views/remoteContent.html',
        controller: 'ContentCtrl',
        resolve: {
          pageContent: ["dataProviderService", "urls", "AMIRequest", function(dataProviderService, urls, AMIRequest) {
            return dataProviderService.getItem(urls.apiPagesURL, "/203");
          }]
        },
      })
      .when('/why-is-access-important', {
        templateUrl: 'views/remoteContent.html',
        controller: 'ContentCtrl',
        resolve: {
          pageContent: ["dataProviderService", "urls", "AMIRequest", function(dataProviderService, urls, AMIRequest) {
            return dataProviderService.getItem(urls.apiPagesURL, "/319");
          }]
        },
      })
      .when('/i-requested-what-now', {
        templateUrl: 'views/remoteContent.html',
        controller: 'ContentCtrl',
        resolve: {
          pageContent: ["dataProviderService", "urls", "AMIRequest", function(dataProviderService, urls, AMIRequest) {
            return dataProviderService.getItem(urls.apiPagesURL, "/316");
          }]
        },
      })
      .when('/what-can-i-get', {
        templateUrl: 'views/remoteContent.html',
        controller: 'ContentCtrl',
        resolve: {
          pageContent: ["dataProviderService", "urls", "AMIRequest", function(dataProviderService, urls, AMIRequest) {
            return dataProviderService.getItem(urls.apiPagesURL, "/314");
          }]
        },
      })
      .when('/request', {
        templateUrl: 'views/request.html',
        controller: 'RequestCtrl',
        resolve: {
          papersize: ["envOptions", function(envOptions){
            console.log("paper", envOptions.paperSize);
            return envOptions.paperSize;
          }]
        }
      })
      .when('/components', {
        templateUrl: 'views/questions.html',
        controller: 'QuestionsCtrl',
        resolve: {
          components: ["dataProviderService", "urls", "AMIRequest", function(dataProviderService, urls, AMIRequest) {
            var opts = buildComponentRequest(dataProviderService, urls, AMIRequest);
            return dataProviderService.getItem(urls.apiURL(), opts.path, opts.args);
          }],
          components_en: ["dataProviderService", "urls", "AMIRequest", function(dataProviderService, urls, AMIRequest) {
            var opts = buildComponentRequest(dataProviderService, urls, AMIRequest);
            return dataProviderService.getItem(urls.apiURL('en'), opts.path, opts.args);
          }]
        } 
      })
      .when('/finish', {
        templateUrl: 'views/finish.html',
        controller: 'FinishCtrl'
        // ,resolve: {
        //   token: ["dataProviderService", function(dataProviderService) {
        //     return dataProviderService.getItem("enroll/", {}, "http://0.0.0.0:3000/", null, false);
        //   }]
        // },
      })
      .when('/verify', {
        templateUrl: 'views/verify.html',
        controller: 'VerificationCtrl',
        resolve: {
          verificationStatus: ["dataProviderService", "urls", "$location", function(dataProviderService, urls, $location) {
            var token = $location.search().token;
            console.log(token);
            return dataProviderService.getItem(urls.enrollmentURL(), "/verify/", {"token": token}, null, false);
          }]
        }
      })
      .when('/unsubscribe', {
        templateUrl: 'views/unsubscribe.html',
        controller: 'UnsubscribeCtrl',
        resolve: {
          unsubscribeStatus: ["dataProviderService", "urls", "$location", function(dataProviderService, urls, $location) {
            return dataProviderService.postItem(urls.enrollmentURL(), "/unsubscribe/", {}, {"email_address": $location.search().email_address}, false);
          }]
        }
      })
      .when('/offline', {
        templateUrl: 'views/offline.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);

AMIApp.filter('object2Array', function() {
  return function(input) {
    return _.toArray(input);
  }
});

AMIApp.directive('focusMe', ['$timeout', '$parse', function($timeout, $parse) {
  return {
    //scope: true,   // optionally create a child scope
    link: function(scope, element, attrs) {
      var model = $parse(attrs.focusMe);
      scope.$watch(model, function(value) {
        console.log('value=',value);
        if(value === true) {
          $timeout(function() {
            element[0].focus();
            element[0].setSelectionRange(0, element[0].value.length)
          });
        }
      });
    }
  };
}]);
AMIApp.factory('nagSvgHelper', [
  '$timeout',
  function($timeout) {
    var svgHelper = {
      /**
       * Passes in a DOM element to use to inject SVG.
       *
       * @todo: add example
       *
       * @method getAsyncTemplate
       *
       * @param {DOMElement|[DOMElement]} elements Remote path to the template file
       */
      inject: function(elements) {
        if(window.IconicJS) {
            window.IconicJS().inject(elements);
        } else if(window.SVGInjector ) {
            window.SVGInjector(elements);
        }
      }
    }

    return svgHelper;
  }
]);
AMIApp.directive('nagSvg', ['$compile',
  'nagSvgHelper',
  function($compile, nagSvgHelper) {
    return {
      link: function(scope, element, attrs) {
        scope.$watch('svgpath', function(value){
            if(scope.svgpath){
              element[0].setAttribute('data-src', scope.svgpath);
            }
            window.SVGInjector(element[0]);
        });
      },
      scope: {
        svgpath: '@'
      }
    }
  }
]);
AMIApp.run(['$http', 'NavCollection', '$timeout', '$location', '$translate', 'envOptions', '$cookies', 'AMIRequest', 'urls', function($http, NavCollection, $timeout, $location, $translate, envOptions, $cookies, AMIRequest, urls){
  // Redirect to landing page if on a dependant stage path
  if(AMIRequest.hierarchy.indexOf($location.path().substring(1)) > -1){
    $location.path('/');
  }
  var langCookie = $cookies.get('languageCode');
  var localeParam = $location.search().locale;
  var languageCode;
  var supportedLanguages = envOptions.supportedLanguages
  // Sanitize langCookie
  if(langCookie){
    langCookie = langCookie.replace(/\W/g, '');
  }

    console.log("cookie", langCookie);
    console.log(supportedLanguages.indexOf(navigator.language.substr(0,2)));
  if(langCookie){  
    languageCode = langCookie;
  }
  else if(localeParam && supportedLanguages.indexOf(localeParam.substr(0,2)) >= 0){
    languageCode = localeParam.substr(0,2);
  }
  else if(navigator.language && supportedLanguages.indexOf(navigator.language.substr(0,2)) >= 0){
    languageCode = navigator.language.substr(0,2);
  }
  else{
    languageCode = envOptions.languageCode;
  }
  $translate.use(languageCode);
  urls.setLanguageCode(languageCode);
  moment.locale(languageCode);

  if(supportedLanguages.indexOf("fr") > -1){
    moment.updateLocale('fr-ca', {
      ordinal : function (number) {
        return number + (number === 1 ? 'er' : '');
      }
    });
  }
  console.log(languageCode);

      var stages = [
        {
          name: "Start",
          path: "#/",
          id: "start",
          icon: "fa fa-home",
          restricted: false,
          className: "",
          target: "_self"
        },
        {
          name: "Operator",
          path: "#/operator",
          id: "operator",
          icon: "fa fa-briefcase",
          restricted: true,
          className: "",
          target: "_self"
        },
        {
          name: "Questions",
          path: "#/components",
          id: "components",
          icon: "fa fa-question-circle",
          restricted: true,
          className: "",
          target: "_self"
        },
        {
          name: "Subject",
          path: "#/subject",
          id: "subject",
          icon: "fa fa-user",
          restricted: true,
          className: "",
          target: "_self"
        },
        {
          name: "Request",
          path: "#/request",
          id: "request",
          icon: "fa fa-file-text",
          restricted: true,
          className: "",
          target: "_self"
        }
      ];
      angular.forEach(stages, function(item){
        NavCollection.addNavItem(item.id, item.path, item.name, item.icon, item.restricted, item.className, item.target);
      });
}]);
AMIApp.run(['$templateCache', '$http', function($templateCache, $http) {
  $http.get('views/messages.html')
  .then(function(response) {
    $templateCache.put('status-messages', response.data);
  });
}]);
AMIApp.run(['urls', 'envOptions', 'AMIRequest', 'cmsStatus', 'dataProviderService', '$interval', '$timeout', function(urls, envOptions, AMIRequest, cmsStatus, dataProviderService, $interval, $timeout) {
   dataProviderService.getItem(urls.apiURL(), "/jurisdictions/" + envOptions.jurisdictionID)
    .then(function(jurisdiction){
      AMIRequest.set('jurisdiction', jurisdiction);
      AMIRequest.markAsComplete('jurisdiction');
    }).
    catch(function(err){
      console.log(err);
    })
  $interval(function(){
    if(!cmsStatus.isOnline()){
      var randomInt = Math.floor(Math.random() * (100000000 - 0)) + 0;
      dataProviderService.request(urls.apiURL(), "/jurisdictions/" + envOptions.jurisdictionID, {"flag": randomInt}, 'GET', null, false)
        .then( function(data, status, headers, config) {
          cmsStatus.isOnline(true);
        })
        .catch( function(data, status, headers, config) {
          cmsStatus.isOnline(false);
        });
    }
  }, 60000);
  $timeout(function(){
    var screen = document.getElementById("loadingScreen");
      screen.className += ' faded-out';
      $timeout(function(){
        screen.style.display = "none";
        screen.className.replace('faded-out', '');
      }, 200);
    }, 170);
}]);

var getIdentifierOpts = function(AMIRequest){
  var opts = {};
  var operator = AMIRequest.get('operator');
  if(operator.meta.data_management_unit == "data-banks"){
    opts.path = "/data_banks/identifiers/"
    var banks = AMIRequest.get('components')['dataBanks'].items;
    console.log("bank", banks);
    var bank_ids = [];
    angular.forEach(banks, function(bank, key){
      if(bank && bank.selected && bank.serverID){
        console.log("bank", bank.serverID);
        bank_ids.push(bank.serverID);
      }
    }, bank_ids);
    opts.params = {"banks[]": bank_ids};
  }
  else{
    opts.path = "/services/identifiers/";
    var services = AMIRequest.get('services');
    var service_ids = [];
    angular.forEach(services, function(service, key){
      if(service.selected){
        service_ids.push(service.id);
      }
    }, service_ids);
    opts.params = {"services[]": service_ids}
  }
  return opts;
}

var buildComponentRequest = function(dataProviderService, urls, AMIRequest, lang){
  var operator = AMIRequest.get('operator');
  console.log("OG", operator);
  if(operator.meta.data_management_unit == "data-banks"){   
    return {
      path:  "/operators/" + operator.id + "/data_banks/",
      args: {}
    }
  }
  else{
    var services = AMIRequest.get('services');
    var service_ids = [];
     angular.forEach(services, function(value, key){
        if(value.selected){
          service_ids.push(value.id);
        }
      }, service_ids);
    return {
      path:  "/components/",
      args: {"services[]": service_ids}
    }
  }
}
