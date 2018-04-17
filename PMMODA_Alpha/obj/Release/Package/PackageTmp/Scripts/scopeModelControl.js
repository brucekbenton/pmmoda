"use strict"

var scopeModelControl = function () {

    this.modelUnit;
    //    this.add = addDeliverable;
    this.addEmptyRow = addEmptyModelUnit;
    this.add = addDeliverableModel;


    function addDeliverableModel(item) { // item of type DeliverableModel
        var cellIndex = 1;
        // Add a new row for the current item
        $("<tr id='insertRow" + item.ID + "'></tr>").appendTo("#scopeModelBody");

        // Add the blank hidden column that would hold the ID for a saved row
        $("<td id='idRow"+item.ID+"' class='hidden'></td>").appendTo("#insertRow" + item.ID);

        // Add the natural unit name
        $("<td></td>").text(item.NaturalUnitName).appendTo("#insertRow" + item.ID);

        // Add the percent complete cell
        $("<td id='compCell" + item.ID + "'></td>").addClass("percentCompleteColumn").appendTo("#insertRow" + item.ID);
        // Check to see if there is a model defined for this line item and add a text box for updating the percent complete if there is
        //        if (deliverable.ScopeModel.length > 0) {
        $("<INPUT type='text' id='txtCompletion" + item.ID + "'></INPUT>").val(item.PercentComplete).addClass("completionTextBox").appendTo("#compCell" + item.ID);
        // Add input validatino handler
        $("#txtCompletion" + item.ID).focusout({ param1: item },validateCompletionPercentageHandler);
        //            $("#txtCompletion" + deliverable.ID).val("85");
//        }

        // Add the assumption cell
        $("<td></td>").text(item.Assumptions).appendTo("#insertRow" + item.ID);

        $("<td id='loCount" + item.ID + "' align='center'></td>").text(item.LowCount).appendTo("#insertRow" + item.ID);
//        $("<INPUT></INPUT>").addClass("effortValue").val(deliverable.LowCount).appendTo("#loCount" + deliverable.ID);
        $("<td id='medCount" + item.ID + "' align='center'></td>").text(item.MedCount).appendTo("#insertRow" + item.ID);
//        $("<INPUT></INPUT>").addClass("effortValue").val(deliverable.MedCount).appendTo("#medCount" + deliverable.ID);
        $("<td id='hiCount" + item.ID + "' align='center'></td>").text(item.HighCount).appendTo("#insertRow" + item.ID);
        $("<td id='iterationCount" + item.ID + "' align='center'></td>").text(item.IterationCount).appendTo("#insertRow" + item.ID);
        //        $("<INPUT></INPUT>").addClass("effortValue").val(deliverable.HighCount).appendTo("#hiCount" + deliverable.ID);
        // add the save button
        $("<td id='buttonColumnA" + item.ID + "' align='center'></td>").addClass("buttonColumn").appendTo("#insertRow" + item.ID);
        $("<BUTTON id='editButtonA" + item.ID + "'></BUTTON>").addClass("cellButton").text("Edit").appendTo("#buttonColumnA" + item.ID);
        $("<BUTTON id='deleteButtonA" + item.ID + "'></BUTTON>").addClass("cellButton").text("Delete").appendTo("#buttonColumnA" + item.ID);
        // Apply event handler to edit button
        $("#editButtonA" + item.ID).click({ param1: item }, setToEditMode); // Pass DeliverableModel record to function
        $("#deleteButtonA" + item.ID).click({ param1: item }, deleteItem); // Pass DeliverableModel record to function

    }

    // declare an event handler to validate the completion percentage 
    function validateCompletionPercentageHandler(event) {
        var item = event.data.param1;
//        var ID = item.ID;

        validateCompletionPercentage(item);
    }

    // declare an event handler to validate the completion percentage 
    function validateCompletionPercentage(item) {
        var value;
        var status = true;
        // make sure this is a % between 0 and 1
        value = $("#txtCompletion" + item.ID).val();
        value = parseFloat(value);

        if (value >= 0 && value <= 1) {
            value = value.toFixed(2) * 100;
            $("#txtCompletion" + item.ID).val(value)
            item.PercentComplete = value;
        }
        else if (value > 1 && value <= 100) {
            $("#txtCompletion" + item.ID).val(value.toFixed(0))
            item.PercentComplete = value;

        }
        else {
            alert("Please enter a valid % for the completion range.")
            status = false;
        }

        // Update the current row is the percentage is valid
        // update the target URL
        var targetUrl = DeliverableModelUrl;
        // Update the stored data
        $.ajax({
            url: targetUrl,
            type: 'PUT',
            dataType: 'json',
            data: item,
            success: function (data, txtStatus, xhr) {
                // Set the edit flag false
//                scopeModelEditMode = false;
//                deliverableEdit = false;
//                resetScopeModelDisplay();
//                window.location.reload(true);
            },
            error: function (xhr, textStatus, errorThrown) {
                alert("error");
            }
        });


    }


    /// Declare a function to delete the current item
    function deleteItem(event) {
        var newValue = new DeliverableModel();
        newValue.ID = event.data.param1.ID;

        if (confirm("You are about to delete a Scope Model line item. Are you sure you wish to continue?")) {

            //        newValue.ID = $("#idRow"+item.ID).val();
            newValue.Assumptions = $("#assumptions" + newValue.ID).val();
            newValue.LowCount = $("#loCountEdit" + newValue.ID).val();
            newValue.MedCount = $("#MedCountEdit" + newValue.ID).val();
            newValue.HighCount = $("#HiCountEdit" + newValue.ID).val();
            newValue.IterationCount = $("#IterationCountEdit" + newValue.ID).val();
            newValue.UserId = UserID;
            newValue.model


            // update the target URL
            var targetUrl = DeliverableModelUrl;
            // Update the stored data
            $.ajax({
                url: targetUrl,
                type: 'DELETE',
                dataType: 'json',
                data: newValue,
                success: function (data, txtStatus, xhr) {
                    scopeModelEditMode = false;
                    deliverableEdit = false;
                    resetScopeModelDisplay();
                    loadData();

//                    resetScopeModelDisplay();
//                    window.location.reload(true);
                },
                error: function (xhr, textStatus, errorThrown) {
                    alert("error");
                }
            });
        }
        else {

        }
    }

    function addEmptyModelUnit(orgID,deliverable) { 


        // Add a new row to the table
        $("<tr id='insertRow'></tr>").appendTo("#scopeModelBody");

        // Add the blank hidden column that would hold the ID for a saved row
        $("<td class='hidden'></td>").appendTo("#insertRow");

        // Add a select element for the desired natural unit
        $("<td id='unit' ></td>").appendTo("#insertRow");
        $("<SELECT id='unitList'></SELECT>").addClass("orgList").appendTo("#unit");

        // populate the select element with the applicable natural units
//        populateNaturalUnitOptions(orgID)
        loadNaturalUnitsByOrg(orgID, populateNaturalUnitOptions, pmmodaErrorHandler)

        $("<td></td>").addClass("percentCompleteColumn").text("0").appendTo("#insertRow");

        // Add the Assumptions text area box
        $("<td id='assumptionCell' ></td>").appendTo("#insertRow");
        $("<textarea id='assumption' class='formInput' cols='50' rows='3'></textarea>").appendTo($('#assumptionCell'));

        // Add the low, medium and high count input boxes
        $("<td id='loCount' align='center'></td>").appendTo("#insertRow");
        $("<INPUT id='txtLoCount'></INPUT>").val(0).addClass("effortValue").appendTo("#loCount");
        $("<td id='medCount' align='center'></td>").appendTo("#insertRow");
        $("<INPUT id='txtMedCount'></INPUT>").val(0).addClass("effortValue").appendTo("#medCount");
        $("<td id='hiCount' align='center'></td>").appendTo("#insertRow");
        $("<INPUT id='txtHiCount'></INPUT>").val(0).addClass("effortValue").appendTo("#hiCount");
        $("<td id='iterationCount' align='center'></td>").appendTo("#insertRow");
        $("<INPUT id='txtIterationCount'></INPUT>").val(1).addClass("effortValue").appendTo("#iterationCount");

        // add the save button
        $("<td id='buttonColumnA' align='center'></td>").addClass("buttonColumn").appendTo("#insertRow");
        $("<BUTTON id='scopeModelSaveButton'></BUTTON>").addClass("cellButton").text("Save").appendTo("#buttonColumnA");
        $("<BUTTON id='cancelButton'></BUTTON>").addClass("cellButton").text("Cancel").appendTo("#buttonColumnA" );


        $("#scopeModelSaveButton").click({ param1: deliverable }, saveNewScopeModelEntry);
        $("#cancelButton").click({ param1: deliverable }, cancelNewUnit); // Pass item record to function

    }

    /// Declare a function to cancel the new row
    function cancelNewUnit(event) {
        var deliverableModel;
        deliverableModel = event.data.param1;
//        addDeliverableModel(deliverableModel);
        $("#insertRow").remove();
    }

    function setToEditMode(event) {
        var deliverableModel;

        deliverableModel = event.data.param1;

        // Check to see if the form is already in edit mode
        if (!scopeModelEditMode && !deliverableEdit) {
            // Set the edit flag true
            scopeModelEditMode = true;
            deliverableEdit = true;

            // Insert a row with edit boxes to edit counts
            addEditableRow(deliverableModel);
            // Delete the non editable row
            $("#insertRow" + deliverableModel.ID).remove();
        }
        else {
            alert("Form is already in edit mode");
        }
    }

    function addEditableRow(item) {
        // Add a new row for the current item
        $("<tr id='editRow" + item.ID + "'></tr>").insertAfter($("#insertRow" + item.ID));
        // Create an event handler on the current row
        //        $("#row" + model.ID).click({ param1: model }, highlightModelRow);

        // Add the Name cell
        $("<td class='hidden'></td>").text(item.ID).appendTo("#editRow" + item.ID);
        $("<td></td>").text(item.NaturalUnitName).appendTo("#editRow" + item.ID);
        $("<td></td>").addClass("percentCompleteColumn").text(".50").appendTo("#editRow" + item.ID);
        // Add the assumption cell
        $("<td id='assumptionCell' ></td>").appendTo("#editRow" + item.ID);
        $("<textarea id='assumptions"+item.ID+"' class='formInput' cols='60' rows='3'></textarea>").val(item.Assumptions).appendTo($('#assumptionCell'));


        $("<td id='loCountCell" + item.ID + "'align='center'></td>").appendTo("#editRow" + item.ID);
        $("<INPUT id='loCountEdit" + item.ID + "'></INPUT>").addClass("effortValue").val(item.LowCount).appendTo("#loCountCell" + item.ID);
        $("<td id='MedCountCell" + item.ID + "' align='center'></td>").appendTo("#editRow" + item.ID);
        $("<INPUT id='MedCountEdit" + item.ID + "'></INPUT>").addClass("effortValue").val(item.MedCount).appendTo("#MedCountCell" + item.ID);
        $("<td id='HiCountCell" + item.ID + "' align='center'></td>").appendTo("#editRow" + item.ID);
        $("<INPUT id='HiCountEdit" + item.ID + "'></INPUT>").addClass("effortValue").val(item.HighCount).appendTo("#HiCountCell" + item.ID);
        $("<td id='IterationCountCell" + item.ID + "' align='center'></td>").appendTo("#editRow" + item.ID);
        $("<INPUT id='IterationCountEdit" + item.ID + "'></INPUT>").addClass("effortValue").val(item.IterationCount).appendTo("#IterationCountCell" + item.ID);
        $("<td id='buttonColumnEdit" + item.ID + "' align='center'></td>").addClass("buttonColumn").appendTo("#editRow" + item.ID);
        $("<BUTTON id='saveButton" + item.ID + "'></BUTTON>").addClass("cellButton").text("Save").appendTo("#buttonColumnEdit" + item.ID);
        $("<BUTTON id='cancelButton" + item.ID + "'></BUTTON>").addClass("cellButton").text("Cancel").appendTo("#buttonColumnEdit" + item.ID);
        // Apply event handler to edit button
        $("#saveButton" + item.ID).click({ param1: item },saveUpdatedUnit);
        $("#cancelButton" + item.ID).click({ param1: item }, cancelEditMode);
    }

    function cancelEditMode(event) {
        // Set the edit flag false
        scopeModelEditMode = false;
        deliverableEdit = false;

        var item = event.data.param1;
        // Delete the edit row
        $("#editRow" + item.ID).remove();
        // reset the model display
        resetScopeModelDisplay();
        // re-load the current deliverable model
        loadModel(currentDeliverable);
    }

    function saveUpdatedUnit(event) {
        var newValue = event.data.param1;
        newValue.Assumptions = $("#assumptions"+newValue.ID).val();
        newValue.LowCount = $("#loCountEdit"+newValue.ID).val();
        newValue.MedCount = $("#MedCountEdit" + newValue.ID).val();
        newValue.HighCount = $("#HiCountEdit" + newValue.ID).val();
        newValue.IterationCount = $("#IterationCountEdit" + newValue.ID).val();
        newValue.UserId = UserID;


        // update the target URL
        var targetUrl = DeliverableModelUrl;
        // Update the stored data
        $.ajax({
            url: targetUrl,
            type: 'PUT',
            dataType: 'json',
            data: newValue,
            success: function (data, txtStatus, xhr) {
                // Set the edit flag false
                scopeModelEditMode = false;
                deliverableEdit = false;
                resetScopeModelDisplay();
                loadData();
//                window.location.reload(true);
            },
            error: function (xhr, textStatus, errorThrown) {
                alert("error");
            }
        });
    }


    function populateNaturalUnitOptions(data) {

        $.each(data, function (key, value) {
            var project = new Project();
            // Add a list item for the organization.
            $("<option id='option" + value["ID"] + "' value='" + value["ID"] + "'></option>").text(value["Name"]).appendTo($('#unitList'));
            //                        $("#option"+value["Id"]).
        });


    }


    function saveNewScopeModelEntry(event) {
        var item = event.data.param1;
        //        var newValue = event.data.param1;
        // disable the save button to prevent duplicate requests
        $("#scopeModelSaveButton").prop('disabled', true);

        var newValue = new DeliverableModel();
        newValue.DeliverableID = item.ID;
//            currentDeliverable.ID;
        newValue.NaturalUnitID = $("#unitList").val();
        newValue.Assumptions = $("#assumption").val();
        newValue.LowCount = $("#txtLoCount").val();
        newValue.MedCount = $("#txtMedCount").val();
        newValue.HighCount = $("#txtHiCount").val();
        newValue.IterationCount = $("#txtIterationCount").val();
        newValue.UserId = 1;




        var targetUrl = DeliverableModelUrl;

        // Update the stored data
        $.ajax({
            url: targetUrl,
            type: 'POST',
            dataType: 'json',
            data: newValue,
            success: function (data, txtStatus, xhr) {
                var token;
                scopeModelEditMode = false;
                deliverableEdit = false;
                resetScopeModelDisplay();
                loadData();

//                resetScopeModelDisplay(event);
//                token = loadData();
//                window.location.reload(true);
//                $.when(token).then(highlightRow(event));
                
            },
            error: function (xhr, textStatus, errorThrown) {
                alert("error");
            }
        });

    }

}
