/**************

Copyright 2014 Digital Stewardship Initiative Contributors (University of Toronto and Fort Effect Company Corporation)

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/

'use strict';

var pirsApp = angular.module('pirsApp', [
    'ngRoute',
    'ngEnter',
    'ngJSPDF',
    'ProgressBarNav',
    'StateDataManager',
    'AMIRequest',
    'ngSticky',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          jurisdictions: ["dataProviderService", function(dataProviderService) {
            return dataProviderService.getItem("jurisdictions");
          }]
        },
      })
      .when('/industry', {
        templateUrl: 'views/industry.html',
        controller: 'IndustryCtrl',
        resolve: {
          industries: ["dataProviderService", "AMIRequest", function(dataProviderService, AMIRequest) {
            var jurisdiction = AMIRequest.get('jurisdiction');
            return dataProviderService.getItem("jurisdictions/" + jurisdiction.id + "/industries");
          }]
        },
      })
      .when('/operator', {
        templateUrl: 'views/company.html',
        controller: 'CompanyCtrl',
        resolve: {
          companies: ["dataProviderService", "AMIRequest", function(dataProviderService, AMIRequest) {
            var industry = AMIRequest.get('industry');
            var jurisdiction = AMIRequest.get('jurisdiction');
            return dataProviderService.getItem("jurisdictions/" + jurisdiction.id + "/industries/" + industry.id + "/operators");
          }]
        },
      })
      .when('/subject', {
        templateUrl: 'views/subscriber.html',
        controller: 'SubscriberCtrl',
        resolve: {
          identifiers: ["dataProviderService", "AMIRequest", function(dataProviderService, AMIRequest) {
            var services = AMIRequest.get('services');
            var service_ids = [];
             angular.forEach(services, function(value, key){
                if(value.selected){
                  service_ids.push(value.id);
                }
              }, service_ids);
            return dataProviderService.getItem("identifiers/", {"services[]": service_ids});
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
          components: ["dataProviderService", "AMIRequest", function(dataProviderService, AMIRequest) {
            var services = AMIRequest.get('services');
            var service_ids = [];
             angular.forEach(services, function(value, key){
                if(value.selected){
                  service_ids.push(value.id);
                }
              }, service_ids);
            return dataProviderService.getItem("components/", {"services[]": service_ids});
          }]
        },
      })
      .when('/finish', {
        templateUrl: 'views/finish.html',
        controller: 'FinishCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

pirsApp.factory('dataProviderService', ['$route', '$q', '$http', function( $route, $q, $http ) {
    var baseURL = "http://localhost:8888/amicms/wp-json/amicms/";
    return {
        getItem: function (itemPath, params) {
            var delay = $q.defer();
            var itemURL = baseURL + itemPath;
            if(typeof params == "undefined"){
              params = {};
            }
            $http({method: 'GET', url: itemURL, params: params})
            .success( function(data, status, headers, config) {
                delay.resolve( data );
            }).error( function(data, status, headers, config) {
                delay.reject( data );
            });
            return delay.promise;
        }
    };
}]);

pirsApp.directive('requestTemplate', function ($compile, dataProviderService) {
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
            servicelist: '=',
            date: '=',
            componentquestions: '=',
            componentdata: '='
        }
    };
});

pirsApp.filter('object2Array', function() {
  return function(input) {
    return _.toArray(input);
  }
});

pirsApp.directive('formItem', function ($compile, dataProviderService) {
    var templates = {
      text: '<label for="{{id}}">{{label}}<input type="text" class="form-control" name="{{id}}" ng-model="val"/>',
      select: '<label for="{{id}}">{{label}}<select name="{{id}}" class="form-control" ng-model="val" ng-options="option as option.title for option in options track by option.value" ng-model="selected"></select>'
    }

    var linker = function (scope, element, attrs) {
        var id = scope.id;
        var fieldtype = scope.fieldtype;
        var template;
        scope.val = "";
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
          scope.model[scope.id] = {title: scope.label, value: newVal, weight: scope.weight};
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

pirsApp.run(function($http, StateDataManager, NavCollection, $timeout){
  $http({method: 'GET', url: 'data.json'})
  .success(function(data, status, headers, config){
    var results, piiQuestions, serviceTypes = {}, companies = [];
    results = data.results;
    piiQuestions = results.piiQuestions;

    // Build Service Types with PII question defaults
    angular.forEach(results.serviceTypes, function(value, key){
      var serviceType = new PIRS_ServiceType(key);
      angular.forEach(value.piiQuestions, function(piiTypeId){
        serviceType.addPiiType(piiQuestions[piiTypeId]);
      }, serviceType);
      serviceTypes[key] = serviceType;
    }, serviceTypes);
    
    // Build Companies
    angular.forEach(results.companies, function(companyInfo, companyId){
      var company = new PIRS_Company();
      var ixMapStars, starData, companyStars = [];
      
      company.setName(companyInfo.name)
      company.setAddress(companyInfo.address);
      company.setContactActor(companyInfo.contactActor);

      // Build Company Services
      angular.forEach(companyInfo.services, function(serviceInfo, serviceId){
        var service = new PIRS_Service(serviceId);
        service.setServiceType(serviceTypes[serviceInfo.serviceType]);
        service.setName(serviceInfo.name);
        company.addService(service);
      }, company);

      // Include Linked data
      if(typeof companyInfo.linkedData !== "undefined"){
        // angular.forEach(companyInfo.linkedData, function(value, key){
          // if(key == "ixMapStars"){
            ixMapStars = results.linkedData["ixMapStarsLegend"];
            starData = results.linkedData["ixMapStars"][companyInfo.linkedData['ixMapStars']];
            for(var i in results.linkedData["ixMapStarsLegend"]){
              companyStars.push({
                "score": starData[i],
                "star_short_name": results.linkedData["ixMapStarsLegend"][i]["star_short_name"],
                "star_long_des": results.linkedData["ixMapStarsLegend"][i]["star_long_des"]
              });
            }
            companyStars = _.sortBy(companyStars, "score").reverse();
            company.addLinkedDataSet('ixMapStars', companyStars);
        //   }
        // }, company);
        console.log(company);
      }
      companies.push(company);
    }, companies);
    StateDataManager.stash('companies', companies);
  })
  .error(function(data, status, headers, config){

  });
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
        name: "Account",
        path: "#/account",
        id: "account",
        icon: "fa fa-barcode",
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
        name: "Connect",
        path: "https://openeffect.ca",
        id: "finish",
        icon: "fa fa-external-link",
        restricted: false,
        className: "prominent",
        target: "_parent"
      }
    ]
    angular.forEach(stages, function(item){
      NavCollection.addNavItem(item.id, item.path, item.name, item.icon, item.restricted, item.className, item.target);
    });
    $timeout(function(){
      $("#loadingScreen").addClass('faded-out');
      $timeout(function(){
        $("#loadingScreen").hide();
      }, 200);
    }, 170);
});