/**************

Copyright 2014 Digital Stewardship Initiative Contributors (University of Toronto and Fort Effect Company Corporation)

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/

function PIRS_Company(){
  this.name;
  this.address;
  this.contactActor;
  this.email;
  this.services = {};

  this.setAddress = function(options){
    if(typeof options === "object"){
      try{
        this.address = {
          attention: options.attention || null,
          address1: options.address1,
          address2: options.address2 || null,
          city: options.city,
          province: options.province,
          postalcode: options.postalcode
        }
        this.email = options.email || null;
      }
      catch(e){
        throw new Error("missing address items for service contactActor");
      }
    }
    else{
      throw new Error("options must be object");
    }
  }
  this.getAddress = function(){
    return this.address;
  }
  this.setContactActor = function(options){
    if(typeof options === "object"){
      this.contactActor = {
        name: options.name || null,
        title: options.title || "Privacy Officer"
      }
    }
    else{
      throw new Error("options must be object");
    }
  }
  this.getContactActor = function(){
    return this.contactActor;
  }
  this.setName = function(option){
    this.name = option;
  }
  this.getName = function(){
    return this.name;
  }
  this.setEmail = function(email_addr){
    if(validateEmail(email_addr)){
      this.email = email_addr;
    }
    else{
      throw new Error("email address invalid");
    }
  }
  this.getEmail = function(){
    return this.email;
  }
  this.addService = function(service){
    this.services[service.getId()] = service;
  }
  this.getServices = function(){
    return this.services;
  }
  this.getService = function(serviceId){
    if(typeof this.services[serviceId] !== "undefined"){
      return this.services[serviceId];
    }
    else{
      throw new Error("No service with that ID present for company " + company.name);
    }
  }
}