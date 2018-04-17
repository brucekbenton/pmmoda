"use strict"
// JavaScript source code
var dimMap = angular.module('Organization', ['RoleService'])

.controller('ProjectTeams', ['$scope', '$http', '$rootScope', '$window', 'RoleFactory', function ($scope, $http, $rootScope, $window, RoleFactory) {

    //    $scope.ActiveRoles = undefined;
    $scope.currentCompany = undefined;
    $scope.currentProjectTeam = undefined;
    $scope.editRow = -1;
    $scope.editMode = false;
    $scope.newActivity = false;
    // Declare a variable to indicate whether there is an active company
    $scope.companySelected = false;
    $scope.SuperUser = false;

    $scope.ReferenceActivities = undefined;


    $scope.validateSuperUserAccess = function () {
        // declare a local variable to store the constructed URL
        var targetUrl;

        var token;
        token = $window.sessionStorage.getItem('accessToken');
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        var promise;
        targetUrl = '/api/PmmodaUser' + "?Role=SuperUser";

        promise = $http({
            method: 'GET',
            url: targetUrl,
            headers: headers
        }).then(function successCallback(response) {
            $scope.SuperUser = true;
            $scope.initializeCompanies();

//            $scope.Companies = response.data;
        }, function errorCallback(response) {
            // Get the CompanyID for the current user
            $scope.getDefaultCompany();
        })
    }

    $scope.validateSuperUserAccess();


    $scope.getDefaultCompany = function () {
        var token;
        token = $window.sessionStorage.getItem('accessToken');
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        var promise;
        var targetUrl = '/api/Company/CompanyByUser';

        promise = $http({
            method: 'GET',
            url: targetUrl,
            headers: headers
        }).then(function successCallback(response) {

            $scope.currentCompany = response.data;
            $scope.initializeProjectTeams(currentCompany);
        }, function errorCallback(response) {
            alert("Error Encountered")
        })
    }


    // Load the Project teams for the current compamny
    $scope.initializeCompanies = function () {

        // get the current company ID

        var token;
        token = $window.sessionStorage.getItem('accessToken');
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        var promise;
        var targetUrl = '/api/Company/Company';

        promise = $http({
            method: 'GET',
            url: targetUrl,
            headers: headers
        }).then(function successCallback(response) {

            $scope.Companies = response.data;
        }, function errorCallback(response) {
            alert("Error Encountered")
        })

    }

//    $scope.initializeCompanies();

    // Load the Project teams for the current compamny
    $scope.initializeProjectTeams = function (company) {

        $scope.companySelected = true;

        // get the current company ID

        var token;
        token = $window.sessionStorage.getItem('accessToken');
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        var promise;
        var targetUrl = '/api/Organization?CompanyID=' + company.CompanyID;

        promise = $http({
            method: 'GET',
            url: targetUrl,
            headers: headers
        }).then(function successCallback(response) {

            $scope.ProjectTeams = response.data;
        }, function errorCallback(response) {
            alert("Error Encountered")
        })

    }

    $scope.populateActiveRoles = function () {
        $scope.companySelected = true;
        RoleFactory.getActiveRoles($scope.currentProjectTeam.Id, $scope.refreshActiveRoles, $scope.errorHandler)
    }

    $scope.refreshActiveRoles = function (data) {
        $scope.ActiveRoles = data;
    }

    $scope.errorHandler = function (message) {
        alert(message);
    }

    // Declare an event handler to update the specified record on the server
    $scope.updateRecord = function (index) {
        //        alert("update record: " + index);
        RoleFactory.updateRole($scope.ActiveRoles[index],null,$scope.errorHandler)

    }


    $scope.updateProjectTeam = function () {

        var token;
        token = $window.sessionStorage.getItem('accessToken');
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        var promise;
        var targetUrl = '/api/Organization?Id=' + $scope.currentProjectTeam.Id;

        promise = $http({
            method: 'PUT',
            url: targetUrl,
            data: $scope.currentProjectTeam,
            headers: headers
        }).then(function successCallback(response) {

            callback(response.data);
        }, function errorCallback(response) {
            errorHandler(response);
        })

    }


}])

    .directive("displayTable", function ($location) {
        return {
            restrict: "A",
            controller: function ($scope) {

                $scope.setEditRow = function (index) {
                    $scope.editRow = index;
                }

                $scope.saveRow = function (index) {
                    $scope.editRow = undefined;
                    $scope.editMode = false;
                    if ($scope.newActivity) {
                        // Insert a new record
                        $scope.insertRecord(index);
                    }
                    else {
                        // Update the server data
                        $scope.updateRecord(index);
                    }
                    $scope.newActivity = false;
                }

                $scope.updateProjectTeamHandler = function () {
                    $scope.updateProjectTeam();
                }
            },
        };
    })
