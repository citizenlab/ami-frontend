/**************

Copyright 2014 Digital Stewardship Initiative Contributors (University of Toronto and Fort Effect Company Corporation)

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

***************/

function PIRS_ServiceType(name){
  this.name = name;
  this.piiTypes = []

  this.addPiiType = function(piiType){
    this.piiTypes.push(piiType);
  }
  this.addPiiTypes = function(piiTypeArray){
    this.piiTypes = this.piiTypes.concat(piiTypeArray);
  }
  this.getPiiTypes = function(){
    return this.piiTypes;
  }
}