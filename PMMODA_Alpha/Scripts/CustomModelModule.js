/*jslint white:true, this:true*/
"use strict";
var customModel = angular.module('Model', ["ngRoute",'aStatusBar'])
//var wizard = angular.module('wizard', ["ngRoute"])

.controller('CustomModels', ['$scope',  function ($scope) {
    // Declare a variable to store the current ProjectID
    var c_projectID;
    //    .controller('Navigation', ['$scope', '$http', '$rootScope','$window', function ($scope, $http, $rootScope,$window) {
    // declare an internal variable to store the current right value for each customer model row
    var Rows = [];  // Todo - Update Rows data structure to store the leftmost and rightmost value for the current row

    var topBaseline = 50;
    // Declare a variable to define the vertical offset between rows
    var activityOffset = 25;
    var waterfalTopBaseline = 50;
    var leftBaseline = 50;
    var workDay = 8;
    var scalingFactor = 20;
    var displayWidth = 875;
    //Declare a variable to adjust the week bar height for the top div header and the bottom calendar div row
    var weekBarAdjustment = 100;
    // Declare a variable to store the hiehgt of themodel display portion of the screen
    $scope.displayHeight = '950px';
    // Declare a variable to indicate whether the waterfall display should be visible
    $scope.waterfallVisible = true;
    // Declare a variable to indicate whether the custom model display should be visible
    $scope.customVisible = true;
    // Declare a variable to indicate whether the concurrent display should be visible
    $scope.concurrentVisible = true;
    // Declare a vraiable to indicate the class for the pre-conditin input panel
    $scope.preConditionBorder = "solid 0px black";
    // Declare a vraiable to indicate the class for the pre-conditin input panel
    $scope.postConditionBorder = "solid 0px black";
    // Declare a vraiable to indicate the border settings for the staffing Panel
    $scope.staffingBorder = "solid 0px black";
    // Declare an object to store the staffing data
    $scope.staffingDemandData = [];
    // Declare an object to store the calendar data (i.e. an array of days for the staffing chart
    $scope.calendarData = [];
    // Declare a variable to track the total waterfall width
    var totalWaterfallWidth = 0;
    // Declare a local object to store the graph color array
    $scope.Colors = new Array("orange", "yellowgreen", "#80C1DD", "#639e4b", "#4b9e5c", "#4b9e85", "#4b8d9e", "#4b639e", "#5c4b9e", "#854b9e", "#9e488d", "#9e4b63");
    // Declare a smooting factor. This will expand the resolutin of the graph data to minimize rounding effects and yield a more continuous appearing data set
    var smooth = 10;


    $scope.width = '125px';

    $scope.left = '50px';
    $scope.top = '350px';
    // Declare a variable for the post condition toggle button label
    $scope.postConditionToggleButton = { Displayed: false, Name: 'Edit Postconditions', Top: 50, TopPos: '50px', Left: 1300, LeftPos: '1300px' };
    // Declre a data structure for the post condition input panel
    $scope.postConditionPanel = { Height: 0, HeightPos: '0px', Top: 80, TopPos: '80px' };

    // Declare a variable for the pre condition toggle button label
    $scope.preConditionToggleButton = { Displayed: false, Name: 'Edit Preconditions', Top: 50, TopPos: '50px', Left: 1300, LeftPos: '1300px' };
    // Declre a data structure for the pre condition input panel
    $scope.preConditionPanel = { Height: 0, HeightPos: '0px' };

    // Declare a variable for the staffing toggle button label
    $scope.staffingToggleButton = { Displayed: false, Name: 'Edit Staffing', Top: 80, TopPos: '80px', Left: 1300, LeftPos: '1300px' };
    // Declre a data structure for the staffing input panel
    $scope.staffingPanel = { Left: 925, LeftPos: '925px', Height: 0, HeightPos: '0px', Top: 110, TopPos: '110px' };


    // Declare an array of objects to store the screen position for the model displays
    $scope.displayPositions = [{ Name: 'Waterfall Display', Height: 125, Top: '25px', Visible: true },
                               { Name: 'Custom Display', Height: 250, Top: '150px', Visible: true },
                               { Name: 'Staffing Display', Height: 300, Top: '400px', Visible: true },
                               { Name: 'Concurrent Display', Height: 250, Top: '700px', Visible: true },
                               { Name: 'Calendar Display', Height: 100, Top: '950px', Visible: true }
    ]

    // Declare an array of objects to store the screen position for the edit panels
    $scope.editPanelPositions = [{ Name: 'Precondition', Height: 500, Top: '50', TopPos: '50px', Visible: false },
                               { Name: 'Postcondition', Height: 500, Top: '550', TopPos: '550px', Visible: false },
                               { Name: 'Staffing', Height: 350, Top: '900', TopPos: '900px', Visible: false }
    ]

    // Declare a data structure to store the staffing information
    $scope.Staff = [];

    $scope.Activities = [];


    $scope.Activities2 = [];

    $scope.customActivityGraphics = [
        { Left: 0, LeftPos: '0px', Top: 50, TopPos: '50px', Width: '120', WidthPos: '120px', Color: 'yellowgreen', Delayed: false, BaseWidth: '0', DelayWidth: '0', BaseStaffRatio: 1, Row: 0 },   // Functional Design
        { Left: 0, LeftPos: '0px', Top: 75, TopPos: '75px', Width: '200', WidthPos: '200px', Color: 'orange', Delayed: false, BaseWidth: '0', DelayWidth: '0', BaseStaffRatio: 1, Row: 0 },        // Development
        { Left: 0, LeftPos: '0px', Top: 100, TopPos: '100px', Width: '200', WidthPos: '200px', Color: 'orange', Delayed: false, BaseWidth: '0', DelayWidth: '0', BaseStaffRatio: 1, Row: 0 },       // Validation
        { Left: 0, LeftPos: '0px', Top: 125, TopPos: '125px', Width: '60', WidthPos: '60px', Color: 'orange', Delayed: false, BaseWidth: '0', DelayWidth: '0', BaseStaffRatio: 1, Row: 0 },        // Graphical Design
        { Left: 0, LeftPos: '0px', Top: 125, TopPos: '125px', Width: '50', WidthPos: '50px', Color: 'orange', Delayed: false, BaseWidth: '0', DelayWidth: '0', BaseStaffRatio: 1, Row: 0 },        // Documentation
        { Left: 0, LeftPos: '0px', Top: 100, TopPos: '100px', Width: '80', WidthPos: '80px', Color: 'orange', Delayed: false, BaseWidth: '0', DelayWidth: '0', BaseStaffRatio: 1, Row: 0 },        // Acceptance
    ];

    $scope.waterfallActivityGraphics = [];

    $scope.concurrentActivityGraphics = [];


    $scope.preConditions = [];


    $scope.Postconditions = [[]];
    //    $scope.Postconditions = [[], [], [], [], [], []];


    // Declre a data structure to store the preconditions for the current set of activities
    $scope.testConditions = [{ ActivityID: 15, Name: 'Functional Design', DependentID: 12, CompletionPercentage: 75 },
                            { ActivityID: 17, Name: 'Functional Design', DependentID: 12, CompletionPercentage: 75 },
                            { ActivityID: 17, Name: 'Development', DependentID: 15, CompletionPercentage: 25 },
                            { ActivityID: 14, Name: 'Functional Design', DependentID: 12, CompletionPercentage: 50 },
                            { ActivityID: 18, Name: 'Functional Design', DependentID: 12, CompletionPercentage: 100 },
                            { ActivityID: 18, Name: 'Development', DependentID: 15, CompletionPercentage: 100 },
                            { ActivityID: 22, Name: 'Documentation', DependentID: 18, CompletionPercentage: 100 }];


    //    $scope.testConditions2 = [];

    $scope.newRecord = [];

    $scope.newPostCondition = [];

//    $scope.ActivityList = [{ ID: 0, Name: 'Functional Design' },
//                            { ID: 1, Name: 'Development' },
//                            { ID: 2, Name: ' Validation' },
//                            { ID: 3, Name: 'Graphical Design' },
//                            { ID: 4, Name: 'Documentation' },
//                            { ID: 5, Name: 'Acceptance' }];

    $scope.Calendar = [{ ID: 1, Left: 50, LeftPos: '50px', Width: 50, WidthPos: '50px', Top: 50, TopPos: '50px' },
                       { ID: 2, Left: 101, LeftPos: '101px', Width: 50, WidthPos: '50px', Top: 50, TopPos: '50px' },
                        { ID: 3, Left: 152, LeftPos: '152px', Width: 50, WidthPos: '50px', Top: 50, TopPos: '50px' },
                        { ID: 4, Left: 203, LeftPos: '203px', Width: 50, WidthPos: '50px', Top: 50, TopPos: '50px' }]

    $scope.updateConditionHandler = function (activityIndex, index) {
        var dummy = "text";
        // Update the CompletionPercentage for the current precondition
        updateCondition(c_projectID, $scope.preConditions[activityIndex][index], 1)
    }

    $scope.updatePostConditionHandler = function (activityIndex, index) {
        var dummy = "text";
        // Update the CompletionPercentage for the current precondition
        updateCondition(c_projectID, $scope.Postconditions[activityIndex][index], 2)
    }


    var updateCondition = function (projectID, item, conditionType) {

        // Declare a Deferred construct to return from this method
        var promise;
        var targetUrl;
        // Declare a resonse structure to return from this object
        var response = new Response();

        var condition = new Object();
        condition.ProjectID = projectID;
        condition.ActivityID = item.ActivityID;
        condition.Name = item.Name;
        condition.DependencyID = item.DependentID;
        condition.CompletionPercentage = item.CompletionPercentage;
        condition.ConditionTypeID = conditionType;

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }


        targetUrl = ConditionUrl + '?projectID=' + c_projectID;

        promise = $.ajax({
            url: targetUrl,
            type: 'PUT',
            dataType: 'json',
            data: condition,
            headers: headers,
            success: function (data, txtStatus, xhr) {
            },
            error: function (xhr, textStatus, errorThrown) {
                response.Status = xhr.status;
                errorHandler(response, 901);
            }
        });

        return (promise);

    }

    // Declare a function to initialize the activity and staffing data
    $scope.InitializeRefferenceData = function () {
        var ProjectSummaryUrl = "/api/ProjectSummary";
        var targetUrl;
        // declre an array to store staffing data
        var c_staffing = [];
        //        var projectID;
        var orgID;
        var token = sessionStorage.getItem(tokenKey);
        var headers = {};

        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // Get the current project ID
        c_projectID = getCookieProjectID();
        // Get the current Org ID from the cookie
        orgID = getCookieOrgID();

        // Initialize the web service address
        targetUrl = ProjectSummaryUrl + "?ProjectID=" + c_projectID + "&OrgID=" + orgID

        // Declare a Deferred construct to return from this method
        var activityResponse = new Response();

        // Call the target web service
        activityResponse.Promise = $.ajax({
            url: targetUrl,
            type: 'GET',
            dataType: 'json',
        }).done(function (data, txtStatus, jqXHR) {
            renderActivityData(data);
        }).fail(function (xhr, textStatus, errorThrown) {
            alert("Insert Error");
        });


        // Declare a Deferred construct to return from this method
        var staffingResponse = new Response();

        // Initilaize the target URL for the next web service all
        targetUrl = StaffUrl + "/" + c_projectID;

        staffingResponse.Promise = $.ajax({
            url: targetUrl,
            type: 'GET',
            dataType: 'json',
            headers: headers,
        }).done(function (data, txtStatus, jqXHR) {
            //            alert("Insert Success");
            renderStaffingData(data);
        }).fail(function (xhr, textStatus, errorThrown) {
            errorHandler(xhr, 1303);
        });



        activityResponse.Promise.done(function () {

            // Load the condition data once the activity data is populated
            // Declare a Deferred construct to return from this method
            var conditionResponse = new Response();

            // Initilaize the target URL for the next web service all
            targetUrl = ConditionUrl + "?ProjectID=" + c_projectID;

            conditionResponse.Promise = $.ajax({
                url: targetUrl,
                type: 'GET',
                dataType: 'json',
                headers: headers,
            }).done(function (data, txtStatus, jqXHR) {
                //            alert("Insert Success");
                renderConditionData(data);
            }).fail(function (xhr, textStatus, errorThrown) {
                errorHandler(xhr, 1303);
            });

            staffingResponse.Promise.done(function () {
                conditionResponse.Promise.done(function () {
                    mergeSetupData();
                });
            });
        });
    };

    var renderConditionData = function (data) {
        var index = 0;
        // declare a local object to store the activity index
        var activityIndex = -1;
        var dummy = 'text';
        $scope.testConditions.length = 0;
//        $scope.Postconditions.length = 0;

        // loop over the data and copy the pre-conditions into the Test Conditionss collection
        while (index < data.length) {
            {
                // Create a new condition object
                var condition = new Object();
                condition.ActivityID = data[index].ActivityID;
                condition.Name = data[index].DependencyName;
                condition.DependentID = data[index].DependencyID;
                condition.CompletionPercentage = data[index].CompletionPercentage;

                // get the Activity index for the current activity and make sure the Postcondition array is initialized
                activityIndex = getActivityIndex(condition.ActivityID);

                // filter for preconditions
                if (data[index].ConditionTypeID == 1) {
                    $scope.testConditions.push(condition);
                }
                else {
                    // Load the post condition data
                    if (activityIndex >= 0) {
                        $scope.Postconditions[activityIndex].push(condition);
                    }
                }
                index++;
            }
        }
    }


    var renderActivityData = function (data) {
        var index = 0;
        var dummy = "text";
        // reset the ACtivities collection
        $scope.Activities.length = 0;
        // reset the post condition collection
        $scope.Postconditions.lenght = 0;

        // Loop over the returned data set
        while (index < data.ActivitySummary.length) {
            var newActivity = {};
            // filter inactive records
            newActivity.ID = data.ActivitySummary[index].ActivityID; //ActivityID
            newActivity.Name = data.ActivitySummary[index].ActivityName;
            newActivity.Effort = data.ActivitySummary[index].effort;
            newActivity.MasterRoleID = data.ActivitySummary[index].MasterRoleID;
            // Temporarily assign a fixed value to overhead
            newActivity.Overhead = .25;
            $scope.Activities.push(newActivity);
            // initialize the post condition data structure
            $scope.Postconditions[index] = [];
            index++;
        }
    };

    var renderStaffingData = function (data) {
        var index = 0;
        var dummy = "text";

        // reset the staffing data
        $scope.Staff.length = 0;
        // loop over the staffing data
        while (index < data.length) {
            var newStaff = {};
            newStaff.MasterRoleID = data[index].MasterRoleID;
            newStaff.RoleName = data[index].RoleName;
            newStaff.Count = data[index].Count;
            $scope.Staff.push(newStaff);
            index++;
        }
    }

    var mergeSetupData = function () {
        var index = 0;
        var index2;
        var dummy = "text";
        // Loop over the activities and merge the data
        while (index < $scope.Activities.length) {
            // Get the staffing record for the current role
            index2 = 0;
            while (index2 < $scope.Staff.length) {
                if ($scope.Activities[index].MasterRoleID == $scope.Staff[index2].MasterRoleID) {
                    $scope.Activities[index].StaffCount = $scope.Staff[index2].Count;
                    $scope.Activities[index].RoleName = $scope.Staff[index2].RoleName;
                    break;
                }
                index2++;
            }
            index++;
        }

        $scope.refreshScreen();

    }

    $scope.InitializeRefferenceData();


    // declare a function to toggle visibility of the waterfall display
    $scope.toggleWaterfall = function () {
        var control = document.getElementById("waterfallArray");
        if ($scope.waterfallVisible) {
            $scope.waterfallVisible = false;
            control.src = "../images/down arrow.png";
            $scope.displayPositions[0].Visible = false;
        }
        else {
            $scope.waterfallVisible = true;
            control.src = "../images/up arrow.png";
            $scope.displayPositions[0].Visible = true;
        }
        updatePositions();
    }

    // Declare a function to update the display position data based on which displays are visible
    var updatePositions = function () {
        var index = 0;
        var currentTop = 25;

        while (index < $scope.displayPositions.length) {
            $scope.displayPositions[index].Top = currentTop + 'px';
            if ($scope.displayPositions[index].Visible) {
                currentTop += $scope.displayPositions[index].Height;
            }
            else {
                // Don't add a div allowance for the Staffing display
                if (index != 2) {
                    currentTop += 30;
                }
            }

            index++;
        }
        $scope.displayHeight = currentTop - weekBarAdjustment;
    }

    // Declare a function to update the display position data based on which displays are visible
    $scope.updateEditPanelPositions = function () {
        var index = 0;
        var currentTop = 60;

        while (index < $scope.editPanelPositions.length) {
            $scope.editPanelPositions[index].Top = currentTop;
            $scope.editPanelPositions[index].TopPos = currentTop + 'px';
            if ($scope.editPanelPositions[index].Visible) {
                currentTop += $scope.editPanelPositions[index].Height + 35;
            }
            else {
                currentTop += 30;
            }

            // UPdate the toggle button also
            switch (index) {
                case 0:
                    $scope.preConditionToggleButton.Top = $scope.editPanelPositions[index].Top - 35;
                    $scope.preConditionToggleButton.TopPos = $scope.preConditionToggleButton.Top + 'px';
                    break;
                case 1:
                    $scope.postConditionToggleButton.Top = $scope.editPanelPositions[index].Top - 40;
                    $scope.postConditionToggleButton.TopPos = $scope.postConditionToggleButton.Top + 'px';
                    break;
                case 2:
                    $scope.staffingToggleButton.Top = $scope.editPanelPositions[index].Top - 35;
                    $scope.staffingToggleButton.TopPos = $scope.staffingToggleButton.Top + 'px';
                    break;

            }

            index++;
        }
        //        $scope.displayHeight = currentTop - weekBarAdjustment;
    }


    // declare a function to toggle visibility of the waterfall display
    $scope.toggleCustom = function () {
        var control = document.getElementById("customVisibleArrow");
        if ($scope.customVisible) {
            $scope.customVisible = false;
            control.src = "../images/down arrow.png";
            $scope.displayPositions[1].Visible = false;
            $scope.displayPositions[2].Visible = false;
        }
        else {
            $scope.customVisible = true;
            control.src = "../images/up arrow.png";
            $scope.displayPositions[1].Visible = true;
            $scope.displayPositions[2].Visible = true;
        }
        updatePositions();
    }

    // declare a function to toggle visibility of the concurrent display
    $scope.toggleConcurrent = function () {
        var control = document.getElementById("concurrentVisibleArrow");
        if ($scope.concurrentVisible) {
            $scope.concurrentVisible = false;
            control.src = "../images/down arrow.png";
            $scope.displayPositions[3].Visible = false;
        }
        else {
            $scope.concurrentVisible = true;
            control.src = "../images/up arrow.png";
            $scope.displayPositions[3].Visible = true;
        }
        updatePositions();
    }


    // Declare a function to remove the specified dependency from the preconditions collection
    $scope.deleteDependency = function (activityID, dependencyIndex) {
        var index;
        // Find the test Condition record corresponding to the supplied Activy and Dependency index
        index = getActivityIndex(activityID);
        if (index != undefined) {
            var DependencyID = $scope.preConditions[index][dependencyIndex].DependentID;
            removeCondition(activityID, DependencyID);
            $scope.refreshScreen();
        }

    }


    // Declare a function to remove the specified post condition from the post condition collection
    $scope.deletePostCondition = function (activityID, dependencyIndex) {
        var index;
        // Find the test Condition record corresponding to the supplied Activy and Dependency index
        index = getActivityIndex(activityID);
        if (index != undefined) {
            // Get the dependency ID for the current record
            var DependencyID = $scope.Postconditions[index][dependencyIndex].DependentID;

            $scope.Postconditions[index].splice(dependencyIndex, 1);

            // remove the selected condition from the DB
            deleteCondition(c_projectID, activityID, DependencyID, 2)


            //            removePostCondition(activityID, DependencyID);
            $scope.refreshScreen();
        }

    }

    var getActivityIndex = function (ID) {
        var index = 0;
        var result = undefined;

        //loop over the Activities collection and return he index of the corresponding ID
        while (index < $scope.Activities.length) {
            if ($scope.Activities[index].ID == ID) {
                result = index;
                break;
            }
            index++;
        }
        return (result);
    }

    var removePostCondition = function (activityID, dependencyID) {
        var index = 0;
        var index2 = 0;

        while (index < $scope.Postconditions.length) {
            if ($scope.Postconditions[index].ActivityID == activityID) {
                // Check for matching dependency record now
                // loop over the number of dependency records
                while (index2 < $scope.Postconditions[index].length) {
                    if ($scope.Postconditions[index][index2].DependentID = dependencyID) {
                        $scope.Postconditions[index].splice(index2, 1);

                    }
                    index2++;
                }
            }
            index++;
        }
    }


    var removeCondition = function (activityID, dependencyID) {
        var index = 0;

        while (index < $scope.testConditions.length) {
            if ($scope.testConditions[index].ActivityID == activityID && $scope.testConditions[index].DependentID == dependencyID) {
                $scope.testConditions.splice(index, 1);
            }
            index++;
        }

        // remove the selected condition from the DB
        deleteCondition(c_projectID, activityID, dependencyID,1)
    }

    // Declare a function to add a newly defined pre-coondition on the specified activity
    $scope.addDependency = function (index) {
        // declare a locla object to store teh preconditions for the current activity
        var preconditions = [];
        var status = true;
        // validate the input range for the Compoletion Percentage
        if ($scope.newRecord[index].CompletionPercentage < 0) {
            alert("The entered value for Completion Percentage is less than the allowed minimum (0). No record will be saved.");
            status = false;
            $scope.newRecord[index].CompletionPercentage = 0;
        }
        else if ($scope.newRecord[index].CompletionPercentage > 100) {
            alert("The entered value for Completion Percentage is greater than the allowed maximum (1). No record will be saved.");
            status = false;
            $scope.newRecord[index].CompletionPercentage = 100;
        }
        // Make sure that the user does not add a dependency on itself
        if ($scope.newRecord[index].Dependency.ID == $scope.Activities[index].ID) {
            alert("You cannot create a dependency between an activity and itself. No record will be saved.");
            status = false;
        }

        // Make sure no dependent activity is included twice
        preconditions = $scope.testConditions.filter(filterConditions, $scope.Activities[index].ID);
        // Loop over the preconditions and make sure the supplied dependentID is not already present
        var condIndex = 0;
        while (condIndex < preconditions.length) {
            if (preconditions[condIndex].DependentID == $scope.newRecord[index].Dependency.ID) {
                alert("The entered dependency already exists for this activity. No record will be saved.");
                $scope.newRecord[index] = undefined;
                status = false;
                break;
            }
            condIndex++;
        }
        if (status) {
            // check for circular dependencies
            status = checkDependency($scope.Activities[index].ID, $scope.Activities[index].ID, $scope.newRecord[index].Dependency.ID);
            if (!status) {
                alert("The requested dependency would create a circular dependency. No record will be saved.");
                $scope.newRecord[index] = undefined;
            }
        }


        // If there are no data issues with the current selection apply the change
        if (status) {
            var newDependency = { ActivityID: $scope.Activities[index].ID, Name: $scope.newRecord[index].Dependency.Name, DependentID: $scope.newRecord[index].Dependency.ID, CompletionPercentage: $scope.newRecord[index].CompletionPercentage };
            $scope.testConditions.push(newDependency);
            // Write the new record to the database
            saveNewCondition(newDependency, 1);
            $scope.newRecord[index] = undefined;
            var index1 = 0;
            $scope.refreshScreen();
        }
    }

    // Declre a method to save a new condition to the database
    var saveNewCondition = function (item, conditionType) {

        // Declare a Deferred construct to return from this method
        var promise;
        var targetUrl;
        // Declare a resonse structure to return from this object
        var response = new Response();

        var condition = new Object();
        condition.ProjectID = c_projectID;
        condition.ActivityID = item.ActivityID;
        condition.Name = item.Name;
        condition.DependencyID = item.DependentID;
        condition.CompletionPercentage = item.CompletionPercentage;
        condition.ConditionTypeID = conditionType;

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        targetUrl = ConditionUrl;

        promise = $.ajax({
            url: targetUrl,
            type: 'POST',
            dataType: 'json',
            data: condition,
            headers: headers,
            success: function (data, txtStatus, xhr) {
            },
            error: function (xhr, textStatus, errorThrown) {
                response.Sttus = xhr.status;
                errorHandler(resposne, 901);
            }
        });

        return (promise);
    }

    // Declre a method to save a new condition to the database
    var deleteCondition = function (projectID,ActivityID,DependencyID, conditionType) {

        // Declare a Deferred construct to return from this method
        var promise;
        var targetUrl;
        // Declare a resonse structure to return from this object
        var response = new Response();

        var condition = new Object();
        condition.ProjectID = projectID;
        condition.ActivityID = ActivityID;
        condition.DependencyID = DependencyID;
        condition.ConditionTypeID = conditionType;

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        targetUrl = ConditionUrl +'?projectID=' + projectID;

        promise = $.ajax({
            url: targetUrl,
            type: 'DELETE',
            dataType: 'json',
            data: condition,
            headers: headers,
            success: function (data, txtStatus, xhr) {
            },
            error: function (xhr, textStatus, errorThrown) {
                response.Status = xhr.status;
                errorHandler(response, 901);
            }
        });

        return (promise);
    }


    var errorHandler = function (response, value) {
        alert("error encountered: " + response.Status);
    }

    // Declare a function to check for circular dependencies in the preconditions
    var checkDependency = function (rootID, activityID, dependencyID) {
        // declare a locla object to store teh preconditions for the current activity
        var preconditions = [];
        // Declare a variable to use looping over depdencies
        var index = 0;
        var status = true;

        // Get the set of dependencies for the current activity
        preconditions = $scope.testConditions.filter(filterConditions, dependencyID);
        // loop over the dependencies
        while (index < preconditions.length) {
            // Check to see if the current depenency is a reference to the original activity
            if (preconditions[index].DependentID == activityID) {
                status = false;
                break;
            }
            else if (preconditions[index].DependentID == rootID) {
                status = false;
                break;
            }

            else {
                // check dependencies for the remaining dependencies and make sure they don't eventually reference back to this activity
                status = checkDependency(rootID, rootID, preconditions[index].DependentID);
                if (!status) {
                    // a circular dependency was found
                    break;
                }
            }
            index++;
        }
        return (status);
    }



    // Declare a function to add a newly defined post-coondition on the specified activity
    $scope.addPostCondition = function (index) {
        var status = true;
        // declare a local array to use for postconditions
        var postconditions = [];
        // validate the input range for the Compoletion Percentage
        if ($scope.newPostCondition[index].CompletionPercentage < 0) {
            alert("The entered value for Completion Percentage is less than the allowed minimum (0). No record will be saved.");
            status = false;
            $scope.newPostCondition[index].CompletionPercentage = 0;
        }
        else if ($scope.newPostCondition[index].CompletionPercentage > 100) {
            alert("The entered value for Completion Percentage is greater than the allowed maximum (1). No record will be saved.");
            status = false;
            $scope.newPostCondition[index].CompletionPercentage = 100;
        }
        // Make sure that the user does not add a dependency on itself
        if ($scope.newPostCondition[index].Dependency.ID == $scope.Activities[index].ID) {
            alert("You cannot create a dependency between an activity and itself. No record will be saved.");
            status = false;
        }

        // Make sure no dependent activity is included twice
        if (!status) {
            postconditions = getPostConditionsByActivity($scope.Activities[index].ID);
            // Loop over the preconditions and make sure the supplied dependentID is not already present
            var condIndex = 0;
            while (condIndex < postconditions.length) {
                if (postconditions[condIndex].DependentID == $scope.newPostCondition[index].Dependency.ID) {
                    alert("The entered dependency already exists for this activity. No record will be saved.");
                    $scope.newPostCondition[index] = undefined;
                    status = false;
                    break;
                }
                condIndex++;
            }
        }

        // check for circular dependencies
        if (!status) {
            status = checkPostConditionDependency($scope.Activities[index].ID, $scope.Activities[index].ID, $scope.newPostCondition[index].Dependency.ID);
            if (!status) {
                alert("The requested dependency would create a circular dependency. No record will be saved.");
                $scope.newPostCondition[index] = undefined;
            }
        }


        // If there are not data issues with the current selection apply the change
        if (status) {
            var newDependency = { ActivityID: $scope.Activities[index].ID, Name: $scope.newPostCondition[index].Dependency.Name, DependentID: $scope.newPostCondition[index].Dependency.ID, CompletionPercentage: $scope.newPostCondition[index].CompletionPercentage };
            $scope.Postconditions[index].push(newDependency)
            //            $scope.testConditions.push(newDependency);
            saveNewCondition(newDependency, 2);
            $scope.newPostCondition[index] = undefined;
            var index1 = 0;
            $scope.refreshScreen();
        }
    }

    // Declare a function to check for circular dependencies in the post conditions
    var checkPostConditionDependency = function (rootID, activityID, dependencyID) {
        // declare a locla object to store teh preconditions for the current activity
        var postconditions = [];
        // Declare a variable to use looping over depdencies
        var index = 0;
        var status = true;

        // Get the set of dependencies for the current activity
        postconditions = getPostConditionsByActivity(dependencyID);
        // loop over the dependencies
        while (index < postconditions.length) {
            // Check to see if the current depenency is a reference to the original activity
            if (postconditions[index].DependentID == activityID) {
                status = false;
                break;
            }
            else if (postconditions[index].DependentID == rootID) {
                status = false;
                break;
            }

            else {
                // check dependencies for the remaining dependencies and make sure they don't eventually reference back to this activity
                status = checkDependency(rootID, rootID, postconditions[index].DependentID);
                if (!status) {
                    // a circular dependency was found
                    break;
                }
            }
            index++;
        }
        return (status);
    }


    $scope.updatePage = function () {
        $scope.topBaseline = 250;
        $scope.refreshScreen();
    }

    // Declare a function to refresh the screen content to include all data changes
    $scope.refreshScreen = function () {
        var index = 0;

        $scope.Activities2.length = 0;
        $scope.sortDependency();
        // Sort the post conditions to match the Activities
        $scope.sortPostConditions();

        // render teh waterfall view
        $scope.renderWaterfallModel();

        $scope.renderConcurrentModel();

        $scope.refreshCalendar();

        // Initialize the row settings to 0 for all records
        Rows.length = 0;
        while (index < $scope.customActivityGraphics.length) {
            $scope.customActivityGraphics[index].Row = 0;
            // initialize the left position
            $scope.customActivityGraphics[index].Left = leftBaseline;
            $scope.customActivityGraphics[index].LeftPos = leftBaseline + 'px';
            index++;
        }

        // reset the customActivityGraphics collection
        $scope.customActivityGraphics.length = 0;
        index = 0;
        // loop over the number of defined activiities
        while (index < $scope.Activities.length) {
            $scope.getLeft(index);
            $scope.getWidth(index, $scope.Activities[index].ID);
            index++;
        }
        index = 0;
        // loop over the number of defined activities
        while (index < $scope.Activities.length) {
            $scope.getTop(index);
            index++;
        }

        $scope.renderStaffingGraph();
        $scope.updateEditPanelPositions();
        $scope.$apply();
    };

    // Declare a function that will regenerate the staffing demand collection based on the current work distribution
    var refreshstaffingDemandData = function () {
        var index = 0;
        // declare a variable to track the start date for the current activity
        var startDate;
        // Declare a variable to track the impacted staffing level
        var deratedStaffing = 0;
        // Declare a variable to track the date when an activity is unblocked
        var unblockedDate;
        // Declare a variable to track the base duration of the current activity. This is the part unaffected by any post conditions
        var baseDuration;
        // Declare a variable to track the delayed duration due to any post conditions
        var delayDuration;
        var days = 0;
        // declare an array to store the activity specific data
        var activityCalendar = [];
        // Declare a local variable to hold the index specific staff count
        var staff;

        // loop over the current activities
        while (index < $scope.Activities.length) {
            // calculate the start date in days after project kickoff
            startDate = (($scope.customActivityGraphics[index].Left - leftBaseline) / scalingFactor) * smooth;
            startDate = Math.round(startDate);
            // calculate the activity duration
            if ($scope.customActivityGraphics[index].Delayed) {
                baseDuration = ($scope.customActivityGraphics[index].BaseWidth / scalingFactor) * smooth;
                baseDuration = Math.round(baseDuration);
                delayDuration = ($scope.customActivityGraphics[index].DelayWidth / scalingFactor) * smooth;
                delayDuration = Math.round(delayDuration);
            }
            else {
                baseDuration = ($scope.customActivityGraphics[index].Width / scalingFactor) * smooth;
                baseDuration = Math.round(baseDuration);
            }
            // Build the array
            activityCalendar.length = 0;
            days = 0;

            // Get the staff count for the current activity
            staff = $scope.Staff[getStaffCount($scope.Activities[index].MasterRoleID)].Count;

            // Loop over the days in the calendar
            while (days < totalWaterfallWidth * smooth) {
                // build the x-axis data array on the first iteration
                if (index == 0) {
                    $scope.calendarData.push(days);
                }
                // check to see if this activity was delayed by a post condition
                if ($scope.customActivityGraphics[index].Delayed) {
                    if (days < startDate) {
                        activityCalendar.push(0);
                    }
                    else if (days >= startDate && days <= startDate + baseDuration) {
                        activityCalendar.push(staff * $scope.customActivityGraphics[index].BaseStaffRatio);
                    }
                    else if (days >= startDate + baseDuration && days <= startDate + baseDuration + delayDuration) {
                        activityCalendar.push(staff);
                    }
                    else {
                        activityCalendar.push(0);
                    }
                }
                else {
                    if (days < startDate) {
                        activityCalendar.push(0);
                    }
                    else if (days >= startDate && days <= startDate + baseDuration) {
                        activityCalendar.push(staff);
                    }
                    else {
                        activityCalendar.push(0);
                    }
                }

                days++;
            }
            $scope.staffingDemandData[index] = [];
            $scope.staffingDemandData[index] = activityCalendar.slice();
            index++;
        }
    }

    $scope.renderStaffingGraph = function () {
        var canvas;
        var index = 0;

        refreshstaffingDemandData();

        canvas = document.getElementById("lineChartCanvas");
        var chart = new StaffingChart(canvas, 0, 0, 890, 300, scalingFactor / 10);
        // initialize the axis data
        chart.AxisData = $scope.calendarData;
        index = 0;
        // loop over activities and add teh activity data
        while (index < $scope.Activities.length) {
            chart.AddData($scope.staffingDemandData[index]);
            index++;
        }

        // Draw teh current data on the chart
        chart.Draw();
    };


    // Declare a function to sort the PostConditions in the same activity order as the Activities
    $scope.sortPostConditions = function () {
        // Declare a local array to store the sorted post conditions
        var sortedPostConditions = [];
        var tempArray = [];
        // Declare an index to loop over activities
        var index = 0;

        while (index < $scope.Activities.length) {
            sortedPostConditions[index] = [];
            tempArray.length = 0;
            tempArray = getPostConditionsByActivity($scope.Activities[index].ID);
            if (tempArray.length > 0) {
                sortedPostConditions[index] = tempArray.slice();
            }
            index++;
        }
        // reassign the temp array to the Pastconditions array
        $scope.Postconditions.length = 0;
        $scope.Postconditions = sortedPostConditions.slice();
    }

    // Declare a function to return the post conditions corresonding to the passed in activity ID
    var getPostConditionsByActivity = function (activityID) {
        var index = 0;
        var condIndex;
        var results = [];

        // loop over activiites
        while (index < $scope.Postconditions.length) {
            // Loop over conditions
            condIndex = 0;
            while (condIndex < $scope.Postconditions[index].length) {
                if ($scope.Postconditions[index][condIndex].ActivityID == activityID) {
                    results.push($scope.Postconditions[index][condIndex]);
                }
                condIndex++;
            }
            index++;
        }
        return (results);
    }

    // Declare a function to find any dependencies on the current activity
    $scope.findDependencies = function (ActivityID) {
        var index1 = 0;
        var index2;
        var result = new Array();
        // Loop over the test conditions
        while (index1 < $scope.testConditions.length) {
            //Check to see if the passed in record is dependent on the current activity
            if ($scope.testConditions[index1].ActivityID == ActivityID) {
                result.push($scope.testConditions[index1]);
            }
            //            }
            index1++;
        }
        return (result)
    }


    // Declare a function to sort activities based on dependency sequence
    $scope.sortDependency = function () {
        var index1 = 0;
        var index2;
        var index3;
        var copy = false;
        var dependencies;
        var results;
        // Loop over the Activities
        while (index1 < $scope.Activities.length) {
            // Get the list of activities this activity is depenend on
            results = $scope.findDependencies($scope.Activities[index1].ID);
            if (results.length == 0) {
                // Add the current activity to the new collection
                $scope.Activities2.push($scope.Activities[index1]);
                index1++;
                continue;
            }
            else {


                // Loop over the activities in the results collection
                index2 = 0;
                while (index2 < results.length) {
                    // Check the current activity and see if it is included in the results list. If it is then add this
                    // activity new activity list

                    // Loop over the remaining activities and see if the the current dependency is later in the collection
                    index3 = index1;
                    while (index3 < $scope.Activities.length) {
                        if (results[index2].DependentID == $scope.Activities[index3].ID) {
                            $scope.activityPush($scope.Activities[index3]);
                            break;
                        }
                        index3++
                    }
                    index2++;
                }
                // Add the current activity to the resorted collection TODO - This needs to be modified to use the activiytPush method to avoid duplicates
                $scope.activityPush($scope.Activities[index1]);
                //                $scope.Activities2.push($scope.Activities[index1]);
            }
            index1++;
        }

        $scope.Activities = $scope.Activities2.slice();
        // Generate the pre conditions array for the ng-repeat option
        index1 = 0;
        // reset the preconditions
        $scope.preConditions.length = 0;
        while (index1 < $scope.Activities.length) {
            $scope.preConditions[index1] = $scope.testConditions.filter(filterConditions, $scope.Activities[index1].ID)
            index1++;
        }
    }

    // Declare a function to filter preconditions based on the current activityID
    var filterConditions = function (value, index, data) {
        //        var index = 0;
        return data[index].ActivityID == this;
    }

    /// Declare a function to insert an activity record into the final record set. This function prevents duplicates
    $scope.activityPush = function (activity, index) {
        var index1 = 0;
        var found = false;
        var newValue;
        var oldValue;

        // Loop over the current records and make sure this one is not already there
        while (index1 < $scope.Activities2.length) {
            if ($scope.Activities2[index1].ID == activity.ID) {
                found = true;
            }
            index1++;
        }
        // Only insert the new record if it is not already there
        if (!found) {
            newValue = activity;
            // reset index1 for the insert operation
            if (index != undefined) {
                index1 = index;
                while (index1 <= $scope.Activities2.length) {
                    //                if(newValue != undefined)
                    oldValue = $scope.Activities2[index1];
                    $scope.Activities2[index1] = newValue;
                    newValue = oldValue;
                    index1++;
                }
            }
            else {
                $scope.Activities2.push(newValue);
            }
        }

    }

    // Update to reflect the modified testConditions structure
    $scope.getLeft = function (index) {
        var maxLeft = 0;
        var counter = 0;
        var left = 0;
        var currentDependencyID;
        var prevWidth = 0;
        var refActivity = undefined;

        // Declare a local object to store the new ActivityGraphic
        var newGraphic;
        // Initialize the new graphic record
        newGraphic = { ActivityID: $scope.Activities[index].ID, Left: leftBaseline, LeftPos: leftBaseline + 'px', Top: topBaseline, TopPos: topBaseline + 'px', Width: 0, Color: 'yellowgreen', Delayed: false, Row: 0 };

        // loop over the preconditions and check those applicable to the current object
        while (counter < $scope.testConditions.length) {
            // check to see if the current condition applies to the current activity
            if ($scope.testConditions[counter].ActivityID == $scope.Activities[index].ID) {
                currentDependencyID = $scope.testConditions[counter].DependentID;
                refActivity = getActivityGraphic(currentDependencyID);
                if (refActivity != undefined) {
                    prevWidth = refActivity.Width
                    left = refActivity.Left +
                        prevWidth * ($scope.testConditions[counter].CompletionPercentage / 100) + 1;
                    if (left > maxLeft) {
                        newGraphic.Left = left;
                        newGraphic.LeftPos = left + 'px';
                        maxLeft = left;
                    }
                }
            }
            counter++;
        }
        $scope.customActivityGraphics.push(newGraphic);

        //        return ($scope.customActivityGraphics[index].Left + 'px');
    }

    var getActivityGraphic = function (ID) {
        var index = 0;
        var result = undefined;

        // Loop over the Activity graphics and return the record that matches the current ID
        while (index < $scope.customActivityGraphics.length) {
            if ($scope.customActivityGraphics[index].ActivityID == ID) {
                result = $scope.customActivityGraphics[index];
                break;
            }
            index++;
        }

        return (result);
    }

    var getStaffCount = function (masterRoleID) {
        var index = 0;
        var selectedIndex = -1;

        while (index < $scope.Staff.length) {
            if ($scope.Staff[index].MasterRoleID == masterRoleID) {
                selectedIndex = index;
                break;
            }
            index++;
        }

        return (selectedIndex);
    }

    $scope.getWidth = function (index, currentID) {
        var counter = 0;
        var width;
        // declare a variable to store the dependent ID
        var dependentID;
        var right = 0;
        var maxRight = 0;
        var refActivity;
        // declare a variable to store the base width of the overlapping activity region
        var baseWidth;
        // declare a variable to store the delay offset due to a ost condition
        var delayOffset = 0;
        // Declare a variable to store teh derated staff count for the overlapping portion of delayed activities
        var staffRatio = 0;
        //declare an object to store the post conditions for the current activity
        var postConditions = [];
        var staff;

        // Get the staff count for the current activity
        staff = $scope.Staff[getStaffCount($scope.Activities[index].MasterRoleID)].Count;

        // Calculate the activity width based on the total effort and the current staffing count
        width = ($scope.Activities[index].Effort / ((1 - $scope.Activities[index].Overhead) * staff * workDay)) * scalingFactor;


        // get the post conditions for the current activity
        postConditions = $scope.Postconditions[index];
        // loop over the applicable post conditions
        var condIndex = 0;
        $scope.customActivityGraphics[index].Delayed = false;;
        while (condIndex < postConditions.length) {
            // Check to see if this condition would length the task duration
            // Calculate the target end date
            refActivity = getActivityGraphic(postConditions[condIndex].DependentID);
            //                delayOffset = width * (postConditions[condIndex].CompletionPercentage / 100);
            right = refActivity.Left + refActivity.Width + width * (postConditions[condIndex].CompletionPercentage / 100);
            if (right > $scope.customActivityGraphics[index].Left + width) {
                if (right > maxRight) {
                    maxRight = right;
                    delayOffset = right - (refActivity.Left + refActivity.Width);
                    //                        delayOffset = right - ($scope.customActivityGraphics[index].Left + width);
                    baseWidth = (refActivity.Left + refActivity.Width) - $scope.customActivityGraphics[index].Left;
                    staffRatio = (width / baseWidth) * (1 - postConditions[condIndex].CompletionPercentage / 100);
                    //                        staffRatio = (1 - delayOffset / baseWidth);
                    //                        baseWidth = width;
                    width = right - $scope.customActivityGraphics[index].Left;
                    // set the delayed flag to indicate that resource are probably underutilized for this activity
                    $scope.customActivityGraphics[index].Delayed = true;
                    $scope.customActivityGraphics[index].BaseWidth = baseWidth;
                    $scope.customActivityGraphics[index].DelayWidth = delayOffset;
                    $scope.customActivityGraphics[index].BaseStaffRatio = staffRatio;
                }
                else {
                    $scope.customActivityGraphics[index].Delayed = false;;

                }

            }
            condIndex++;
        }
        // Assign this activity to a row
        // Check to see if the rows array is empty
        if (Rows.length == 0) {
            Rows.push($scope.customActivityGraphics[index].Left + width);
            $scope.customActivityGraphics[index].Row = 0;
        }
        else {
            // Loop over the current rows and find the first one which will hold this activity
            var rowCounter = 0;
            var rowFound = false;
            while (rowCounter < Rows.length) {
                if ($scope.customActivityGraphics[index].Left > Rows[rowCounter]) {   // Todo - Update to check to see if the current activity will fit to he left in this row
                    Rows[rowCounter] = $scope.customActivityGraphics[index].Left + width;
                    $scope.customActivityGraphics[index].Row = rowCounter;
                    rowFound = true;
                    break;
                }
                rowCounter++;
            }
            // Check to see if a row was found
            if (!rowFound) {
                Rows.push($scope.customActivityGraphics[index].Left + width);
                $scope.customActivityGraphics[index].Row = Rows.length - 1;
            }
        }

        $scope.customActivityGraphics[index].Width = width;
        $scope.customActivityGraphics[index].WidthPos = width + 'px';
        //        return ($scope.customActivityGraphics[index].Width + 'px');
    }


    // Declare a function to calculate the top position of the current activity
    $scope.getTop = function (index) {
        $scope.customActivityGraphics[index].Top = (($scope.customActivityGraphics[index].Row * 25) + topBaseline + 1);
        $scope.customActivityGraphics[index].TopPos = (($scope.customActivityGraphics[index].Row * 25) + topBaseline + 1) + 'px';
    }


    //    $scope.getDelayedStatus = function (index) {
    //        return ($scope.customActivityGraphics[index].Delayed);
    //    }

    // Declare a function to render the waterfall view of the current activities
    $scope.renderWaterfallModel = function () {
        // Declare a variable to iterate over Activiites
        var index = 0;
        var width = 0;
        // Declare a local object to store the new ActivityGraphic
        var newGraphic;
        // Declrae a local variable to hold the current staff count
        var staff;

        totalWaterfallWidth = 0;
        $scope.waterfallActivityGraphics.length = 0;

        // loop over the activities
        while (index < $scope.Activities.length) {
            // Initialize the new graphic record
            newGraphic = { ActivityID: $scope.Activities[index].ID, Left: 0, LeftPos: 0 + 'px', Top: waterfalTopBaseline, TopPos: waterfalTopBaseline + 'px', Width: 0 };
            // calculate the left position of the current graphic
            if (index == 0) {
                newGraphic.Left = leftBaseline;
                newGraphic.LeftPos = leftBaseline + 'px';
            }
            else {
                newGraphic.Left = $scope.waterfallActivityGraphics[index - 1].Left + $scope.waterfallActivityGraphics[index - 1].Width;
                newGraphic.LeftPos = newGraphic.Left + 'px';
            }

            // Get the staff count for the current activity
            staff = $scope.Staff[getStaffCount($scope.Activities[index].MasterRoleID)].Count;

            // Calculate the current width
            width = ($scope.Activities[index].Effort / ((1 - $scope.Activities[index].Overhead) * staff * workDay));
            newGraphic.Width = width;
            newGraphic.WidthPos = width + 'px';

            totalWaterfallWidth += width;

            // insert the new record
            $scope.waterfallActivityGraphics.push(newGraphic);
            index++;
        }

        // round the total width to an integer number of days
        totalWaterfallWidth = Math.round(totalWaterfallWidth);


        // update the scaling factor based on the total width;
        scalingFactor = (displayWidth - leftBaseline) / totalWaterfallWidth;

        // refresh the current date based on the new scaling factor
        index = 0;
        while (index < $scope.Activities.length) {
            if (index > 0) {
                $scope.waterfallActivityGraphics[index].Left = $scope.waterfallActivityGraphics[index - 1].Left + $scope.waterfallActivityGraphics[index - 1].Width + 1;
                $scope.waterfallActivityGraphics[index].LeftPos = $scope.waterfallActivityGraphics[index].Left + 'px';
            }
            $scope.waterfallActivityGraphics[index].Width = $scope.waterfallActivityGraphics[index].Width * scalingFactor;
            $scope.waterfallActivityGraphics[index].WidthPos = $scope.waterfallActivityGraphics[index].Width + 'px';
            index++;
        }
    }

    // Declare a method to render the concurrent model
    $scope.renderConcurrentModel = function () {
        // Declare a variable to iterate over Activiites
        var index = 0;
        var width = 0;
        // Declare a local object to store the new ActivityGraphic
        var newGraphic;
        var staff;

        $scope.concurrentActivityGraphics.length = 0;

        // loop over the activities
        while (index < $scope.Activities.length) {
            // Initialize the new graphic record
            newGraphic = { ActivityID: $scope.Activities[index].ID, Left: 0, LeftPos: 0 + 'px', Top: waterfalTopBaseline, TopPos: waterfalTopBaseline + 'px', Width: 0 };
            // calculate the left position of the current graphic
            newGraphic.Left = leftBaseline;
            newGraphic.LeftPos = leftBaseline + 'px';

            // Get the staff count for the current activity
            staff = $scope.Staff[getStaffCount($scope.Activities[index].MasterRoleID)].Count;

            // Calculate the current width
            width = ($scope.Activities[index].Effort / ((1 - $scope.Activities[index].Overhead) * staff * workDay)) * scalingFactor;
            newGraphic.Width = width;
            newGraphic.WidthPos = width + 'px';

            // calculate the top position of the current graphic
            newGraphic.Top = topBaseline + index * (activityOffset + 1);
            newGraphic.TopPos = newGraphic.Top + 'px';
            $scope.concurrentActivityGraphics.push(newGraphic);
            index++;
        }
    };

    // Declare a function to refresh the calendar scale based on the scaling factor
    $scope.refreshCalendar = function () {
        var index = 0;
        var width = 0;
        var calendarWidth = 0;
        var newWeek = undefined;

        // Set the week width to 5 times the Scaling factor since that represents the pixels per day for the current display
        width = 5 * scalingFactor;

        $scope.Calendar.length = 0;
        while (calendarWidth < (totalWaterfallWidth * scalingFactor)) {
            newWeek = { ID: 0, Left: 0, LeftPos: '0px', Width: 0, WidthPos: '0px', Top: 0, TopPos: '0px' };
            newWeek.ID = index + 1;
            newWeek.Left = (leftBaseline + index * width);
            newWeek.LeftPos = newWeek.Left + 'px';
            newWeek.Width = width;
            newWeek.WidthPos = newWeek.Width + 'px';
            newWeek.Top = topBaseline;
            newWeek.TopPos = newWeek.Top + 'px';
            $scope.Calendar.push(newWeek);
            calendarWidth += width;
            index++;

        }

    }



}])

.filter('percentage', ['$filter', function ($filter) {
    return function (input, decimals) {
        return $filter('number')(input * 100, decimals) + '%';
    };
}])


    .directive("postConditionToggle", function ($location) {
        return {
            restrict: "A",
            controller: function ($scope) {

                $scope.togglePostconditionPanel = function (element) {
                    var element;
                    // hide post condition control
                    if ($scope.postConditionToggleButton.Displayed) {
                        $scope.postConditionBorder = "solid 0px black";
                        $scope.postConditionToggleButton.Name = 'Edit Postconditions';
                        $scope.postConditionToggleButton.Displayed = false;
                        $scope.postConditionPanel.Height = 0;
                        $scope.postConditionPanel.HeightPos = $scope.postConditionPanel.Height + 'px';
                        $scope.editPanelPositions[1].Visible = false;
                    }
                        // show post condition control
                    else {
                        $scope.postConditionBorder = "solid 1px black";
                        $scope.postConditionToggleButton.Name = 'Hide Postconditions';
                        $scope.postConditionToggleButton.Displayed = true;
                        $scope.postConditionPanel.Height = 500;
                        $scope.postConditionPanel.HeightPos = $scope.postConditionPanel.Height + 'px';
                        $scope.editPanelPositions[1].Visible = true;
                    }
                    $scope.updateEditPanelPositions();
                };

                $scope.togglePreconditionPanel = function (element) {
                    var element;
                    // Hide the precondition panel
                    if ($scope.preConditionToggleButton.Displayed) {
                        $scope.preConditionBorder = "solid 0px black";
                        $scope.preConditionToggleButton.Name = 'Edit Preconditions';
                        $scope.preConditionToggleButton.Displayed = false;
                        $scope.preConditionPanel.Height = 0;
                        $scope.preConditionPanel.HeightPos = $scope.preConditionPanel.Height + 'px';
                        // update the top attributes for the post condition panel
                        $scope.postConditionPanel.Top = 80;
                        $scope.postConditionPanel.TopPos = $scope.postConditionPanel.Top + 'px';
                        // Update the pot condition button style data
                        $scope.postConditionToggleButton.Top = 50;
                        $scope.postConditionToggleButton.TopPos = $scope.postConditionToggleButton.Top + 'px';
                        $scope.editPanelPositions[0].Visible = false;
                    }
                        // show the precondition panel
                    else {
                        $scope.preConditionBorder = "solid 1px black";
                        $scope.preConditionToggleButton.Name = 'Hide Preconditions';
                        $scope.preConditionToggleButton.Displayed = true;
                        $scope.preConditionPanel.Height = 500;
                        $scope.preConditionPanel.HeightPos = $scope.preConditionPanel.Height + 'px';
                        // update the top attributes for the post condition panel
                        $scope.postConditionPanel.Top = 585;
                        $scope.postConditionPanel.TopPos = $scope.postConditionPanel.Top + 'px';
                        // Update the pot condition button style data
                        $scope.postConditionToggleButton.Top = 555;
                        $scope.postConditionToggleButton.TopPos = $scope.postConditionToggleButton.Top + 'px';
                        $scope.editPanelPositions[0].Visible = true;
                    }
                    $scope.updateEditPanelPositions();
                };

                $scope.toggleStaffingPanel = function (element) {
                    var element;

                    $scope.staffingToggleButton.Top = $scope.editPanelPositions[2].Top - 35;
                    $scope.staffingToggleButton.TopPos = $scope.staffingToggleButton.Top + 'px';
                    // hide post condition control
                    if ($scope.staffingToggleButton.Displayed) {
                        $scope.staffingBorder = "solid 0px black";
                        $scope.staffingToggleButton.Name = 'Edit Staffing';
                        $scope.staffingToggleButton.Displayed = false;
                        $scope.staffingPanel.Height = 0;
                        $scope.staffingPanel.HeightPos = $scope.staffingPanel.Height + 'px';
                        $scope.editPanelPositions[2].Visible = false;
                    }
                        // show post condition control
                    else {
                        $scope.staffingBorder = "solid 1px black";
                        $scope.staffingToggleButton.Name = 'Hide Staffing';
                        $scope.staffingToggleButton.Displayed = true;
                        $scope.staffingPanel.Height = 350;
                        $scope.staffingPanel.HeightPos = $scope.staffingPanel.Height + 'px';
                        $scope.editPanelPositions[2].Visible = false;
                    }
                    $scope.updateEditPanelPositions();
                };


            },
        };
    })


