/*jslint white:true, this:true*/
"use strict";
var customModel = angular.module('Model', ["ngRoute"])
//var wizard = angular.module('wizard', ["ngRoute"])

.controller('CustomModels', ['$scope', function ($scope) {
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
    // Declare a variable to track the total waterfall width
    var totalWaterfallWidth = 0;
    // Declare a local object to store the graph color array
    $scope.Colors = new Array("orange", "yellowgreen", "#80C1DD", "#639e4b", "#4b9e5c", "#4b9e85", "#4b8d9e", "#4b639e", "#5c4b9e", "#854b9e", "#9e488d", "#9e4b63");

//    linear - gradient(orange, white, orange)

    $scope.width = '125px';

    $scope.left = '50px';
    $scope.top = '350px';
    // Declare a variable for the post condition toggle button label
    $scope.postConditionToggleButton = { Displayed: false, Name: 'Show Postconditions', Top: 50, TopPos: '50px', Left: 1300, LeftPos: '1300px' };
    // Declre a data structure for the post condition input panel
    $scope.postConditionPanel = { Height: 0, HeightPos: '0px',Top:0,TopPos:'0px' };

    // Declare a variable for the pre condition toggle button label
    $scope.preConditionToggleButton = { Displayed: false, Name: 'Show Preconditions', Top: 50, TopPos: '50px', Left: 1300, LeftPos: '1300px' };
    // Declre a data structure for the pre condition input panel
    $scope.preConditionPanel = { Height: 0, HeightPos: '0px' };

    $scope.Activities = [
        { ID: 12, Name: 'Functional Design', Effort: 120, StaffCount: 2, Overhead: .25, RoleName: 'Project Manager' }, // 10 days
        { ID: 15, Name: 'Development', Effort: 360, StaffCount: 2.5, Overhead: .25, RoleName: 'Developer' }, //30
        { ID: 17, Name: 'Validation', Effort: 240, StaffCount: 2, Overhead: .25, RoleName: 'Software QA' }, //20
        { ID: 14, Name: 'Graphical Design', Effort: 120, StaffCount: 1, Overhead: .25, RoleName: 'Designer' }, //10
        { ID: 18, Name: 'Documentation', Effort: 80, StaffCount: 1, Overhead: .25, RoleName: 'Technial Writer' }, //5
        { ID: 22, Name: 'Acceptance', Effort: 40, StaffCount: 2, Overhead: .25, RoleName: 'Operations' }, //3.33
    ];

    /*
    $scope.Activities = [
        { ID: 12, Name: 'Functional Design', Effort: 120, StaffCount: 2, Overhead: .25, RoleName: 'Project Manager' }, // 10 days
        { ID: 15, Name: 'Development', Effort: 360, StaffCount: 2, Overhead: .25, RoleName: 'Developer' }, //30
        { ID: 17, Name: 'Validation', Effort: 240, StaffCount: 2, Overhead: .25, RoleName: 'Software QA' }, //20
        { ID: 14, Name: 'Graphical Design', Effort: 120, StaffCount: 2, Overhead: .25, RoleName: 'Designer' }, //10
        { ID: 18, Name: 'Documentation', Effort: 80, StaffCount: 2, Overhead: .25, RoleName: 'Technial Writer' }, //5
        { ID: 22, Name: 'Acceptance', Effort: 40, StaffCount: 2, Overhead: .25, RoleName: 'Operations' }, //3.33
    ];

    */


    $scope.Activities2 = [];

    $scope.customActivityGraphics = [
        { Left: 0, LeftPos: '0px', Top: 50, TopPos: '50px', Width: '120', WidthPos: '120px', Color: 'yellowgreen', Delayed: false, Row: 0 },   // Functional Design
        { Left: 0, LeftPos: '0px', Top: 75, TopPos: '75px', Width: '200', WidthPos: '200px', Color: 'orange', Delayed: false, Row: 0 },        // Development
        { Left: 0, LeftPos: '0px', Top: 100, TopPos: '100px', Width: '200', WidthPos: '200px', Color: 'orange', Delayed: false, Row: 0 },       // Validation
        { Left: 0, LeftPos: '0px', Top: 125, TopPos: '125px', Width: '60', WidthPos: '60px', Color: 'orange', Delayed: false, Row: 0 },        // Graphical Design
        { Left: 0, LeftPos: '0px', Top: 125, TopPos: '125px', Width: '50', WidthPos: '50px', Color: 'orange', Delayed: false, Row: 0 },        // Documentation
        { Left: 0, LeftPos: '0px', Top: 100, TopPos: '100px', Width: '80', WidthPos: '80px', Color: 'orange', Delayed: false, Row: 0 },        // Acceptance
    ];

    $scope.waterfallActivityGraphics = [];

    $scope.concurrentActivityGraphics = [];


    $scope.preConditions = [];


    $scope.Postconditions = [[], [], [{ ActivityID: 17, Name: 'Development', DependentID: 15, CompletionPercentage: 25 }], [], [], []];


    // Declre a data structure to store the preconditions for the current set of activities
    $scope.testConditions = [{ ActivityID: 15, Name: 'Functional Design', DependentID: 12, CompletionPercentage: 75 },
                            { ActivityID: 17, Name: 'Functional Design', DependentID: 12, CompletionPercentage: 75 },
                            { ActivityID: 17, Name: 'Development', DependentID: 15, CompletionPercentage: 25 },
                            { ActivityID: 14, Name: 'Functional Design', DependentID: 12, CompletionPercentage: 50 },
                            { ActivityID: 18, Name: 'Functional Design', DependentID: 12, CompletionPercentage: 100 },
                            { ActivityID: 18, Name: 'Development', DependentID: 15, CompletionPercentage: 100 },
                            { ActivityID: 22, Name: 'Documentation', DependentID: 18, CompletionPercentage: 100 }];


    $scope.testConditions2 = [];

    $scope.newRecord = [];

    $scope.newPostCondition = [];

    $scope.ActivityList = [{ ID: 0, Name: 'Functional Design' },
                            { ID: 1, Name: 'Development' },
                            { ID: 2, Name: ' Validation' },
                            { ID: 3, Name: 'Graphical Design' },
                            { ID: 4, Name: 'Documentation' },
                            { ID: 5, Name: 'Acceptance' }];

    $scope.Calendar = [{ ID: 1, Left: 50, LeftPos: '50px', Width: 50, WidthPos: '50px', Top: 50, TopPos: '50px' },
                       { ID: 2, Left: 101, LeftPos: '101px', Width: 50, WidthPos: '50px', Top: 50, TopPos: '50px' },
                        { ID: 3, Left: 152, LeftPos: '152px', Width: 50, WidthPos: '50px', Top: 50, TopPos: '50px' },
                        { ID: 4, Left: 203, LeftPos: '203px', Width: 50, WidthPos: '50px', Top: 50, TopPos: '50px' }]

    // Declare a function to remove the specified dependency from the preconditions collection
    $scope.deleteDependency = function (activityID, dependencyIndex) {
        var index;
        // Find the test Condition record corresponding to the supplied Activy and Dependency index
        index = getActivityIndex(activityID);
        if(index != undefined){
            var DependencyID = $scope.preConditions[index][dependencyIndex].DependentID;
            removeCondition(activityID, DependencyID);
            $scope.InitializeData();
        }

    }


    // Declare a function to remove the specified post condition from the post condition collection
    $scope.deletePostCondition = function (activityID, dependencyIndex) {
        var index;
        // Find the test Condition record corresponding to the supplied Activy and Dependency index
        index = getActivityIndex(activityID);
        if (index != undefined) {
//            var DependencyID = $scope.Postconditions[index][dependencyIndex].DependentID;
            $scope.Postconditions[index].splice(dependencyIndex, 1);
//            removePostCondition(activityID, DependencyID);
            $scope.InitializeData();
        }

    }

    var getActivityIndex = function(ID){
        var index=0;
        var result = undefined;

        //loop over the Activities collection and return he index of the corresponding ID
        while(index < $scope.Activities.length){
            if($scope.Activities[index].ID == ID){
                result = index;
                break;
            }
            index++;
        }
        return(result);
    }

    var removePostCondition = function (activityID, dependencyID) {
        var index = 0;
        var index2=0;

        while (index < $scope.Postconditions.length) {
            if ($scope.Postconditions[index].ActivityID == activityID){
                // Check for matching dependency record now
                // loop over the number of dependency records
                while(index2 < $scope.Postconditions[index].length){
                    if($scope.Postconditions[index][index2].DependentID = dependencyID){
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
        if (statue) {
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
            $scope.newRecord[index] = undefined;
            var index1 = 0;
            $scope.InitializeData();
        }
    }

    // Declare a functino to chcekc for circular dependencies in the preconditions
    var checkDependency = function (rootID, activityID,dependencyID) {
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
                status = checkDependency(rootID,rootID, preconditions[index].DependentID);
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

        // check for circular dependencies
        status = checkPostConditionDependency($scope.Activities[index].ID, $scope.Activities[index].ID, $scope.newPostCondition[index].Dependency.ID);
        if (!status) {
            alert("The requested dependency would create a circular dependency. No record will be saved.");
            $scope.newPostCondition[index] = undefined;
        }


        // If there are not data issues with the current selection apply the change
        if (status) {
            var newDependency = { ActivityID: $scope.Activities[index].ID, Name: $scope.newPostCondition[index].Dependency.Name, DependentID: $scope.newPostCondition[index].Dependency.ID, CompletionPercentage: $scope.newPostCondition[index].CompletionPercentage };
            $scope.Postconditions[index].push(newDependency)
            //            $scope.testConditions.push(newDependency);
            $scope.newPostCondition[index] = undefined;
            var index1 = 0;
            $scope.InitializeData();
        }
    }

    // Declare a functino to check for circular dependencies in the post conditions
    var checkPostConditionDependency = function (rootID, activityID, dependencyID) {
        // declare a locla object to store teh preconditions for the current activity
        var postconditions = [];
        // Declare a variable to use looping over depdencies
        var index = 0;
        var status = true;

        // Get the set of dependencies for the current activity
        postconditions = getPostConditionsByActivity( dependencyID);
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
        $scope.InitializeData();
    }

    $scope.InitializeData = function () {
        var index = 0;

        $scope.testConditions2.length = 0;
        $scope.Activities2.length = 0;
//        $scope.customActivityGraphics2.length = 0;
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
    }

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
            // check to see if this is the activity record
            //            if ($scope.testConditions[index1].ActivityID == ActivityID) {
            // ignore this item and continue to he next record
            //                index1++;
            //                continue;
            //            }
            //            else{
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
                        prevWidth * ($scope.testConditions[counter].CompletionPercentage/100)+1;
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

    $scope.getWidth = function (index, currentID) {
        var counter = 0;
        var width;
        // declare a variable to store the dependent ID
        var dependentID;
        var right = 0;
        var maxRight = 0;
        var refActivity;
        //declare an object to store the post conditions for the current activity
        var postConditions = [];

        width = ($scope.Activities[index].Effort / ((1 - $scope.Activities[index].Overhead) * $scope.Activities[index].StaffCount * workDay)) * scalingFactor;


        // get the post conditions for the current activity
        postConditions = $scope.Postconditions[index];
            // loop over the applicable post conditions
            var condIndex=0;
            while(condIndex < postConditions.length){
                // Check to see if this condition would length the task duration
                // Calculate the target end date
                refActivity = getActivityGraphic(postConditions[condIndex].DependentID);
                //                right = $scope.customActivityGraphics[dependentID].Left + $scope.customActivityGraphics[dependentID].Width + width * $scope.Postconditions[counter].CompletionPercentage;
                right = refActivity.Left + refActivity.Width + width * (postConditions[condIndex].CompletionPercentage / 100);
                if (right > $scope.customActivityGraphics[index].Left + width) {
                    if (right > maxRight) {
                        maxRight = right;
                        width = right - $scope.customActivityGraphics[index].Left;
                        // set the delayed flag to indicate that resource are probably underutilized for this activity
                        $scope.customActivityGraphics[index].Delayed = true;
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
        $scope.customActivityGraphics[index].Top = (($scope.customActivityGraphics[index].Row * 25) + topBaseline+1);
        $scope.customActivityGraphics[index].TopPos = (($scope.customActivityGraphics[index].Row * 25) + topBaseline+1) + 'px';

    }


    $scope.getDelayedStatus = function (index) {
        return ($scope.customActivityGraphics[index].Delayed);
    }

    // Declare a function to render the waterfall view of the current activities
    $scope.renderWaterfallModel = function () {
        // Declare a variable to iterate over Activiites
        var index = 0;
        var width = 0;
        // Declare a local object to store the new ActivityGraphic
        var newGraphic;

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
            // Calculate the current width
            width = ($scope.Activities[index].Effort / ((1 - $scope.Activities[index].Overhead) * $scope.Activities[index].StaffCount * workDay));
            newGraphic.Width = width;
            newGraphic.WidthPos = width + 'px';

            totalWaterfallWidth += width;

            // insert the new record
            $scope.waterfallActivityGraphics.push(newGraphic);
            index++;
        }


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

        $scope.concurrentActivityGraphics.length = 0;

        // loop over the activities
        while (index < $scope.Activities.length) {
            // Initialize the new graphic record
            newGraphic = { ActivityID: $scope.Activities[index].ID, Left: 0, LeftPos: 0 + 'px', Top: waterfalTopBaseline, TopPos: waterfalTopBaseline + 'px', Width: 0 };
            // calculate the left position of the current graphic
            newGraphic.Left = leftBaseline;
            newGraphic.LeftPos = leftBaseline + 'px';
            // Calculate the current width
            width = ($scope.Activities[index].Effort / ((1 - $scope.Activities[index].Overhead) * $scope.Activities[index].StaffCount * workDay)) * scalingFactor;
            newGraphic.Width = width;
            newGraphic.WidthPos = width + 'px';

            // calculate the top position of the current graphic
            newGraphic.Top = topBaseline + index * (activityOffset+1);
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
            newWeek.ID = index+1;
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

    // Declare a function to refresh the view based on teh updated data
    $scope.InitializeData();


}])

.filter('percentage', ['$filter', function ($filter) {
    return function (input, decimals) {
        return $filter('number')(input*100,decimals) + '%';
    };
}])


    .directive("postConditionToggle", function ($location) {
        return {
            restrict: "A",
            controller: function ($scope) {

                $scope.togglePostconditionPanel = function (element) {
                    var element;
                    if ($scope.postConditionToggleButton.Displayed) {
                        $scope.postConditionToggleButton.Name = 'Show Postconditions';
                        $scope.postConditionToggleButton.Displayed = false;
                        $scope.postConditionPanel.Height = 0;
                        $scope.postConditionPanel.HeightPos = $scope.postConditionPanel.Height + 'px';
                    }
                    else {
                        $scope.postConditionToggleButton.Name = 'Hide Postconditions';
                        $scope.postConditionToggleButton.Displayed = true;
                        $scope.postConditionPanel.Height = 500;
                        $scope.postConditionPanel.HeightPos = $scope.postConditionPanel.Height + 'px';
                    }
                };

                $scope.togglePreconditionPanel = function (element) {
                    var element;
                    if ($scope.preConditionToggleButton.Displayed) {
                        $scope.preConditionToggleButton.Name = 'Show Preconditions';
                        $scope.preConditionToggleButton.Displayed = false;
                        $scope.preConditionPanel.Height = 0;
                        $scope.preConditionPanel.HeightPos = $scope.preConditionPanel.Height + 'px';
                        // update the top attributes for the post condition panel
                        $scope.postConditionPanel.Top = 75;
                        $scope.postConditionPanel.TopPos = $scope.postConditionPanel.Top + 'px';
                        // Update the pot condition button style data
                        $scope.postConditionToggleButton.Top = 50;
                        $scope.postConditionToggleButton.TopPos = $scope.postConditionToggleButton.Top + 'px';

                    }
                    else {
                        $scope.preConditionToggleButton.Name = 'Hide Preconditions';
                        $scope.preConditionToggleButton.Displayed = true;
                        $scope.preConditionPanel.Height = 500;
                        $scope.preConditionPanel.HeightPos = $scope.preConditionPanel.Height + 'px';
                        // update the top attributes for the post condition panel
                        $scope.postConditionPanel.Top = 575;
                        $scope.postConditionPanel.TopPos = $scope.postConditionPanel.Top + 'px';
                        // Update the pot condition button style data
                        $scope.postConditionToggleButton.Top = 550;
                        $scope.postConditionToggleButton.TopPos = $scope.postConditionToggleButton.Top + 'px';
                    }

                };



            },
        };
    })


