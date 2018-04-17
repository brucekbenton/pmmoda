"use strict";
// JavaScript source code
var dimMap = angular.module('ActivityMapModule', ["ngRoute"])

.controller('ActivityMap', ['$scope', '$http', '$rootScope', '$window', function ($scope, $http, $rootScope, $window) {

    $scope.dummy = "sample text";
    $scope.currentProjectTeam = undefined;
    $scope.editRow = -1;
    $scope.editMode = false;
    $scope.newActivity = false;
    $scope.activityMap = [];

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
            alert("Error Encountered");
        })

    }

    $scope.initializeProjectTeams();

    $scope.initializeActivityData = function () {
        $scope.loadActivities();
        $scope.loadComponents();
    }

    // Load the reference components associated with the selected Application Type
    $scope.loadActivities = function () {
        var token;
        token = $window.sessionStorage.getItem('accessToken');
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        var promise;
        var targetUrl = '/api/Dimension?Id=' + $scope.currentProjectTeam.Id;

        promise = $http({
            method: 'GET',
            url: targetUrl,
            headers: headers
        }).then(function successCallback(response) {

            $scope.ReferenceActivities = response.data;

        }, function errorCallback(response) {
            alert("Error Encountered");
        })
    }

    // Load the reference components associated with the selected Application Type
    $scope.loadComponents = function () {
        var token;
        token = $window.sessionStorage.getItem('accessToken');
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        var promise;
        var targetUrl = '/api/NaturalUnit?Id=' + $scope.currentProjectTeam.Id;

        // reset the activity map
        $scope.activityMap.length = 0;

        promise = $http({
            method: 'GET',
            url: targetUrl,
            headers: headers
        }).then(function successCallback(response) {

            $scope.ReferenceComponents = response.data;
            // loop over the components and load the activityMap data
            var index = 0;
            while(index < $scope.ReferenceComponents.length)
            {
                $scope.loadActivityMap($scope.ReferenceComponents[index].ID);
                index++;
            }
        }, function errorCallback(response) {
            alert("Error Encountered");
        })
    }

    $scope.loadActivityMap = function (ID, collection) {

        var token;
        token = $window.sessionStorage.getItem('accessToken');
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        var promise;
        var targetUrl = '/api/NaturalUnitModel?UnitID=' + ID + '&OrgID=' + $scope.currentProjectTeam.Id;

        promise = $http({
            method: 'GET',
            url: targetUrl,
            headers: headers
        }).then(function successCallback(response) {
            $scope.newMap = {
                UnitID: 0,
                DimensionID: 0,
                DimensionName: "",
                OrganizationID: 0,
                isACtive: 0,
                UserID: 0,
                LoNominalEffort: 0,
                MedNominalEffort: 0,
                HiNominalEffort: 0
            };

            $scope.newMap = response.data;
            $scope.activityMap.push($scope.newMap);
            // loop over the components and load the activityMap data
        }, function errorCallback(response) {
            alert("Error Encountered");
        })

    };

    $scope.checkData = function () {
        var dummy = "text";
    };

    $scope.componentActivityStatus = function (activityID,componentID ) {
        var componentIndex = 0
        var status = false;
        var activity = false;

        /*
        // Make sure both parameters are valid
        if (componentID != undefined && activityID != undefined) {
            while (componentIndex < $scope.ReferenceComponents.length) {
                // make sure there is an activity record
                if ($scope.activityMap[componentIndex].length > 0) {
                    if (componentID == $scope.activityMap[componentIndex][0].ID) {
                        activity = true;
                        break;
                    }
                }
                componentIndex++;
            }
            // Loop over the Activity Map to get the current status
            if (activity) {
                var activityIndex = 0;
                while (activiytIndex < $scope.activityMap[componentIndex].length) {
                    if (activityID == $scope.activityMap[componentIndex][activityIndex].ID) {
                        status = true;
                    }
                }
            }
        }
        */
    return (status);
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


            },
        };
    })
