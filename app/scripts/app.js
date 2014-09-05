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
    'ngSticky',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/companyInfo', {
        templateUrl: 'views/company.html',
        controller: 'CompanyCtrl'
      })
      .when('/subscriberInfo', {
        templateUrl: 'views/subscriber.html',
        controller: 'SubscriberCtrl'
      })
      .when('/accountInfo', {
        templateUrl: 'views/accountInfo.html',
        controller: 'AccountCtrl'
      })
      .when('/letter', {
        templateUrl: 'views/letter.html',
        controller: 'LetterCtrl'
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
        name: "Overview",
        path: "#/",
        id: "home",
        icon: "fa fa-home",
        restricted: false,
        className: "",
        target: "_self"
      },
      {
        name: "Company",
        path: "#/companyInfo",
        id: "companyInfo",
        icon: "fa fa-briefcase",
        restricted: false,
        className: "",
        target: "_self"
      },
      {
        name: "Contact",
        path: "#/subscriberInfo",
        id: "subscriberInfo",
        icon: "fa fa-user",
        restricted: true,
        className: "",
        target: "_self"
      },
      {
        name: "Account",
        path: "#/accountInfo",
        id: "accountInfo",
        icon: "fa fa-barcode",
        restricted: true,
        className: "",
        target: "_self"
      },
      {
        name: "Letter",
        path: "#/letter",
        id: "letter",
        icon: "fa fa-file-text",
        restricted: true,
        className: "",
        target: "_self"
      },
      {
        name: "Connect",
        path: "https://openmedia.ca/MyInfo/reminder",
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