/**************

Copyright 2013 Fort Effect Company Corporation

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/

'use strict';
var StateDataManager = angular.module('StateDataManager', []);
StateDataManager.service("StateDataManager", function($rootScope){
  var manager = {};
    manager.items = {};
    manager.has = function(itemKey){
      if(typeof itemKey !== "string"){
        throw "itemKey must be a string";
      }
      if(typeof manager.items[itemKey] !== "undefined"){
        return true;
      }
      else{
        return false;
      }
    };
    manager.get = function(itemKey){
      if(this.has(itemKey)){
        return this.items[itemKey];
      }
      else{
        throw "no data registered under that key";
      }
    };
    manager.pop = function(itemKey){
      if(typeof itemKey !== "string"){
        throw "itemKey must be a string";
      }
      delete this.items[itemKey];
      this.broadcast(itemKey);
    }
    manager.stash = function(itemKey, data){
      if(typeof itemKey !== "string"){
        throw "itemKey must be a string";
      }
      this.items[itemKey] = data;
      this.broadcast(itemKey, data);
    };
    manager.broadcast = function(itemKey, data){
      var broadcastId = "stateDataManager.update." + itemKey;
      console.log(broadcastId, data);
      $rootScope.$broadcast(broadcastId, data);
    };
    return manager;
});