"use strict"

var raService = angular.module('RoleService', [])

.factory('RoleFactory', ['$window', '$http', function ($window, $http) {

    var getActiveRoles = function (organizationID, callback, errorHandler) {

        var token;
        token = $window.sessionStorage.getItem('accessToken');
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        var promise;
        var targetUrl = '/api/Role/ActiveRoles/?OrganizationID=' + organizationID;

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

    var getInactiveRoles = function (organizationID, callback, errorHandler) {

        var token;
        token = $window.sessionStorage.getItem('accessToken');
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        var promise;
        var targetUrl = '/api/Role/InactiveRoles/?OrganizationID=' + organizationID;

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

    var updateRole = function (role, callback, errorHandler) {

        var token;
        token = $window.sessionStorage.getItem('accessToken');
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        var promise;
        var targetUrl = '/api/Role';

        promise = $http({
            method: 'PUT',
            url: targetUrl,
            data: role,
            headers: headers
        }).then(function successCallback(response) {

            callback(response.data);
        }, function errorCallback(response) {
            errorHandler(response);
        })
    }

    return  {
        getActiveRoles: getActiveRoles,
        getInactiveRoles: getInactiveRoles,
        updateRole: updateRole
    }

}])

