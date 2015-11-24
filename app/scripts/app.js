/**************

Copyright 2016 Open Effect

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/

'use strict';

var AMIApp = angular.module('AMIApp', [
    'ngRoute',
    'ngEnter',
    'dataProviderService',
    'ProgressBarNav',
    'formItem',
    'requestTemplate',
    'AMIRequest',
    'ngSticky',
    'ui.bootstrap'
  ])
  .constant('apiDomain', 'http://128.100.127.49:8888')
  .constant('apiPath', "/amicms/wp-json/amicms")
  .constant('enrollmentDomain', "http://128.100.127.49:3000")
  .constant('enrollmentApiPath', "/")
  .constant('jurisdictionID', 18)
  .service('urls', function(apiDomain, apiPath, enrollmentDomain, enrollmentApiPath){
    this.apiURL = apiDomain + apiPath
    this.enrollmentURL = enrollmentDomain + enrollmentApiPath
    return this;
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/industry', {
        templateUrl: 'views/industry.html',
        controller: 'IndustryCtrl',
        resolve: {
          industries: ["dataProviderService", "urls", "AMIRequest", function(dataProviderService, urls, AMIRequest) {
            var jurisdiction = AMIRequest.get('jurisdiction');
            return dataProviderService.getItem(urls.apiURL, "/jurisdictions/" + jurisdiction.id + "/industries");
          }]
        },
      })
      .when('/operator', {
        templateUrl: 'views/company.html',
        controller: 'CompanyCtrl',
        resolve: {
          companies: ["dataProviderService", "urls", "AMIRequest", function(dataProviderService, urls, AMIRequest) {
            var industry = AMIRequest.get('industry');
            var jurisdiction = AMIRequest.get('jurisdiction');
            return dataProviderService.getItem(urls.apiURL, "/jurisdictions/" + jurisdiction.id + "/industries/" + industry.id + "/operators");
          }]
        },
      })
      .when('/subject', {
        templateUrl: 'views/subscriber.html',
        controller: 'SubscriberCtrl',
        resolve: {
          identifiers: ["dataProviderService", "urls", "AMIRequest", function(dataProviderService, urls, AMIRequest) {
            var services = AMIRequest.get('services');
            var service_ids = [];
             angular.forEach(services, function(value, key){
                if(value.selected){
                  service_ids.push(value.id);
                }
              }, service_ids);
            return dataProviderService.getItem(urls.apiURL, "/identifiers/", {"services[]": service_ids});
          }]
        },
      })
      .when('/account', {
        templateUrl: 'views/accountInfo.html',
        controller: 'AccountCtrl'
      })
      .when('/request', {
        templateUrl: 'views/request.html',
        controller: 'RequestCtrl',
        resolve: {
          components: ["dataProviderService", "urls", "AMIRequest", function(dataProviderService, urls, AMIRequest) {
            var services = AMIRequest.get('services');
            var service_ids = [];
             angular.forEach(services, function(value, key){
                if(value.selected){
                  service_ids.push(value.id);
                }
              }, service_ids);
            return dataProviderService.getItem(urls.apiURL, "/components/", {"services[]": service_ids});
          }]
        },
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
            return dataProviderService.getItem(urls.enrollmentURL, "verify/", {"token": $location.search().token}, null, false);
          }]
        }
      })
      .when('/unsubscribe', {
        templateUrl: 'views/unsubscribe.html',
        controller: 'UnsubscribeCtrl',
        resolve: {
          unsubscribeStatus: ["dataProviderService", "urls", "$location", function(dataProviderService, urls, $location) {
            return dataProviderService.postItem(urls.enrollmentURL, "unsubscribe/", {}, {"email_address": $location.search().md_email}, false);
          }]
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  });

AMIApp.filter('object2Array', function() {
  return function(input) {
    return _.toArray(input);
  }
});

AMIApp.run(function($http, NavCollection, $timeout){
  var stages = [
      {
        name: "",
        path: "#/",
        id: "home",
        icon: "fa fa-home",
        restricted: false,
        className: "",
        target: "_self"
      },
      {
        name: "Industry",
        path: "#/industry",
        id: "industry",
        icon: "fa fa-industry",
        restricted: false,
        className: "",
        target: "_self"
      },
      {
        name: "Org",
        path: "#/operator",
        id: "operator",
        icon: "fa fa-briefcase",
        restricted: true,
        className: "",
        target: "_self"
      },
      {
        name: "You",
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
      },
      {
        name: "Finish",
        path: "#/finish",
        id: "finish",
        icon: "fa fa-flag-checkered",
        restricted: true,
        target: "_self"
      }
    ]
    angular.forEach(stages, function(item){
      NavCollection.addNavItem(item.id, item.path, item.name, item.icon, item.restricted, item.className, item.target);
    });
    $timeout(function(){
      $("#loadingScreen").addClass('faded-out');
      $timeout(function(){
        $("#loadingScreen").hide();
      }, 400);
    }, 170);
});