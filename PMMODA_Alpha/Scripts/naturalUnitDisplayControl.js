

var naturalUnitDisplayControl = function (orgID, userID) {

    this.naturalUnit;
    this.add = addNaturalUnit;
    this.addEmptyRow = addEmptyNaturalUnit;

    var NaturalUnitUrl = "http://localhost/WebApiTest/api/NaturalUnit";


    function addEmptyNaturalUnit() {
        // remove any current highlighting
        resetDisplay();
        $("<tr id='rowA'></tr>").appendTo("#naturalUnitDataBody");
        // Create an event handler on the current row
        //        $("#row" + model.ID).click({ param1: model }, highlightModelRow);

        // Add the Name cell
        $("<td class='hidden'></td>").appendTo("#rowA");
        $("<td id='txtNameCell' ></td>").appendTo("#rowA");
        $("<INPUT id='txtName'></INPUT>").addClass("NUValue").appendTo("#txtNameCell");
        $("<td id='txtDescriptionCell' ></td>").appendTo("#rowA");
        $("<INPUT id='txtDescription'></INPUT>").addClass("NUValue").appendTo("#txtDescriptionCell");
//        $("<td></td>").appendTo("#rowA");
        $("<td id='buttonColumnA' align='center'></td>").addClass("buttonColumn").appendTo("#rowA" );
        $("<BUTTON id='deleteButtonA'></BUTTON>").addClass("cellButton").text("Save").appendTo("#buttonColumnA");
        $("#deleteButtonA").click( saveNewUnitHandler);
    }

    function addNaturalUnit(unit) {
        var cellIndex = 1;
        // Add a new row for the current item
        $("<tr id='row" + unit.ID + "'></tr>").appendTo("#naturalUnitDataBody");
        // Create an event handler on the current row
        $("#row" + unit.ID).click({ param1: unit }, highlightRow);

        // Add the Name cell
        $("<td class='hidden'></td>").text(unit.ID).appendTo("#row" + unit.ID);
        $("<td></td>").addClass("NUNAmeColumn").css({'width':'200px'}).text(unit.Name).appendTo("#row" + unit.ID);
        $("<td></td>").addClass("standardNUColumn").text(unit.Description).appendTo("#row" + unit.ID);
//        $("<td align='center'></td>").addClass("standardNUColumn").text("[See Consuming Projects]").appendTo("#row" + unit.ID);
//        $("<td id='buttonColumn" + unit.ID + "' align='center'></td>").addClass("twoButtonColumn").appendTo("#row" + unit.ID);
//        $("<BUTTON id='editButton" + unit.ID + "'></BUTTON>").addClass("cellButton").text("Edit").appendTo("#buttonColumn" + unit.ID);
//        $("<BUTTON id='deleteButton" + unit.ID + "'></BUTTON>").addClass("cellButton").text("Delete").appendTo("#buttonColumn" + unit.ID);
//        $("#deleteButton" + unit.ID).click({ param1: unit }, deleteUnit);
//        $("#editButton" + unit.ID).click({ param1: unit }, setToEditMode);


    }

    function setToEditMode(event) {
        var naturalUnit;

        naturalUnit = event.data.param1;

        // Make sure the deliverable form is not already in edit mode
        if (!c_naturalUnitEdit) {

            // Insert a row with edit boxes to edit counts
            addEditableRow(naturalUnit);
            // Delete the non editable row
            $("#row" + naturalUnit.ID).remove();
            // Set the edit mode flag
            c_naturalUnitEdit = true;
        }
        else {
            alert("The form is already in edit mode");
        }
    }

    function addEditableRow(item) {
//        var deliverable = item;


        $("<tr id='editRow'></tr>").insertAfter($("#row" + item.ID));
//        $("<tr id='editRow" + item.ID + "'></tr>").appendTo("#naturalUnitDataBody");
        // Add the hidden and expander row
        $("<td class='hidden'></td>").appendTo("#editRow" + item.ID);

        // Add the Name cell
        $("<td id='txtNameCell' ></td>").appendTo("#editRow");
        $("<INPUT id='txtName'></INPUT>").addClass("NUValue").val(item.Name).appendTo("#txtNameCell");
        // Add the description cedll
        $("<td id='txtDescriptionCell' ></td>").appendTo("#editRow");
        $("<INPUT id='txtDescription'></INPUT>").addClass("descriptionInput").val(item.Description).appendTo("#txtDescriptionCell");

        $("<td id='buttonColumnEdit" + item.ID + "' align='center'></td>").appendTo("#editRow");
        $("<BUTTON id='saveButton" + item.ID + "'></BUTTON>").addClass("cellButton").text("Save").appendTo("#buttonColumnEdit" + item.ID);
        $("<BUTTON id='cancelButton" + item.ID + "'></BUTTON>").addClass("cellButton").text("Cancel").appendTo("#buttonColumnEdit" + item.ID);
        // Apply event handler to edit button
        $("#saveButton" + item.ID).click({ param1: item }, saveUpdatedNaturalUnitHandler);
        $("#cancelButton" + item.ID).click({ param1: item, param2: 'editRow' }, cancelEditNaturalUnitHandler);
//        $("#cancelButton").click({ param1: item, param2: 'inertRow' }, cancelEditNaturalUnitHandler);
    }

    // Handle the Cancel event on the Edit Natural Unit operation. Re-enter the original record and delete the editable row
    function cancelEditNaturalUnitHandler(event) {
        var item = event.data.param1;
        var row = event.data.param2;
        // Add back the data row
        // Add a new row for the current item
        appendNaturalUnit(item, row);

        $("#" + row).remove();

        c_naturalUnitEdit = false;
    }

    // Append a new Natural Unit row after the specified row
    function appendNaturalUnit(unit,row) {
        $("<tr id='row" + unit.ID + "'></tr>").insertAfter($("#"+row));
        // Create an event handler on the current row
        $("#row" + unit.ID).click({ param1: unit }, highlightRow);

        // Add the Name cell
        $("<td class='hidden'></td>").text(unit.ID).appendTo("#row" + unit.ID);
        $("<td></td>").addClass("standardNUColumn").text(unit.Name).appendTo("#row" + unit.ID);
        $("<td></td>").addClass("standardNUColumn").text(unit.Description).appendTo("#row" + unit.ID);
        //        $("<td align='center'></td>").addClass("standardNUColumn").text("[See Consuming Projects]").appendTo("#row" + unit.ID);
        $("<td id='buttonColumn" + unit.ID + "' align='center'></td>").addClass("twoButtonColumn").appendTo("#row" + unit.ID);
        $("<BUTTON id='editButton" + unit.ID + "'></BUTTON>").addClass("cellButton").text("Edit").appendTo("#buttonColumn" + unit.ID);
        $("<BUTTON id='deleteButton" + unit.ID + "'></BUTTON>").addClass("cellButton").text("Delete").appendTo("#buttonColumn" + unit.ID);
        $("#deleteButton" + unit.ID).click({ param1: unit }, deleteUnit);
        $("#editButton" + unit.ID).click({ param1: unit }, setToEditMode);
    }


    function saveNewUnitHandler(event) {
        var newValue = new NaturalUnit();
        newValue.Name = $("#txtName").val();
        newValue.Description = $("#txtDescription").val();
        newValue.UserID = userID;
        newValue.OrganizationID = orgID;


        var targetUrl = NaturalUnitUrl;
        // Update the stored data
        $.ajax({
            url: targetUrl,
            type: 'POST',
            dataType: 'json',
            data: newValue,
            success: function (data, txtStatus, xhr) {
                saveNewUnit(event);
                window.location.reload(true);
            },
            error: function (xhr, textStatus, errorThrown) {
                alert("error");
            }
        });
    }

    function saveNewUnit(event) {
        var node;
//        alert("Save new Natural Unit - Feature Not Yet Implemented");
        node = event.target;
        while (node.id != ("rowA")) {
            node = getParentNode(node, "A");
        }
//        node.remove();
        $(node).remove();
        event.stopPropagation();
    }


    function saveUpdatedNaturalUnitHandler(event) {
        var item = new NaturalUnit();
        //        newDeliverable = event.data.param1;
        item.ID = event.data.param1.ID;
        item.Name = $("#txtName").val();
        item.Description = $("#txtDescription").val();
        item.UserId = UserID;


        saveUpdatedNaturalUnit(item);
    }


    /// Declare a function to apply the updated deliverable changes
    function saveUpdatedNaturalUnit(item) {


        // update the target URL
        var targetUrl = naturalUnitUrl;

        // Update the stored data
        $.ajax({
            url: targetUrl,
            type: 'PUT',
            dataType: 'json',
            data: item,
        }).done(function (data, txtStatus, xhr) {
            window.location.reload(true);
        }).fail(function (xhr, textStatus, errorThrown) {
            alert("error");
        });

        // Set the edit mode flag
        deliverableEdit = false;
    }



    function deleteUnit(event) {
        alert("Delete '"+event.data.param1.Name+"' - Feature Not Yet Implemented");
        event.stopPropagation();
    }


    function highlightRow(event) {
        var id;
        var node;

        currentNaturalUnit = event.data.param1;

        resetDisplay();

        node = event.target;
        // Check to see if this event came from the row or the cell
        while ( node.id != ("row" + event.data.param1.ID)) {
            node = getParentNode(node, event.data.param1.ID);
        }
        $(node).css({ "background": "linear-gradient(rgba(128,193,229,1),white,rgba(128,193,229,1))"});
//        $(node).addClass("highlight");
        // Load the model for the current selected row
        loadModel(event.data.param1);
        // Update the header for the scoep model
        $("#modelLabel").val(event.data.param1.Name);
//        $("#scopeModelHeader").text("Productivity Model: " + event.data.param1.Name);
    }


    function getParentNode(node,ID) {
        node = node.parentNode;
        if (node.id != ("row"+ID)) {
            node = getParentNode(node,ID);
        }
        return (node);
    }

    function resetDisplay() {
        var table;
        var count=0;
        // Reset the background for each data row in the table
        $('#naturalUnitTable tr').each(function () {
            // Skip the header row
            if (count > 0) {
                $(this).css({ "background": "linear-gradient(white,white)" });
            }
            // Increment the counter
            count++;
        });

    }


}