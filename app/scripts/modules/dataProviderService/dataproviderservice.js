'use strict';
var dataProviderService = angular.module('dataProviderService', []);
dataProviderService.factory('dataProviderService', ['$route', '$q', '$http', function( $route, $q, $http ) {
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
                delay.resolve( data );
            }).error( function(data, status, headers, config) {
                delay.reject( {data: data, status: status} );
            });
            return delay.promise;
        }
    };
}]);