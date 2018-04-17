"use strict"
// JavaScript source code
//var path;
var wizard = angular.module('wizard', ["ngRoute"])


.controller('Navigation', ['$scope', '$http', '$rootScope','$window','$interval', function ($scope, $http, $rootScope,$window,$interval) {

    // Initialize the current help topic string
    $scope.displayTopic = "";

    // Declare a variable to track whether the save button should be enabled
    $scope.saveDisabled = false;

    // Declare a variable to control the visibility of the tatus bar    
    $scope.statusVisible = false;

    $scope.statusBarWidth = '0px';
    $scope.inputScreen = true;
    $scope.summaryScreen = false;
    $scope.PageTitle = "Project Team Wizard";

//    $scope.updateSt

    // Load the set of defined staffing models for the wizard
    $scope.initializeStaffingModel = function () {
        var token;
        token = $window.sessionStorage.getItem('accessToken');
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        var promise;

        promise = $http({
            method: 'GET',
            url: '/api/StaffingModel',
            headers: headers
        }).then(function successCallback(response) {

            $scope.StaffingModels = response.data;
        }, function errorCallback(response) {
        })
    }
    $scope.initializeStaffingModel();

    // Load the set of Application Types to populate the combo box in the Wizard
    $scope.initializeApplicationType = function () {
        var token;
        token = $window.sessionStorage.getItem('accessToken');
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        var promise;

        promise = $http({
            method: 'GET',
            url: '/api/ApplicationType',
            headers: headers
        }).then(function successCallback(response) {
            //           alert("data received");


            $scope.ApplicationTypes = response.data;
        }, function errorCallback(response) {
        })

    }

    $scope.initializeApplicationType();

    // Declare a function to get the company ID corresponding to the current user
    $scope.initializeCurrentCompany = function () {
        // Declare a Deferred construct to return from this method
        var token;
        token = $window.sessionStorage.getItem('accessToken');
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        var promise;

        // Hard code this to the UnitDimension service for now
        var targetUrl = 'api/Company/CompanyByUser';

        promise = $http({
            url: targetUrl,
            method: 'GET',
            dataType: 'json',
            headers: headers
        }).then(function successCallback(response) {
            //           alert("data received");


            $scope.currentCompany = response.data.CompanyID;
        }, function errorCallback(response) {
            alert(response.statusText);
        })


    }
    $scope.initializeCurrentCompany();

    // Load the reference components associated with the selected Application Type
    $scope.loadReferenceComponent = function (TypeID) {
        var token;
        token = $window.sessionStorage.getItem('accessToken');
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        var promise;
        var targetUrl = '/api/ReferenceComponent?TypeID=' + TypeID;

        promise = $http({
            method: 'GET',
            url: targetUrl,
            headers: headers
        }).then(function successCallback(response) {
            //           alert("data received");


            $scope.ReferenceComponents = response.data;
        }, function errorCallback(response) {
        })

    }

    // Load the set of reference activities associated with the selected Staffing Model
    $scope.loadReferenceActivity = function (ModelID) {
        var token;
        token = $window.sessionStorage.getItem('accessToken');
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        var promise;
        var targetUrl = '/api/StaffingModel/Activities?ModelID=' + ModelID;

        promise = $http({
            method: 'GET',
            url: targetUrl,
            headers: headers
        }).then(function successCallback(response) {

            $scope.ReferenceActivities = response.data;
        }, function errorCallback(response) {
        })

    }

    // Initialize the Project Name parameter
    if ($scope.projectName == undefined) {
        $scope.projectName = "";
    }

    // Initialize the project description parameter
    if ($scope.projectDescription == undefined) {
        $scope.projectDescription = "";
    }

    // Initialize the currentStage variable
    if ($scope.currentStage == undefined) {
        $scope.currentStage = 1;
    }

    // Declare a method to exit the wizard and reset the parent frame
    $scope.exitWizard = function () {
//        document.frames.frameElement.src = "";
//        loadHomeData();
        closeProjectTeamWizardHandler();
    }

    $scope.saveNewRecord = function () {
        // Declare a local Organization object instance to send to the server
        var newTeam = new Organization();
        // Set the company ID field
        newTeam.CompanyID = $scope.currentCompany;
        // Set the name field
        newTeam.Name = $scope.projectName;
        // Set the description field
        newTeam.Description = $scope.projectDescription;
        // Iniitalize the work day to 8 hours
        newTeam.WorkDay = 8;
        // Initialize the active flag
        newTeam.isActive = true;
        // disable the save button
        $scope.saveDisabled = true;
        $scope.statusVisible = true;


        $scope.startTimer();

        var token;
        token = $window.sessionStorage.getItem('accessToken');
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        var promise;
        var targetUrl = '/api/Organization/OrganizationFromWizard?appType=' + $scope.currentTemplate.TypeID + '&staffModel=' + $scope.currentStaffModel.ModelID;

        
        promise = $http({
            method: 'POST',
            url: targetUrl,
            data: newTeam,
            headers: headers
        }).then(function successCallback(response) {

            var myData = response.data;
            $scope.stopTimer();
            $scope.exitWizard();
        }, function errorCallback(response) {
            alert(response.statusText);
        })
        

    }


    // Declare a function to hide the current help topic
    $scope.hideHelp = function (element) {
        $scope.helpBoxStyle = "helpBoxHidden";
    }

    // Declare a function to display the current help topic
    $scope.showHelp = function (element) {
        $scope.helpBoxStyle = "helpBoxActive";
        var node = event.target;
        if (node.id == "") {
            node = node.parentNode;
        }
        switch (node.id) {
            case "name":
                $scope.topicName = "Name";
                $scope.topicDescription = "Enter the friendly name for the Project Team you are creating. This value cannot be changed later.";

                break;
            case "description":
                $scope.topicName = "Description";
                $scope.topicDescription = "Enter a short description for the current project team. Typically this would include the product line or application suite for which the team is responsible. You can update this value later using the Project Team admin form.";
                break;
            case "Activity":
                $scope.topicName = "Activity Model";
                $scope.topicDescription = "Select the staffing model that matches your project teams work mode. The value selected will determine the functional activities and the roles which are tracked for the projects belonging to this team. You can modify these values later using the admin forms.";
                break;
            case "Application":
                $scope.topicName = "Application Type";
                $scope.topicDescription = "Select the type of application which matches the project work done by this project team. This value will define the set of standard components to use in your productivity model. You can modify these values later using the Standard Components admin form.";
                break;
            default:
                $scope.displayTopic = "";
                $scope.topicName = "";
                $scope.topicDescription = "";
                break;
        }
    }
    var stop = undefined;
    $scope.startTimer = function () {

        $scope.statusVisible = true;
        stop = $interval($scope.updateStatus, 80, 0, true);

    }

    $scope.stopTimer = function () {
        $interval.cancel(stop);
        stop = undefined;
        $scope.statusVisible = false;
    }
    $scope.statusBar = 0;
    $scope.updateStatus = function () {
        if ($scope.statusBar < 250) {
            $scope.statusBar += 5;
            $scope.statusBarWidth = $scope.statusBar + 'px';
        }
        else {
            $scope.statusBar = 0;
            $scope.statusBarWidth = $scope.statusBar + 'px';
        }
    }

    $scope.nextScreen = function () {
        $scope.loadReferenceComponent($scope.currentTemplate.TypeID);
        $scope.loadReferenceActivity($scope.currentStaffModel.ModelID);
        $scope.inputScreen = false;
        $scope.summaryScreen = true;
        $scope.PageTitle = "Finished";
    }

    $scope.previousScreen = function () {
        $scope.inputScreen = true;
        $scope.summaryScreen = false;
        $scope.PageTitle = "Project Team Wizard";
    }


}])



// Define routing for the current application
wizard.config(function ($routeProvider, $locationProvider) {
//    angular.element('#timerBarRow').hide();
//    alert("test message");
    $routeProvider
          .when('/project Team', { templateUrl: 'templates/projectTeam.html' })
          .when('/role', { templateUrl: 'templates/role.html' })
          .when('/dimension', { templateUrl: 'templates/dimension.html' })
          .when('/component', { templateUrl: 'templates/component.html' })
          .when('/finish', { templateUrl: 'templates/finish.html' })
    .otherwise({ redirectTo: 'templates/project Team' })

    $locationProvider.html5Mode(false).hashPrefix("");
})

.directive("myStatus",['$location','$interval', function ($location,$interval) {
    return {
        templateUrl: "../templates/StatusBar.html"
    }


}])


.directive("myClick", function ($location) {
    return {
        restrict: "A",
        scope: {
            stage: "=",
            data: "="
        },
        link: function (scope, element, attribute) {
            var dummy = $location.path();

            scope.$watch('data', function (newValue, oldValue) {
                if (newValue) {
                    refreshStage(scope, element);
                }
            }, true);
            refreshStage(scope, element);



            element.bind("click", function ($scope) {
                // make sure the event target is the div and not the paragraph
                if (event.target.localName == 'p' || event.target.localName == 'span') {
                    if (scope.stage == event.target.parentNode.id) {
                        angular.element(event.target.parentNode).removeClass('stageUnselected').addClass('stageSelected');
                    }
                }
                else {
                    angular.element(event.target).removeClass('stageUnselected').addClass('stageSelected');
                }
            });
        }
    };

})

    /// Delare a directive to process the Next Button click event
.directive("nextClick", function ($location) {
    return {
        scope: {
            data: "="
        },
        link: function (scope, element, attribute) {
            element.bind("click", function ($scope) {
                // Make sure the required fields have been completed
                if (scope.$parent.projectName == "" || scope.$parent.projectDescription == "" || scope.$parent.currentStaffModel == undefined || scope.$parent.currentTemplate == undefined) {
                    if (scope.$parent.projectName == "") {
                        alert("Please enter a Project Team name.")
                    }
                    else if (scope.$parent.projectDescription == "") {
                        alert("Please enter a Project Team description.")
                    }
                    else if (scope.$parent.currentStaffModel == undefined) {
                        alert("Please select the appropriate Staffing Model.")
                    }
                    else{
                        alert("Please select the appropriate Application Type Model.")
                    }
                }
                else
                {
                    scope.$apply(function () {
                    });
                    /*
                    var currentView = $location.path();
                    switch (currentView) {
                        default:
                            
                            scope.$apply(function () {
                                // load the reference component data
                                scope.$parent.$parent.loadReferenceComponent(scope.$parent.$parent.currentTemplate.TypeID);
                                scope.$parent.$parent.loadReferenceActivity(scope.$parent.$parent.currentStaffModel.ModelID);
                                scope.$parent.$parent.currentStage = 5;
                                $location.path("/finish");
                            });
                            break;
                    }
                    */
                }
            });
        }
    };
})

    // Declare a directive to process the previous button click event
.directive("prevClick", function ($location) {
    return {
        link: function (scope, element, attribute) {
            element.bind("click", function ($scope) {
                    var currentView = $location.path();
                    switch (currentView) {
                        default:
                            scope.$apply(function () {
                                scope.$parent.currentStage = 1;
                                $location.path("/project Team");
                            });
                            break;
                    }
            });
        }
    };

});




// Declare a function to refresh the stage graphic formatting based on the current wizard stage
function refreshStage(scope, element) {
    if (scope.data == undefined) {
        //        scope.data = 1;
    }
    if (scope.stage.ID == scope.data) {
        element.removeClass('stageUnselected').removeClass('stageSelected').addClass('stageActive');
    }
    else if (scope.stage.ID < scope.data) {
        element.removeClass('stageUnselected').removeClass('stageActive').addClass('stageSelected');
    }
    else {
        element.removeClass('stageActive').removeClass('stageSelected').addClass('stageUnselected');
    }
}