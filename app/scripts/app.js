/**************

Copyright 2016 Open Effect

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/

'use strict';

var AMIApp = angular.module('AMIApp', [
    'config',
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
    'sticky',
    'ui.bootstrap',
    'pascalprecht.translate',
    'ngclipboard'
  ])
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
    this.apiURL = function(){
      var url;
      var languageCode = envOptions.languageCode;
      console.log($translate.use());
      if(typeof $translate.use() !== "undefined"){
        languageCode = $translate.use();
      }
      url = envOptions.apiDomain + envOptions.apiRoot + "/" + languageCode + envOptions.apiPath;
      console.log(url);
      return url;
    }
    this.apiPagesURL = function(){
      var url;
      var languageCode = envOptions.languageCode;
      console.log($translate.use());
      if(typeof $translate.use() !== "undefined"){
        languageCode = $translate.use();
      }
      url = envOptions.apiDomain + envOptions.apiRoot + "/" + languageCode + "/wp-json/pages";
      console.log(url);
      return url;
    }
    this.enrollmentURL = function(){
      return envOptions.enrollmentDomain + envOptions.enrollmentApiPath;
    }
    return this;
  }])
  .config(['$compileProvider', function($compileProvider){
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https|mailto|whatsapp):/);
  }])
  .config(['$translateProvider', function($translateProvider) {
    $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
    $translateProvider.useStaticFilesLoader({
      prefix: 'translations/locale-',
      suffix: '.json'
    });
  }])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/industry.html',
        controller: 'IndustryCtrl',
        resolve: {
          industries: ["dataProviderService", "urls", "AMIRequest", "envOptions", function(dataProviderService, urls, AMIRequest, envOptions) {
            return dataProviderService.getItem(urls.apiURL(), "/jurisdictions/" + envOptions.jurisdictionID + "/industries");
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
            return dataProviderService.getItem(urls.apiURL(), "/jurisdictions/" + jurisdiction.id + "/industries/" + industry.id + "/operators");
          }]
        },
      })
      .when('/subject', {
        templateUrl: 'views/subscriber.html',
        controller: 'SubscriberCtrl',
        resolve: {
          identifiers: ["dataProviderService", "urls", "AMIRequest", function(dataProviderService, urls, AMIRequest){
          var operator = AMIRequest.get('operator');
          var path;
          var params;

          if(operator.meta.data_management_unit == "data-banks"){
            path = "/data_banks/identifiers/"
            var banks = operator.meta.data_banks;
            params = {"banks[]": banks};
          }
          else{
            path = "/services/identifiers/";
            var services = AMIRequest.get('services');
            var service_ids = [];
            angular.forEach(services, function(value, key){
              if(value.selected){
                service_ids.push(value.id);
              }
            }, service_ids);
            params = {"services[]": service_ids}
          }
            return dataProviderService.getItem(urls.apiURL(), path, params);
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
            return dataProviderService.getItem(urls.apiPagesURL(), "/171");
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
            return dataProviderService.getItem(urls.apiPagesURL(), "/168");
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
            return dataProviderService.getItem(urls.apiPagesURL(), "/165");
          }]
        },
      })
      .when('/request', {
        templateUrl: 'views/request.html',
        controller: 'RequestCtrl',
        resolve: {
          pdfOptionEnabled: ["envOptions", function(envOptions){
            return envOptions.pdfOption;
          }]
        }
      })
      .when('/components', {
        templateUrl: 'views/questions.html',
        controller: 'QuestionsCtrl',
        resolve: {
          components: ["dataProviderService", "urls", "AMIRequest", function(dataProviderService, urls, AMIRequest) {
            var operator = AMIRequest.get('operator');
            console.log("OG", operator);
            if(operator.meta.data_management_unit == "data-banks"){
              return dataProviderService.getItem(urls.apiURL(), "/operators/" + operator.id + "/data_banks/");
            }
            else{
              var services = AMIRequest.get('services');
              var service_ids = [];
               angular.forEach(services, function(value, key){
                  if(value.selected){
                    service_ids.push(value.id);
                  }
                }, service_ids);
              return dataProviderService.getItem(urls.apiURL(), "/components/", {"services[]": service_ids});
            }
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
AMIApp.run(['$http', 'NavCollection', '$timeout', '$location', '$translate', 'envOptions', '$cookies', 'AMIRequest', function($http, NavCollection, $timeout, $location, $translate, envOptions, $cookies, AMIRequest){
  // Redirect to landing page if on a dependant stage path
  if(AMIRequest.hierarchy.indexOf($location.path().substring(1)) > -1){
    $location.path('/');
  }
  var langCookie = $cookies.get('languageCode');
    console.log("cookie", langCookie);
  if(langCookie){  
    $translate.use(langCookie);
    console.log($translate.use());
  }
  else if(navigator.language){
    $translate.use(navigator.language.substr(0,2))
  }
  else{
    $translate.use(envOptions.languageCode);
  }

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
        .success( function(data, status, headers, config) {
          cmsStatus.isOnline(true);
        })
        .error( function(data, status, headers, config) {
          cmsStatus.isOnline(false);
        });
    }
  }, 60000);
  $timeout(function(){
      document.getElementById("loadingScreen").className += ' faded-out';
      $timeout(function(){
        document.getElementById("loadingScreen").className.replace('faded-out', '');
        document.getElementById("loadingScreen").remove();
      }, 200);
    }, 170);
}]);
