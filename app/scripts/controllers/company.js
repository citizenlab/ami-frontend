/**************

Copyright 2016 Open Effect

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/

'use strict';
AMIApp.controller('CompanyCtrl', ['$scope', '$timeout', '$location', '$window', 'NavCollection', 'companies', 'AMIRequest', 'dataProviderService', 'urls', function ($scope, $timeout, $location, $window, NavCollection, companies, AMIRequest, dataProviderService, urls) {
    $window.scrollTo(0,0)

    $scope.$watch(function(){
      $scope.previousStage = NavCollection.previousItem();
      $scope.nextStage = NavCollection.nextItem();
    });
    $scope.previous = function(){
      $location.url($scope.previousStage.id);
    }
    $scope.next = function(){
      $location.url($scope.nextStage.id);
    }

    $scope.nextIsLoading = false;
    
    if(!AMIRequest.has('industry')){
      $scope.previous();
      return;
    }

    $scope.industry = AMIRequest.get('industry');
    // $scope.companies = companies;
    $scope.companies = companies;

    if(AMIRequest.has('operator')){
      $scope.company = AMIRequest.get('operator');
    }

    $scope.selectCompany = function(company){
      if($scope.company !== company){
        $scope.company = company;
        $scope.selected = true;
      }
    }
   
    $scope.$watch('company', function(newCompany, oldCompany){
      if(newCompany === null){
        console.log("drop");
        AMIRequest.drop('operator');
        $scope.services = null;
      }
      else if(newCompany !== oldCompany){
        if(AMIRequest.set('operator', newCompany)){
          if(newCompany.meta.data_management_unit == "services"){
            dataProviderService.getItem(urls.apiURL(), '/operators/' + newCompany.id + '/services')
            .then(function(services){
              if(services.length){
                if(services.length > 1){
                  for (var i =  services.length - 1; i >= 0; i--) {
                     services[i].selected = false;
                  };
                }
                else{
                  services[0].selected = true;
                  $location.path(NavCollection.nextItem().id);
                }
                $scope.services = services;
              }
              else{
                alert("Sorry, no services for this operator.");
              }
            });
          }
          else{
            //Hack -- we dont' need services here
            $scope.services = [{"title": "Dummy service", "selected": true}];
          }
        }
        else{
          // AMIRequest not changed
          $location.path(NavCollection.nextItem().id);
        }
      }
      else{
        if($scope.company && $scope.company.id){
          AMIRequest.set('operator', $scope.company);
        }
        if(AMIRequest.has('services')){
          console.log("services!");
          console.log(AMIRequest.get('services'));
          if(AMIRequest.get('services').length >= 1){
            $scope.services = AMIRequest.get('services');
          }
        }
      }
    });

    $scope.$watch('services', function(newServices, oldServices){
      $scope.setServices();
      $scope.howManySelectedServices();
    });

    $scope.setServices = function(){
      if($scope.services && $scope.services.length > 0){
        if($scope.howManySelectedServices() > 0){
          AMIRequest.set('services', $scope.services, true);
          //if($scope.services.length === 1 && $scope.selected){
            //$location.path(NavCollection.nextItem().id);
          //}
        }
        else{
          AMIRequest.drop('services');
        }
      }
    }
    
    $scope.howManySelectedServices = function(){
      return _.where($scope.services, {selected: true}).length;
    }

    $scope.showService = function(service){
      return (service.selected === true);
    }
  }]);