"use strict"

var deliverableDisplay = function () {

    this.deliverable;
    this.add = addDeliverable;
    this.addEmptyRow = addEmptyDeliverable;
    var DeliverableUrl = "/api/deliverable";

    function addEmptyDeliverable() {
    }


    function addDeliverable(ID, deliverable) {
        var cellIndex = 1;
        var leftOffset = 5;
        var increment = 15;
        // Add a new row for the current item
        // Check to see where this row should be added
        if (deliverable.ParentID == -1) {
            $("<tr id='row" + deliverable.ID + "'></tr>").appendTo("#wbsBody");
        }
        else if (deliverable.ParentID == 0) {
            $("<tr id='row" + deliverable.ID + "'></tr>").prependTo("#wbsBody");
        }
        else {
            // Add this deliverable to the children array of the parent
            //            deliverables[
            var node = $("#row" + deliverable.ParentID);
            deliverableDepth = getDepth(deliverable, 0)
            leftOffset = increment * deliverableDepth;
            $("<tr id='row" + deliverable.ID + "'></tr>").css({ "margin-left": leftOffset }).insertAfter($("#row" + deliverable.ParentID));
        }

        if (deliverable.ID != 0) {
            // Create an event handler on the current row
            $("#row" + deliverable.ID).click({ param1: deliverable }, highlightRowHandler);
            var element = document.getElementById("row" + deliverable.ID);
            $("#row" + deliverable.ID).contextmenu({ param1: deliverable }, rightClick);
        }

        $("<td class='hidden'></td>").text(deliverable.ID).appendTo("#row" + deliverable.ID);
        // Only add  text to the expander if the current deliverable has chidlren
        $("<td id='expander" + deliverable.ID + "' class='expander'></td>").appendTo("#row" + deliverable.ID);

        // Exclude the total line from this process
        if (deliverable.ID != 0) {
            if (deliverable.hasChildren) {
                $("#expander" + deliverable.ID).text("<");
            }
            $("#expander" + deliverable.ID).click({ param1: deliverable }, collapseRowsHandler);
        }

        //Add a column for the new child option
        $("<td id='newChild" + deliverable.ID + "'></td>").addClass("addChild").appendTo("#row" + deliverable.ID).click({ param1: deliverable }, insertDeliverableHandler);
        if (deliverable.ScopeModel.length == 0 && !deliverable.Total) {
            $("<img src='images/incrementButton.png'></img>").addClass("incrementImage").appendTo("#newChild"+deliverable.ID); 
//                         $("#expander" + deliverable.ID).text("<");
        }

        $("<td id='cell" + deliverable.ID + "'></td>").addClass("deliverableColumn").appendTo("#row" + deliverable.ID);
        // Calculate the margin offset for the current name
        if (deliverable.ID != 0) {
            deliverableDepth = getDepth(deliverable, 0)
        }
        else {
            deliverableDepth = 0;
        }
        leftOffset = increment * deliverableDepth;

        // Add the Name cell
        $("<div></div>").text(deliverable.Name).css({ "margin-left": leftOffset }).appendTo("#cell" + deliverable.ID);
        $("<td></td>").addClass("deliverableDescriptionColumn").text(deliverable.Description).appendTo("#row" + deliverable.ID);
        $("<td align='center'></td>").addClass("crossReferenceColumn").text(deliverable.CrossReference).appendTo("#row" + deliverable.ID);
        // Output the effort number
        if (deliverable.Effort == -1) {
            $("<td id='totalEffort" + deliverable.ID + "'align='center'></td>").addClass("deliverableEffortColumn").text("").appendTo("#row" + deliverable.ID);
        }
        else {
            $("<td id='totalEffort" + deliverable.ID + "' align='center'></td>").addClass("deliverableEffortColumn").text((deliverable.Effort).toFixed(0)).appendTo("#row" + deliverable.ID);
        }
        // Check to see if there is a valid effort
        if (deliverable.EffortRemaining == -1) {
            $("<td id='effort" + deliverable.ID + "'align='center'></td>").addClass("deliverableEffortColumn").text("").appendTo("#row" + deliverable.ID);
        }
        else {
            $("<td id='effort" + deliverable.ID + "' align='center'></td>").addClass("deliverableEffortColumn").text((deliverable.EffortRemaining).toFixed(0)).appendTo("#row" + deliverable.ID);
        }
        // add the total cost column
        if (deliverable.Cost == -1) {
            $("<td id='totalCost" + deliverable.ID + "'align='center'></td>").addClass("deliverableEffortColumn").text("").appendTo("#row" + deliverable.ID);
        }
        else {
            $("<td id='totalCost" + deliverable.ID + "' align='center'></td>").addClass("deliverableEffortColumn").text(toCurrency(deliverable.CostRemaining, 0, ',', '.')).appendTo("#row" + deliverable.ID);
        }
        // Add the remaining cost column
        if (deliverable.CostRemaining == -1) {
            $("<td id='cost" + deliverable.ID + "'align='center'></td>").addClass("deliverableEffortColumn").text("").appendTo("#row" + deliverable.ID);
        }
        else {
            $("<td id='cost" + deliverable.ID + "' align='center'></td>").addClass("deliverableEffortColumn").text(toCurrency(deliverable.CostRemaining,0,',','.')).appendTo("#row" + deliverable.ID);
        }

        $("<td id='buttonColumn" + deliverable.ID + "' align='center'></td>").addClass("twoButtonColumn").appendTo("#row" + deliverable.ID);
        $("<BUTTON id='editButton" + deliverable.ID + "'></BUTTON>").addClass("cellButton").text("Edit").appendTo("#buttonColumn" + deliverable.ID);
        $("<BUTTON id='deleteButton" + deliverable.ID + "'></BUTTON>").addClass("cellButton").text("Delete").appendTo("#buttonColumn" + deliverable.ID);
        $("#deleteButton" + deliverable.ID).click({ param1: deliverable }, deleteUnitHandler);
        $("#editButton" + deliverable.ID).click({ param1: deliverable }, setToEditMode); // Pass DeliverableModel record to function
    }

    function toCurrency(value,precision, comma, period) {
        var strVal = [];
        var index;
        var threeCount = 0;
        var newStr;

        strVal = value.toFixed(0);

        index = strVal.length;

        strVal = value.toFixed(precision);

        while (index > 0) {
            if (threeCount < 3) {
                index--;
                threeCount++;
                continue;
            }
            else {
                newStr = strVal.substring(0, index) + "," + strVal.substring(index);
                strVal = newStr;
                threeCount = 0;
            }
        }
        strVal = '$' + strVal;
        return (strVal);
    }

    function newDeliverableHandler(event) {

//        if (!optionMenuActive) {
            // highlight the current row
            highlightRowHandler(event);
            var form = new ContextMenu();
            form.show(event.clientY, event.clientX, options, event.data.param1);
 //           optionMenuActive = true;
        
    }

    function rightClick(event) {
        var options = [];
        var newOption = new menuOption();
        newOption.ID = 10101; // Need to devise permanent storage technique for base option values
        newOption.Text = "Insert Deliverable";
        newOption.Callback = insertDeliverableHandler;
        options.push(newOption);
        var newOption = new menuOption();
        newOption.ID = 10102;
        newOption.Text = "Delete Deliverable";
        newOption.Callback = deleteDeliverableHandler;
        options.push(newOption);

        if (!optionMenuActive) {
            // highlight the current row
            highlightRowHandler(event);
            var form = new ContextMenu();
            form.show(event.clientY, event.clientX, options,event.data.param1);
            optionMenuActive = true;
        }
        return (false);
    }

    function deleteDeliverableHandler(event) {
        alert("Delete Deliverable - Feature Not Yet Implemented");
    }

    /// Handle the Insert Deliverable menu option event
    function insertDeliverableHandler(event) {
        // Remove the option menu
        closeMenu();

        // Make sure you are not currently in an edit mode
        if (!scopeModelEditMode) {
            // Initialize the deliverable value based on the passed in parameters
            var deliverable = event.data.param1;
            //Check to make sure this node does not already have a scope model
            if (deliverable.ScopeModel.length == 0 && !deliverableInsert) {
                deliverableInsert = true;

                // Insert the new row after the selected row
                $("<tr id='insertRow'></tr>").insertAfter($("#row" + deliverable.ID));
                // Insrt the input boxes
                $("<td class='hidden'></td>").appendTo("#insertRow");
                $("<td class='expander'></td>").appendTo("#insertRow");


                $("<td></td>").appendTo("#insertRow");
                $("<td id='txtName' ></td>").appendTo("#insertRow");
                $("<INPUT id=name></INPUT>").addClass("deliverableInput").appendTo("#txtName");
                $("<td id='txtDescription' ></td>").appendTo("#insertRow");
                $("<INPUT id='description'></INPUT>").addClass("descriptionInput").appendTo("#txtDescription");
                $("<td id='txtCrossReference' ></td>").addClass("crossReferenceInput").appendTo("#insertRow");
                $("<INPUT id=crossreference></INPUT>").addClass("crossReferenceInput").appendTo("#txtCrossReference");
                $("<td></td>").appendTo("#insertRow");
                $("<td></td>").appendTo("#insertRow");
                $("<td></td>").appendTo("#insertRow");
                $("<td></td>").appendTo("#insertRow");
                $("<td id='buttonColumnA' align='center'></td>").appendTo("#insertRow");
                $("<BUTTON id='saveButtonA'></BUTTON>").addClass("cellButton").text("Save").appendTo("#buttonColumnA");
                $("<BUTTON id='cancelButton'></BUTTON>").addClass("cellButton").text("Cancel").appendTo("#buttonColumnA");
                $("#saveButtonA").click(saveNewDeliverable);
                $("#cancelButton").click({ param1: 'insertRow' }, cancelNewDeliverableHandler);
            }
        }
    }

    function cancelNewDeliverableHandler(event) {
        var row = event.data.param1;
        $("#" + row).remove();
        deliverableInsert = false;
    }

    function saveNewDeliverable() {
        // disable the save button so the user cannot click it twice
        $("#saveButtonA").prop('disabled', true);
        var newDeliverable = new Deliverable();
        // Set the parent value based on the currentDeliverable
        newDeliverable.ParentID = currentDeliverable.ID;
        newDeliverable.ProjectID = currentDeliverable.ProjectID;
//        newDeliverable.ProjectID = $("#projectList").find('option:selected').val();

        //            1052; // TBD - Currently hardcoded to test project
        newDeliverable.Name = $("#name").val();
        newDeliverable.Description = $("#description").val();
        newDeliverable.CrossReference = $("#crossreference").val();
        newDeliverable.UserID = userID;

        //Get the autentication token
        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var targetUrl = DeliverableUrl;


        // Update the stored data
        
        $.ajax({
            url: targetUrl,
            type: 'POST',
            dataType: 'json',
            data: newDeliverable,
            headers: headers,
            success: function (data, txtStatus, xhr) {
                scopeModelEditMode = false;
                deliverableInsert = false;
                deliverableEdit = false;
                resetScopeModelDisplay();
                loadData();
//                window.location.reload(true);
            },
            error: function (xhr, textStatus, errorThrown) {
                pmmodaErrorHandler(xhr);
            }
        });
        
    }


    function closeMenu() {
        var form = new ContextMenu();
        form.close();
    }

    function setToEditMode(event) {
        var deliverable;

        deliverable = event.data.param1;

        // Make sure the deliverable form is not already in edit mode
        if (!deliverableEdit && !scopeModelEditMode) {

            // Insert a row with edit boxes to edit counts
            addEditableRow(deliverable);
            // Delete the non editable row
            $("#row" + deliverable.ID).remove();
            // Set the edit mode flag
            deliverableEdit = true;
            scopeModelEditMode = true;
        }
        else {
            alert("The form is already in edit mode");
        }
    }

    function addEditableRow(item) {
        var deliverable = item;
        var leftOffset = 5;
        var increment = 15;
        // Add a new row for the current item
        if (deliverable.ParentID != 0) {
            var node = $("#row" + deliverable.ParentID);
            deliverableDepth = getDepth(deliverable, 0)
            leftOffset = increment * deliverableDepth;
            $("<tr id='editRow"+item.ID+"'></tr>").css({ "margin-left": leftOffset }).insertAfter($("#row" + deliverable.ID));
        }
        else {
            $("<tr id='editRow" + item.ID + "'></tr>").insertAfter($("#row" + item.ID));    //.appendTo("#wbsBody");
        }
        // Add the hidden and expander row
        $("<td class='hidden'></td>").appendTo("#editRow" + item.ID);
        $("<td class='expander'></td>").appendTo("#editRow" + item.ID);
        $("<td class='addChild'></td>").appendTo("#editRow" + item.ID);

        // Add the Name cell
        $("<td id='nameCell'></td>").appendTo("#editRow" + item.ID);
        $("<INPUT id='txtName'></INPUT>").addClass("").val(item.Name).appendTo("#nameCell");

        //        $("<td id='assumptions" + item.ID + "'></td>").text(item.Assumptions).appendTo("#editRow" + item.ID);

        $("<td id='descriptionCell' ></td>").css({'width':'200px'}).appendTo("#editRow" + item.ID);
        $("<INPUT id='txtDescription'></INPUT").addClass("descriptionInput").css({'width':'250px'}).val(item.Description).appendTo($('#descriptionCell'));

        $("<td id='crossReferenceCell' ></td>").appendTo("#editRow" + item.ID);
        $("<INPUT id='txtCrossReference'></INPUT").addClass("crossReferenceColumn").val(item.CrossReference).appendTo($('#crossReferenceCell'));

        $("<td id='editCell' ></td>").appendTo("#editRow" + item.ID);
        $("<td id='editCell' ></td>").appendTo("#editRow" + item.ID);
        $("<td id='editCell' ></td>").appendTo("#editRow" + item.ID);
        $("<td id='editCell' ></td>").appendTo("#editRow" + item.ID);


        $("<td id='buttonColumnEdit" + item.ID + "' align='center'></td>").appendTo("#editRow" + item.ID);
        $("<BUTTON id='saveButton" + item.ID + "'></BUTTON>").addClass("cellButton").text("Save").appendTo("#buttonColumnEdit" + item.ID);
        $("<BUTTON id='cancelButton" + item.ID + "'></BUTTON>").addClass("cellButton").text("Cancel").appendTo("#buttonColumnEdit" + item.ID);
        // Apply event handler to edit button
        $("#saveButton" + item.ID).click({ param1: item }, saveUpdatedDeliverableHandler);
        $("#cancelButton" + item.ID).click({ param1: item }, cancelEditDeliverableHandler);
    }

    function cancelEditDeliverableHandler(event) {
        var item = event.data.param1;
        var row = event.data.param2;
        // Add back the data row
        // Add a new row for the current item
        addDeliverable(item.ID, item);

        $("#editRow" + item.ID).remove();

        deliverableEdit = false;
        // Set the edit mode flag
        deliverableEdit = false;
        scopeModelEditMode = false;
    }


    function saveUpdatedDeliverableHandler(event) {
        var newDeliverable = new Deliverable();
//        newDeliverable = event.data.param1;
        newDeliverable.ID = event.data.param1.ID;
        newDeliverable.ProjectID = event.data.param1.ProjectID;
        newDeliverable.Name = $("#txtName").val();
        newDeliverable.Description = $("#txtDescription").val();
        newDeliverable.CrossReference = $("#txtCrossReference").val();
        newDeliverable.UserId = UserID;
        newDeliverable.isActive = 1;


        saveUpdatedDeliverable(newDeliverable);
    }


    /// Declare a function to apply the updated deliverable changes
    function saveUpdatedDeliverable(deliverable) {
        var locationCode = 235;

        //Get the autentication token
        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }


        // update the target URL
        var targetUrl = DeliverableUrl;
        
        // Update the stored data
        $.ajax({
            url: targetUrl,
            type: 'PUT',
            dataType: 'json',
            data: deliverable,
            headers: headers,
        }).done(function (data, txtStatus, xhr) {
            window.location.reload(true);
        }).fail(function (xhr, textStatus, errorThrown) {
            errorHandler2(xhr,locationCode);
        });
        
        // Set the edit mode flag
        deliverableEdit = false;
        scopeModelEditMode = false;
    }


    function errorHandler2(response,locationCode) {
        if (response.status == 401) {
            alert("Error Code: " + locationCode + ". The current user does not have permissions to load the projects for this organization. Please see your administrator")
        }
        else {
            alert("unspecified error occurred on Web Service Call");
        }
    }





    /// Declar ea function to handle the delete unit event on the main WBS view
    function deleteUnitHandler(event) {
        // Declare a local variable to store the ID of the current deliverable
        var deliverable;

        deliverable = event.data.param1;

       if( confirm("You are about to delete the Deliverable: " + deliverable.Name +". Are you sure you wish to continue")){

           var newDeliverable = new Deliverable();
           //        newDeliverable = event.data.param1;
           newDeliverable.ID = event.data.param1.ID;
           newDeliverable.ProjectID = event.data.param1.ProjectID;
           newDeliverable.Name = deliverable.Name;
           newDeliverable.Description = deliverable.Description;
           newDeliverable.CrossReference = deliverable.CrossReference;
           newDeliverable.isActive = false;
           newDeliverable.UserId = UserID;

//            deliverable.isActive = false;
            saveUpdatedDeliverable(newDeliverable);
        }
        else{

        }

//        alert("Delete '" + event.data.param1.Name + "' - Feature Not Yet Implemented");
        event.stopPropagation();

        // Update the current record and set it to inactive
    }




    function getDepth(node, count) {
        var count = 0;
        if (node.ParentID != 0) {
            count = getDepth(node.Parent);
            count++;
        }
//        count++;
        return (count);
    }



}
