'use strict';
var dataProviderService = angular.module('dataProviderService', []);
dataProviderService.factory('dataProviderService', ['$route', '$q', '$http', 'urls', 'cmsStatus', '$translate', function( $route, $q, $http, urls, cmsStatus, $translate ) {
    var self = {
        getItem: function (baseURL, itemPath, params, responseType) {
            return $translate.onReady().then(function(){
                if(typeof baseURL === 'function'){
                    baseURL = baseURL($translate.use());
                }
                return self.promiseRequest(baseURL, itemPath, params, 'GET', responseType);
            });
        },
        postItem:  function (baseURL, itemPath, params, data, responseType) {
            return self.promiseRequest(baseURL, itemPath, params, 'POST', data, responseType);
        },
        promiseRequest: function (baseURL, itemPath, params, httpMethod, data, setCache, responseType) {
            var delay = $q.defer();
            self.request(baseURL, itemPath, params, httpMethod, data, setCache, responseType)
            .then( function(data, status, headers, config) {
                if(urls.apiURL === baseURL && !cmsStatus.isOnline()){
                    cmsStatus.isOnline(true);
                }
                delay.resolve( data.data );
            }).catch( function(data, status, headers, config) {
                if(urls.apiURL === baseURL){
                    cmsStatus.isOnline(false);
                }
                delay.reject( {data: data, status: status} );
            });
            return delay.promise;
        },
        request: function (baseURL, itemPath, params, httpMethod, data, setCache, responseType) {
            var itemURL;
            var options;
            var cache = true;
            if(setCache === false){
                cache = false;
            }

            itemURL = baseURL + itemPath;

            if(typeof params == "undefined"){
              params = {};
            }
            if(httpMethod == 'POST'){
                cache = false;
            }
            options = {
                method: httpMethod, 
                url: itemURL, 
                params: params,
                cache: cache,
            }
            if(typeof data !== "undefined"){
                options.data = data;
            }
            if(typeof responseType !== "undefined"){
                options.responseType = responseType;
            }
            return $http(options);
        }
    };
    return self;
}]);
module.exports = dataProviderService;