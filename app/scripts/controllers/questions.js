/**************

Copyright 2016 Open Effect

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/

'use strict';
AMIApp.controller('QuestionsCtrl', ['$scope', '$timeout', '$location', '$window', 'NavCollection', 'components', 'AMIRequest', 'dataProviderService', 'urls', function ($scope, $timeout, $location, $window, NavCollection, components, AMIRequest, dataProviderService, urls) {
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
    var componentType = function(id){
      return {
        id: id,
        items: [],
        toAdd: null,
        toUpdate: null,
        activated: false,
        add: function(title, description, editable, selected){
          if(typeof selected == "undefined"){
            selected = true;
          }
          if(typeof editable == "undefined"){
            editable = false;
          }
          if(this.verify(title)){
            this.items.push(newComponent(title, description, editable, selected));
            if(description){
              this.isCollapsed = true;
            }
          }
        },
        new: function(){
          if(this.verify(this.toAdd)){
            this.items.push(newComponent(this.toAdd, null, true, true));
            delete this.toAdd;
          }
        },
        verify: function(item){
          return (
            item 
            && item !== "" 
            && (
              this.items.indexOf(item) === -1
            ));
        },
        update: function(item, index){
          //if(this.verify(item) && this.items[index] !== item){
            this.items[index] = item;
            delete this.toUpdate;
          //}
        },
        startUpdate: function(index){
          this.toUpdate = this.items[index];
        },
        delete: function(index){
          this.items.splice(index, 1);
        },
        hasSelectedItems: function(){
          for (var i = this.items.length - 1; i >= 0; i--) {
            if(this.items[i].selected){
              return true;
            }
          };
          return false;
        },
        activate: function(){
          this.activated = true;
        }
      }
    }

    var newComponent = function(data, description, editable, selected){
      var component = {
        data: data,
        description: description,
        editable: editable,
        selected: selected
      }
      return component;
    }

    $scope.operator = AMIRequest.get('operator');

    if(AMIRequest.has('components')){
      $scope.components = AMIRequest.get('components');
    }
    else{
      $scope.components = {
        questions: new componentType('questions'),
        data: new componentType('data'),
        dataBanks: new componentType('dataBanks')
      };
      for(var i=0; i < components.length; i++){
      if(components[i].meta.component_type == "Data"){
        $scope.components['data'].add(components[i].meta.component_value, null);
        $scope.components['data'].activate();
      }
      else if(components[i].meta.component_type == "Question"){
        $scope.components['questions'].add(components[i].meta.component_value, null);
        $scope.components['questions'].activate();
      }
      else if(components[i].meta.data_bank_number){
        $scope.components['dataBanks'].add(components[i].title + " (" + components[i].meta.data_bank_number + ")", components[i].content, false, false);
        $scope.components['questions'].activate();
        $scope.components['dataBanks'].activate();
      }
    }

    var validateComponentSelection = function(){
      if(($scope.components['data'].hasSelectedItems()) || !$scope.components['data'].activated && ($scope.components['questions'].hasSelectedItems() || !$scope.components['questions'].activated) && ($scope.components['dataBanks'].hasSelectedItems() || !$scope.components['dataBanks'].activated)){
        AMIRequest.set('components', $scope.components);
      }
      else{
        AMIRequest.drop('components');
      }
    }

    $scope.$watch(function(){
      $scope.nextStage = NavCollection.next;
      console.log("navigated, next stage assigned");
      validateComponentSelection();
    });
    $scope.nextStage = NavCollection.next;
    console.log("navigated stage", $scope.nextStage.id);
  }
  }]);