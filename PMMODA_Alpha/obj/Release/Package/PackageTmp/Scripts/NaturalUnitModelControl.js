

var naturalUnitModelControl = function () {

    this.naturalUnitModel;
    this.add = addNaturalUnitModel;


    function addNaturalUnitModel(model) {
        var cellIndex = 1;
        // Add a new row for the current item
        $("<tr id='modelRow" + model.DimensionID + "'></tr>").appendTo("#NaturalUnitModelBody");
        // Create an event handler on the current row
//        $("#row" + model.ID).click({ param1: model }, highlightModelRow);

        // Add the Name cell
        $("<td class='hidden'></td>").text(model.DimensionID).appendTo("#modelRow" + model.DimensionID);
        $("<td></td>").text(model.DimensionName).appendTo("#modelRow" + model.DimensionID);
        $("<td id='loEffort" + model.DimensionID + "' align='center'></td>").text(model.LoEffort).appendTo("#modelRow" + model.DimensionID);
//        $("<INPUT></INPUT>").addClass("effortValue").val(model.LoEffort).appendTo("#loEffort" + model.ID);
        $("<td id='medEffort" + model.DimensionID + "' align='center'></td>").text(model.MedEffort).appendTo("#modelRow" + model.DimensionID);
//        $("<INPUT></INPUT>").addClass("effortValue").val(model.MedEffort).appendTo("#medEffort" + model.ID);
        $("<td id='hiEffort" + model.DimensionID + "' align='center'></td>").text(model.HiEffort).appendTo("#modelRow" + model.DimensionID);
//        $("<INPUT></INPUT>").addClass("effortValue").val(model.HiEffort).appendTo("#hiEffort" + model.ID);
        $("<td id='modelButtonColumn" + model.DimensionID + "' align='center'></td>").addClass("buttonColumn").appendTo("#modelRow" + model.DimensionID);
        $("<BUTTON id='modelEditButton" + model.DimensionID + "'></BUTTON>").addClass("cellButton").text("Edit").appendTo("#modelButtonColumn" + model.DimensionID);
        // Apply event handler to edit button
        $("#modelEditButton" + model.DimensionID).click({ param1: model }, setToEditMode);

//        $("#txtCount" + data[index].MasterRoleID).focusout({ param1: data[index].MasterRoleID }, validateCount);

    }

    // Declare a function to validate the effort numbers
    function validateCount(ID) {
//        var ID = event.data.param1;
        var value;
        //        var re = new RegExp(/^\d+$/);
        var re = new RegExp("^[0-9]+(\.[0-9]{1,2})?$");
        var status = true;

        // Declare a regular expression to use validating the input

        value = parseFloat($("#loEffortEdit" + ID).val());
//        value = $("#loEffortEdit" + ID).val();
        // verify that there are no non digit characters in the string
//        status = re.test(value);
        if (value == NaN) {
            status = false;
        }

        // TBD - Should I implement parseFloat instead

        // Check the medium effort now
        if (status) {
            value = parseFloat($("#MedEffortEdit" + ID).val());
//            value = $("#MedEffortEdit" + ID).val();

            // verify that there are no non digit characters in the string
            //            status = re.test(value);
            if (value == NaN) {
                status = false;
            }
        }
        // Check the High effort now
        if (status) {
//            value = $("#HiEffortEdit" + ID).val();
            value = parseFloat($("#HiEffortEdit" + ID).val());
            // verify that there are no non digit characters in the string
//            status = re.test(value);
            if (value == NaN) {
                status = false;
            }
        }

        if (!status) {
            alert("The count field must match a decimal format with an arbitrary number of digits before the decimal and at most 2 digits after the decimal. Please update the value.")
            status = false;
        }

        // set the dirty flag
        staffingIsDirty = true;
        //        value = parseFloat(value);
        return (status);
    }



    function setToEditMode(event) {
        var model;

        model = event.data.param1;

        if (!productivityModelEditFlag) {

            // set the app to edit mode
            productivityModelEditFlag = true;

            // Insert a row with edit boxes to edit counts
            addEditableRow(model);
            // Delete the non editable row
            $("#modelRow" + model.DimensionID).remove();
        }
        else
        {
            alert("The applicaiton is already in edit mode. Please save current chantges.")
        }
    }

    function addEditableRow(model){
        // Add a new row for the current item
        $("<tr id='editRow" + model.DimensionID + "'></tr>").insertAfter($("#modelRow" + model.DimensionID));
        // Create an event handler on the current row
        //        $("#row" + model.ID).click({ param1: model }, highlightModelRow);

        // Add the Name cell
        $("<td class='hidden'></td>").text(model.DimensionID).appendTo("#editRow" + model.DimensionID);
        $("<td></td>").text(model.DimensionName).appendTo("#editRow" + model.DimensionID);
        $("<td id='loEffortCell" + model.DimensionID + "'align='center'></td>").appendTo("#editRow" + model.DimensionID);
        $("<INPUT id='loEffortEdit" + model.DimensionID + "'></INPUT>").addClass("effortValue").val(model.LoEffort).appendTo("#loEffortCell" + model.DimensionID);
        $("<td id='MedEffortCell" + model.DimensionID + "' align='center'></td>").appendTo("#editRow" + model.DimensionID);
        $("<INPUT id='MedEffortEdit" + model.DimensionID + "'></INPUT>").addClass("effortValue").val(model.MedEffort).appendTo("#MedEffortCell" + model.DimensionID);
        $("<td id='HiEffortCell" + model.DimensionID + "' align='center'></td>").appendTo("#editRow" + model.DimensionID);
        $("<INPUT id='HiEffortEdit" + model.DimensionID + "'></INPUT>").addClass("effortValue").val(model.HiEffort).appendTo("#HiEffortCell" + model.DimensionID);
        $("<td id='buttonColumnEdit" + model.DimensionID + "' align='center'></td>").addClass("buttonColumn").appendTo("#editRow" + model.DimensionID);
        $("<BUTTON id='saveButton" + model.DimensionID + "'></BUTTON>").addClass("cellButton").text("Save").appendTo("#buttonColumnEdit" + model.DimensionID);
        // Apply event handler to edit button
        $("#saveButton" + model.DimensionID).click({ param1: model }, saveRowChanges);
    }

    function saveRowChanges(event) {
        var model;

        model = event.data.param1;

        // reset the app edit mode
        productivityModelEditFlag = false;

        // Validate the effort count formats
        if (validateCount(model.DimensionID)) {

            // Save changes to DB
            saveNaturalUnitModel(model);
            // Refresh display
//            loadModel(currentNaturalUnit);
        }
    }

    function saveNaturalUnitModel(model) {
        
        var item = new UnitDimension();
        item.UnitID = currentNaturalUnit.ID;
        item.DimensionID = model.DimensionID;
        item.UserID = 1; // TBD - USerID hard coded to 1 for now
        item.OrganizationID = currentNaturalUnit.OrganizationID;
        item.LoNominalEffort = $("#loEffortEdit" + model.DimensionID).val();
        item.MedNominalEffort = $("#MedEffortEdit" + model.DimensionID).val();
        item.HiNominalEffort = $("#HiEffortEdit" + model.DimensionID).val();


        //Get the autentication token
        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // update the target URL
        var targetUrl = ProductivityModelUrl;
        // Update the stored data
        $.ajax({
            url: targetUrl,
            type: 'PUT',
            dataType: 'json',
            data: item,
            headers: headers,
            success: function (data, txtStatus, xhr) {
                //                window.location.reload(true);
                resetModelDisplay();
                loadModel(currentNaturalUnit);
            },
            error: function (xhr, textStatus, errorThrown) {
                errorHandler(xhr);
            }
        });

    }

 
}