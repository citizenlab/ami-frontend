/**************

Copyright 2015 Open Effect

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/

'use strict';
var AMIRequest = angular.module('AMIRequest', []);
AMIRequest.service("AMIRequest", function($rootScope, $location, NavCollection){
  var getEnglishDate = function(){
    var eng_moment = moment();
    eng_moment.locale('en');  
    return eng_moment.format('MMMM Do, YYYY');
  }
  var request = {};
  request.date = moment().format('MMMM Do, YYYY');
  request.date_en = getEnglishDate();
  request.get = function(key){
    if(this.has(key)){
      return this[key]['data'];
    }
    else{
      return null;
    }
  }
  request.isComplete = function(key){
    if(this.has(key)){
      return this[key].completed
    }
    else{
      return false;
    }
  }
  request.markAsComplete = function(key){
    if(this[key] && !this[key].completed){
      console.log("markingAsComplete");
      this[key].completed = true;
      this.resolveHierarchy(key, this[key]);
    }
  }
  request.set = function(key, value, isComplete){
    delete value['$$hashKey'];
    
    console.log(key, "set", value);
    var oldValue = null;
    var isChanged = true;
    if(typeof isComplete == "undefined"){
      isComplete = true;
    }
    if(this[key]){
      oldValue = this[key].data;
    }
    isChanged = (JSON.stringify(oldValue) !== JSON.stringify(value));

    if(isChanged){
      console.log("changed", isComplete);
      this[key] = {"data": value, "completed": isComplete}
    }
    if(this.hierarchy.indexOf(key) >= 0){
      this.resolveHierarchy(key, this[key], isChanged);
    }
    return isChanged;
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
  request.resolveHierarchy = function(key, value, isChanged){
    var index;

    if(typeof value == "undefined" || !value.completed){
      index = this.hierarchy.indexOf(key);
    }
    else{
      index = this.hierarchy.indexOf(key) + 1;
    }

    for (var i = 0; i < this.hierarchy.length; i++) {
      console.log(this.hierarchy[i]);
      if(i > index && isChanged){
        if(typeof this[this.hierarchy[i]] !== "undefined"){
          console.log("deleting", this.hierarchy[i]);
          delete this[this.hierarchy[i]];
        }
      }
      if(i <= index){
        try{
          console.log("unrestricting past items", this.hierarchy[i]);
          NavCollection.unRestrict(this.hierarchy[i]);
        }
        catch(e){
          continue;
        }
      }
      else{
        try{
          if(isChanged){
            console.log("\tDropping " + this.hierarchy[i] + " from request");
            NavCollection.restrict(this.hierarchy[i]);
            console.log("Restricting incomplete future items", this.hierarchy[i]);
          }
          else{
            if(this.has(this.hierarchy[i])){
              if(this.isComplete(this.hierarchy[i])){
                console.log("Unrestricting complete future item", this.hierarchy[i]);
                NavCollection.unRestrict(this.hierarchy[i]);
              }
              else{
                console.log("Restricting incomplete future items 2 ", this.hierarchy[i]);
                NavCollection.restrict(this.hierarchy[i]);
              }
            }
            else{
              console.log("Restricting incomplete future items 3", this.hierarchy[i]);
              NavCollection.restrict(this.hierarchy[i]);
            }
          }
        }
        catch(e){
          console.log(e);
          continue;
        }
      }
    }
  }
  request.hierarchy = ['jurisdiction', 'industry', 'operator', 'services', 'components', 'subject', 'request'];
  request.getAnon = function(){
    var date = this.date_en;
    if(typeof date.data !=="undefined"){
      date = date.data;
    }
    return {
      jurisdiction: this.jurisdiction.data,
      operator: this.operator.data,
      services: this.services.data,
      date: date
    }
  }
  request.getEnglish = function(key, englishCollectionKey, collection){
    var englishItem;
    var naturalLangItem = this.get(key);
    var englishCollection;
    if(typeof englishCollectionKey == "string"){
      englishCollection = this.get(englishCollectionKey);
    }
    else if(typeof englishCollectionKey  == "object"){
      englishCollection = englishCollectionKey;
    }
    if(naturalLangItem){
      if(typeof englishCollection !== "undefined"){
        englishItem = _.find(englishCollection, function(item){
          return (item.id === naturalLangItem.id);
        });
      }
      else{
        return null;
      }
    }
    else{
      englishItem = []
      _.each(collection, function(c, index, list){
        var mergedItem;
        mergedItem = angular.copy(c);
        var item = _.find(englishCollection, function(e){
         // else{
            return (e.id === c.id || e.id === c.serverID || e.id == index);
          //}
        });
        if(item){
          if(item.title){
            mergedItem.title = item.title;
          }
          if(typeof item['meta'] !== "undefined"){      
            mergedItem['meta'] = angular.copy(item['meta']);
            if(typeof item['meta']['component_value'] !== "undefined"){
              mergedItem['data'] = item['meta']['component_value'];
            }
          }
          englishItem.push(mergedItem);
        }
        else{
          // Add natural language equivalent if no Eng present.
          englishItem.push(c);
        }
      });
    }

    return englishItem;
  }
  return request;
});
module.exports = AMIRequest;