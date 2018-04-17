"use strict"

var raService = angular.module('ReferenceActivity', [])

.factory('getReferenceActivities', ['$window', '$http', function ($window, $http) {
    return function (staffingModel, callback, errorHandler) {
        var token;
        token = $window.sessionStorage.getItem('accessToken');
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        var promise;
        var targetUrl = '/api/Dimension?Id=' + staffingModel;

        promise = $http({
            method: 'GET',
            url: targetUrl,
            headers: headers
        }).then(function successCallback(response) {

            callback(response.data);

        }, function errorCallback(response) {
            errorHandler(response);
        })

    }
}])

