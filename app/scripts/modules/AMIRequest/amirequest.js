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
    return this[key];
  }
  request.set = function(key, value){
    console.log(key, "set", value);
    var oldValue = this[key];
    this[key] = value;
    if(oldValue !== value && this.hierarchy.indexOf(key) >= 0){
      this.resolveHierarchy(key);
    }
  }
  request.has = function(key){
    return (typeof this[key] !== "undefined");
  }
  request.resolveHierarchy = function(key){
    var index = this.hierarchy.indexOf(key);
    if(key === "jurisdiction"){
      NavCollection.restrict('operator');
      delete this['industry'];
      // $location.path('/');
      index+=1;
    }
    for (var i = index+1; i <= this.hierarchy.length; i++) {
      delete this[this.hierarchy[i]];
      try{
        NavCollection.restrict(this.hierarchy[i]);
      }
      catch(e){
        console.log("welp");
      }
    };
  }
  request.hierarchy = ['jurisdiction', 'industry', 'operator', 'services', 'letter'];
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