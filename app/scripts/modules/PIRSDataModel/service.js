/**************

Copyright 2014 Digital Stewardship Initiative Contributors (University of Toronto and Fort Effect Company Corporation)

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/

function PIRS_Service(serviceId){
  this.name;
  this.serviceType;
  this.serviceId = serviceId;
  this.servicePiiTypes = [];

  this.getId = function(){
    return this.serviceId;
  }
  this.setName = function(serviceName){
    this.name = serviceName;
  }
  this.getName = function(){
    return this.name;
  }
  this.setServiceType = function(option){
    // Check if service type is legit?
    this.serviceType = option;
    this.saveServiceTypePIIDefaults();
  }
  this.getServiceType = function(){
    return this.serviceType;
  }
  this.saveServiceTypePIIDefaults = function(){
    if(typeof this.serviceType !== "undefined"){
      this.servicePiiTypes = this.serviceType.getPiiTypes();
    }
    else{
      throw new Error("Can't get service type defaults without a type");
    }
  }
  this.getServicePiiTypes = function(){
    return this.servicePiiTypes;
  }
};