'use strict';
var dataProviderService = angular.module('dataProviderService', []);
dataProviderService.factory('dataProviderService', ['$route', '$q', '$http', function( $route, $q, $http ) {
    var baseURL = "http://128.100.127.49:8888/amicms/wp-json/amicms/";
    return {
        getItem: function (itemPath, params, newBaseURL) {
            return this.request(itemPath, params, newBaseURL, 'GET');
        },
        postItem:  function (itemPath, params, newBaseURL, data) {
            return this.request(itemPath, params, newBaseURL, 'POST', data);
        },
        request: function (itemPath, params, newBaseURL, httpMethod, data) {
            var delay = $q.defer();
            var itemURL;
            var options;
            var cache = true;

            if(typeof newBaseURL !== "undefined"){
                itemURL = newBaseURL + itemPath;
            }
            else{
                itemURL = baseURL + itemPath;
            }
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