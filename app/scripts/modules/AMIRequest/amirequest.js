/**************

Copyright 2015 Open Effect

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/

'use strict';
var AMIRequest = angular.module('AMIRequest', []);
AMIRequest.service("AMIRequest", function($rootScope, $location, NavCollection){
  var request = {};
  request.date = moment().format('MMMM Do, YYYY');
  request.get = function(key){
    if(this.has(key)){
      return this[key]['data'];
    }
    else{
      return null;
    }
  }
  request.markAsComplete = function(key){
    if(this[key] && !this[key].completed){
      console.log("markingAsComplete");
      this[key].completed = true;
      this.resolveHierarchy(key, this[key]);
    }
  }
  request.set = function(key, value){
    console.log(key, "set", value);
    var oldValue;
    if(this[key]){
      oldValue = this[key].data;
    }
    if(oldValue !== value){
      this[key] = {"data": value, "completed": false}

      if(this.hierarchy.indexOf(key) >= 0){
        this.resolveHierarchy(key, value);
      }
    }
  }
  request.drop = function(key){
    console.log("Dropping " + key + " from request");
    delete this[key];
    if(this.hierarchy.indexOf(key) >= 0){
      this.resolveHierarchy(key);
    }
  }
  request.has = function(key){
    return (typeof this[key] !== "undefined");
  }
  request.resolveHierarchy = function(key, value){
    var index;
    if(typeof value == "undefined" || !value.completed){
      index = this.hierarchy.indexOf(key);
    }
    else{
      index = this.hierarchy.indexOf(key) + 1;
    }

    for (var i = 0; i < this.hierarchy.length; i++) {
      if(i > index){
        try{
          delete this[this.hierarchy[i]];
        }
        catch(e){
          continue;
        }
      }
      if(i <= index){
        try{
          NavCollection.unRestrict(this.hierarchy[i]);
        }
        catch(e){
          continue;
        }
      }
      else{
        try{
          console.log("\tDropping " + this.hierarchy[i] + " from request");
          NavCollection.restrict(this.hierarchy[i]);
        }
        catch(e){
          continue;
        }
      }
    }
  }
  request.hierarchy = ['jurisdiction', 'industry', 'operator', 'services', 'subject', 'request'];
  request.getAnon = function(){
    return {
      jurisdiction: this.jurisdiction,
      operator: this.operator,
      services: this.services,
      date: this.date
    }
  }
  return request;
});