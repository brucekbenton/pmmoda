/*jslint white:true, this:true*/
"use strict";
// JavaScript source code
var dimMap = angular.module('Administration', ['ReferenceActivity','RoleService'])

.controller('Activities', ['$scope', '$http', '$rootScope', '$window', 'getReferenceActivities','RoleFactory', function ($scope, $http, $rootScope, $window, getReferenceActivities,RoleFactory) {

    $scope.dummy = "sample text";
    $scope.currentProjectTeam = undefined;
    $scope.editRow = -1;
    $scope.editMode = false;
    $scope.newActivity = false;

    // Load the Project teams for the current compamny
    $scope.initializeProjectTeams = function () {

        // get the current company ID

        var token;
        token = $window.sessionStorage.getItem('accessToken');
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        var promise;
        var targetUrl = '/api/Organization?CompanyID=' + currentCompany.CompanyID;

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

    $scope.initializeProjectTeams();

    // Declare an initializeation routine for the Activity Management form
    $scope.initializeActivityData = function () {
        //        $scope.loadActivities();
        getReferenceActivities($scope.currentProjectTeam.Id, $scope.updateRerenceActivities, $scope.errorHandler)
//        $scope.loadRoles();
        RoleFactory.getActiveRoles($scope.currentProjectTeam.Id, $scope.refreshActiveRoles, $scope.errorHandler)
    }


    $scope.errorHandler = function (message) {
        alert(message);
    }

    $scope.updateRerenceActivities = function (data) {
        $scope.ReferenceActivities = data;
    }

    $scope.refreshActiveRoles = function (data) {
        $scope.ReferenceRoles = data;
    }


    $scope.loadRoles = function () {
        var token;
        token = $window.sessionStorage.getItem('accessToken');
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        var promise;
        var targetUrl = '/api/Role/ActiveRoles?OrganizationID=' + $scope.currentProjectTeam.Id;

        promise = $http({
            method: 'GET',
            url: targetUrl,
            headers: headers
        }).then(function successCallback(response) {

            $scope.ReferenceRoles = response.data;
        }, function errorCallback(response) {
            alert("Error Encountered")
        })

    }

    $scope.addActivity = function () {
        $scope.newActivity = true;
        // Create a new activity record and initialize the values
        $scope.newActivity = {
            ID: 0,
            Name: "",
            Description: "",
            Role: 0,
            isActive: true,
            OrganizationID: $scope.currentProjectTeam.Id,
            UserID: 0
        };
        $scope.editMode = true;
        // Insert the new record in the first slot so it will be on top of the table
        $scope.ReferenceActivities.splice(0, 0, $scope.newActivity);
        // Set the edit row
        $scope.editRow = 0;
    }

    $scope.getRoleName = function (ID) {
        var name = "";
        var index = 0;
        while (index < $scope.ReferenceRoles.length)
        {
            if (ID == $scope.ReferenceRoles[index].ID) {
                name = $scope.ReferenceRoles[index].Name;
                break;
            }
            index++;
        }
        return (name);
    }

    // Declare an event handler to update the specified record on the server
    $scope.updateRecord = function (index) {
//        alert("update record: " + index);

        var token;
        token = $window.sessionStorage.getItem('accessToken');
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        var promise;
        var targetUrl = '/api/Dimension?ID=' + $scope.ReferenceActivities[index].ID;

        promise = $http({
            method: 'PUT',
            url: targetUrl,
            data: $scope.ReferenceActivities[index],
            headers: headers
        }).then(function successCallback(response) {

            var myData = response.data;
        }, function errorCallback(response) {
            alert(response.statusText);
        })
    }

    // Declare an event handler to insert the specified record on the server
    $scope.insertRecord = function (index) {
//        alert("update record: " + index);

        var token;
        token = $window.sessionStorage.getItem('accessToken');
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        var promise;
        var targetUrl = '/api/Dimension';

        promise = $http({
            method: 'POST',
            url: targetUrl,
            data: $scope.ReferenceActivities[index],
            headers: headers
        }).then(function successCallback(response) {

            var myData = response.data;
        }, function errorCallback(response) {
            alert(response.statusText);
        })
    }


    $scope.closeFormHandler = function () {
        angular.element("#form").remove();
    }
}])


.directive("scroll", function ($location) {
    return {
        restrict: "A",
        scope: {
            value: "="
        },
        link: function (scope, element, attribute) {

            var dummy = $location.path();

            scope.$watch('value.length', function (newValue, oldValue,element) {
                if (newValue) {
                    var item1 = angular.element(document.querySelector('tableBody'));
                    item1.scrollTo(600);
                }
            }, true);
        }
    };

})

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


            },
        };
    })
