/**************

Copyright 2013 Fort Effect Company Corporation

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/

'use strict';
var ProgressBarNav = angular.module('ProgressBarNav', []);
ProgressBarNav.service('NavCollection', ['$rootScope', '$timeout', function($rootScope, $timeout){
  var navCollection = {};
  navCollection.collection = [];
  navCollection.ordered = true;
  navCollection.addNavItem = function(id, path, name, icon, restricted, className, target){
    var itemExists = _.findWhere(this.collection, {'id': id});
    if(itemExists){
      throw Error("item already exists in collection with id", id);
      return;
    }
    var navItem = {};
    navItem.path = path;
    navItem.name = name;
    navItem.id = id;
    navItem.icon = icon;
    navItem.className = className;
    navItem.restricted = restricted;
    navItem.restrictedDefault = restricted;
    navItem.target = target;
    navItem.selected = false;
    navItem.selecting = false;
    navCollection.collection.push(navItem);
  };
  navCollection.selectedNavItem;
  navCollection.previousItem = function(){
    var prevIndex;
    if(this.selectedNavItem){
      if(this.collection.indexOf(this.selectedNavItem) > 0){
        prevIndex =  this.collection.indexOf(this.selectedNavItem) - 1;
      }
      else{
        prevIndex =  this.collection.indexOf(this.selectedNavItem);
      }
      this.previous = this.collection[prevIndex];
      console.log(this.previous);
      return this.previous;
    }
    else{
      delete this.previous;
    }
  }
  navCollection.nextItem = function(){
    var nextIndex;
    if(this.selectedNavItem){
      if(this.collection.indexOf(this.selectedNavItem) < (this.collection.length - 1) ){
        nextIndex =  this.collection.indexOf(this.selectedNavItem) + 1;
      }
      else{
        nextIndex = this.collection.indexOf(this.selectedNavItem);
      }
      this.next = this.collection[nextIndex];
      return this.next;
    }
    else{
      delete this.next;
    }
  }
  navCollection.startSelect = function(id){
    var itemToSelect = _.findWhere(this.collection, {'id': id});
    if(itemToSelect){
      itemToSelect.selectError = false;
      itemToSelect.selecting = true;
    }
    else{
      throw Error("No item in nav collection by id", id);
    }
  }
  navCollection.finishSelect = function(id){
    var itemToSelect = _.findWhere(this.collection, {'id': id});
    if(itemToSelect){
      if(this.selectedNavItem){
        this.selectedNavItem.selected = false;
      }
      $timeout(function(){
        itemToSelect.selecting = false;
        itemToSelect.selected = true;
        navCollection.selectedNavItem = itemToSelect;
        navCollection.previousItem();
        navCollection.nextItem();
      }, 10);
      var startPastSelectedEverythingNow = true;
        angular.forEach(this.collection, function(item, key){
          if(item === itemToSelect && navCollection.ordered){
            startPastSelectedEverythingNow = false;
          }

          if(startPastSelectedEverythingNow && !(item.restricted) && navCollection.collection[navCollection.collection.indexOf(item) + 1] && !(navCollection.collection[navCollection.collection.indexOf(item) + 1].restricted)){
            item.pastSelected = true;
          }
          else {
            item.pastSelected = false;
          }
        });
    }
    else{
      throw Error("No item in nav collection by id", id);
    }
  }
  navCollection.errorSelect = function(id){
    var itemToSelect = _.findWhere(this.collection, {'id': id});
    if(itemToSelect){
      itemToSelect.selecting = false;
      itemToSelect.selectError = true;
    }
    else{
      throw Error("No item in nav collection by id", id);
    }
  }
  navCollection.getById = function(id){
    return _.findWhere(this.collection, {'id': id});
  }
  navCollection.restrict = function(id){
    var itemToRestrict = _.findWhere(this.collection, {'id': id});
    var startRestrictingEverythingNow = false;
    if(itemToRestrict){
      itemToRestrict.restricted = true;
      itemToRestrict.selecting = false;
      angular.forEach(this.collection, function(item, key){
        if(item === itemToRestrict && navCollection.ordered){
          startRestrictingEverythingNow = true;
        }
        if(startRestrictingEverythingNow && item.restrictedDefault){
          item.restricted = true;
          item.selecting = false;
        }
      })
    }
    else{
      throw Error("No item in nav collection by id", id);
    }
  }
  navCollection.unRestrict = function(id){
    var itemToUnRestrict = _.findWhere(this.collection, {'id': id});
    if(itemToUnRestrict){
      itemToUnRestrict.restricted = false;
    }
    else{
      throw Error("No item in nav collection by id", id);
    }
  };
  navCollection.startSelectByPath = function(path){
    var itemToFind = _.findWhere(this.collection, {'path': path});
    if(itemToFind){
      this.startSelect(itemToFind.id);
    }
  }
  navCollection.finishSelectByPath = function(path){
    var itemToFind = _.findWhere(this.collection, {'path': path});
    if(itemToFind){
      this.finishSelect(itemToFind.id);
    }
  }
  navCollection.errorSelectByPath = function(path){
    var itemToFind = _.findWhere(this.collection, {'path': path});
    if(itemToFind){
      this.errorSelect(itemToFind.id);
    }
  }
  navCollection.getItemKeys = function(){
    return _.pluck(this.collection, 'id')
  }
  return navCollection;
}]);

ProgressBarNav.controller('ProgressCtrl', ['$rootScope', '$scope', '$location', 'NavCollection', '$translate', function ($rootScope, $scope, $location, NavCollection, $translate) {
    $scope.stages = NavCollection.collection;
    $scope.stageIcon = function(stage){
      if(stage.selecting){
        return "fa fa-spinner rotating";
      }
      else {
        return stage.icon;
      }
    };
    $rootScope.$on('$translateChangeSuccess', function () {
      var keys = NavCollection.getItemKeys();
      var translateKeys = [];
      for (var i = keys.length - 1; i >= 0; i--) {
         translateKeys.push("nav." + keys[i]);
      }
      keys = keys.reverse();
      $translate(translateKeys).then(function(translations){
        for (var i = translateKeys.length - 1; i >= 0; i--) {
          if(typeof translations[translateKeys[i]] !== "undefined"){
            var item;
            item = NavCollection.getById(keys[i]);
            item.name = translations[translateKeys[i]];
          }
        }
        $scope.stages = NavCollection.collection;
      });
    });
    $scope.$watch(function() {
      $scope.previous = NavCollection.previousItem();
      $scope.next = NavCollection.nextItem();
      $scope.activeIndex = NavCollection.collection.indexOf(NavCollection.selectedNavItem);
      return $location.path();
    }, function(){
      var activeLocation = "#" + $location.url();
      NavCollection.startSelectByPath(activeLocation);
    });
    $rootScope.$on('$routeChangeSuccess', function(event){
      var path = "#" + $location.path();
      console.log("navigated to: ", path);
      NavCollection.finishSelectByPath(path);
    });
}]);