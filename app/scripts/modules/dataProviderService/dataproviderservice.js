'use strict';
var dataProviderService = angular.module('dataProviderService', []);
dataProviderService.factory('dataProviderService', ['$route', '$q', '$http', 'urls', 'cmsStatus', function( $route, $q, $http, urls, cmsStatus ) {
    return {
        getItem: function (baseURL, itemPath, params) {
            return this.request(baseURL, itemPath, params, 'GET');
        },
        postItem:  function (baseURL, itemPath, params, data) {
            return this.request(baseURL, itemPath, params, 'POST', data);
        },
        request: function (baseURL, itemPath, params, httpMethod, data, setCache) {
            var delay = $q.defer();
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
                cache: cache
            }
            if(typeof data !== "undefined"){
                options.data = data;
            }
            $http(options)
            .success( function(data, status, headers, config) {
                if(urls.apiURL === baseURL){
                    cmsStatus.isOnline(true);
                }
                delay.resolve( data );
            }).error( function(data, status, headers, config) {
                if(urls.apiURL === baseURL){
                     cmsStatus.isOnline(false);
                }
                delay.reject( {data: data, status: status} );
            });
            return delay.promise;
        }
    };
}]);