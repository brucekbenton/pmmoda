"use strict"

// This form is version 2 of the Natural Unit management form and will be a popup as opposed to a standard page

var NaturalUnitForm = function () {
    this.show = showNaturalUnitForm;
    this.close = closeNaturalUnitForm;
    var NaturalUnits = [];
//    var currentOrg;
    var UserID = 1; // TBD - This needs to be removed when I integrate authentication

    // Declare an object to store the  Role WebApi address
//    var NaturalUnitUrl = "/api/NaturalUnit";
//    var DimensionUrl = "/api/Dimension";

    // Declare an array to store the new Roles which have been addedto an org this session
    var newRoles = [];
    // Declare an internal object to indicate whether this you are creating a new org or editing an existing org
    var editMode;
    // Create a deferred object to track when the dimension data has been loaded
    var updateReady;
    // Create a Deferred object instance to track when the UnitDimension data can be loaded
    var unitDimensionSynch;
    // Create a deferred object to track the dimensinos getting loaded
    var dimReady;
    // Declare an object to store the current ORganization instance
    var currentOrg;

    // Declare an object to store the main page clean up callback method
    var closeMethod;

    // Declare a variable to track hw many times the UnitDimension handler gets called
    var unitDimensionCounter;
    // Declare an array to hold a set of deferreds
    var deferredArray = [];
    // Declare an array to store the collection of Organizations
    var Organizations = [];
    // Declare a local variable to indicate that the dimensions data is dirty
    var dimensionsIsDirty = false;

    function showNaturalUnitForm(mode,currentOrg,callback) {
        // Declare a local variable to store the query Url
        var targetUrl;
        editMode = mode;
        closeMethod = callback;

        unitDimensionCounter = 0;

        currentOrg = new Organization();



            $("<DIV id='form' ></DIV>").addClass("popupForm").css({ 'width': '550px', 'height': '550px', 'top': '75px', 'left': '100px' }).appendTo('body');
            $("<DIV id='header' ></DIV>").addClass("headerCol").appendTo('#form');
            $("<p></p>").addClass("pageHeader").text('Standard Component').appendTo('#header');



            // Add the first row containing the org label and the org combo box box
            $("<DIV id='OrgRowContainer' ></DIV>").addClass("formRow").appendTo('#form');
            // Add the name lable and input text box
            $("<DIV id='OrgLabelContainer' ></DIV>").addClass('labelColumn').appendTo('#OrgRowContainer');
            $("<P>Project Team</p>").appendTo('#OrgLabelContainer');
            $("<DIV id='orgInput' ></DIV>").addClass("inputColumn").css({ 'left': '125px' }).appendTo('#OrgRowContainer');
            $("<SELECT id='cbOrg' ></SELECT>").addClass('basicComboBox').css({ 'width': '200px' }).appendTo("#orgInput");

            $("<DIV id='unitRowContainer' ></DIV>").addClass("formRow").appendTo('#form');
            $("<DIV id='unitLabelContainer'></DIV>").addClass('labelColumn').appendTo('#unitRowContainer');
            $("<P>Component</p>").appendTo('#unitLabelContainer');
            $("<DIV id='UnitInputContainer' ></DIV>").addClass("inputColumn").css({'left':'125px'}).appendTo('#unitRowContainer');
            $("<SELECT id='NaturalUnitList' ></SELECT>").addClass('basicComboBox').prop('disabled', false).css({ 'width': '200px' }).on("change", unitSelectHandler).appendTo("#UnitInputContainer");

            $("<DIV id='separatorRow' ></DIV>").addClass("formSeparator").appendTo('#form');


            // Add the name and the Role controls
            $("<DIV id='NameRoleContainer' ></DIV>").addClass("formRow").appendTo('#form');
            // Add the first row containing the name input box and the role check box
            $("<DIV id='FirstRowContainer' ></DIV>").addClass("formRow").appendTo('#NameRoleContainer');
            // Add the name lable and input text box
            $("<DIV id='NameLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#FirstRowContainer');
            $("<P>Name</p>").appendTo('#NameLabelContainer');
            $("<DIV id='NameInputContainer' ></DIV>").addClass("inputColumn").css({ 'left': '125px' }).appendTo('#FirstRowContainer');
            $("<INPUT type='text' id='txtName' ></INPUT>").addClass("basicTextBox").css({ 'width': '200px' }).appendTo("#NameInputContainer");


            // Add the description
            $("<DIV id='FirstDescriptionRow' ></DIV>").addClass("formRow").css({'height': '75px'}).appendTo('#form');
            $("<DIV id='DescriptionLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#FirstDescriptionRow');
            $("<P>Description</p>").appendTo('#DescriptionLabelContainer');
            $("<DIV id='DescriptionInput' ></DIV>").addClass("inputColumn").css({ 'left': '125px' }).appendTo('#FirstDescriptionRow');
            $("<TextArea id='txtDescription' cols='50' rows='3' ></TextArea>").prop('disabled', false).addClass('formInput').css({'width':'350px'}).appendTo('#DescriptionInput');

            // Add the Dimension section
            // Add the Dimension list box collection container
            $("<DIV id='DimensionRow' ></DIV>").addClass("formRow").css({ 'height': '130px'}).appendTo('#form');
            // Add the label
            $("<DIV id='DimensionLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#DimensionRow');
            $("<P>Dimension</p>").appendTo('#DimensionLabelContainer');
            $("<DIV id='DimensionInput' ></DIV>").addClass("inputColumn").css({ 'left': '125px' }).appendTo('#DimensionRow');
            // Add the dimension list box
            $("<div id='checkboxCollection' ></div>").addClass('formInput').css({ 'border': '1px solid', 'width': '350px', 'height': '130px', 'overflow': 'scroll' }).appendTo("#DimensionInput");

            // Add the active flag container
            $("<DIV id='activeFlagRow' ></DIV>").addClass("formRow").appendTo('#form');
            $("<DIV id='activeflagLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#activeFlagRow');
        //        $("<DIV id='activeFlagcontainer'></DIV>").addClass("sectionSpan").appendTo("#activeFlagSection");
            $("<input type='checkbox' id='activeFlag' />").appendTo("#activeflagLabelContainer")
            $("<label for='activeFlag'>Active</label>").addClass("inputColumn").css({ 'left': '25px', 'width': '250px' }).appendTo("#activeflagLabelContainer");


            // Add the navigation bar to the bottom
            $("<DIV id='navBar' ></DIV>").addClass("navigationBar").appendTo('#form');
            $("<p id='navParagraph'></p>").css({ 'text-align': 'center' }).appendTo('#navBar');
            $("<button id='btnSave'></button>").addClass("cellButton").prop('disabled', true).text("Save").on('click', saveUnitHandler).appendTo("#navParagraph");
            $("#btnSave").hide();
            $("<button id='btnUpdate'> </button>").addClass("cellButton").text("Update").prop('disabled', true).on("click", updateUnitHandler).appendTo("#navParagraph");
            $("<button></button>").addClass("cellButton").text("Close").on("click", closeNaturalUnitForm).appendTo("#navParagraph");

            // Load the organization data
//            loadOrganizations(updateOrganizations);
            loadOrganizationsByCompany(currentCompany.CompanyID, updateOrganizations, pmmodaErrorHandler);

    }

    // Declare a function to load the applicable data into the current form
    function loadFormData() {


        updateReady = new $.Deferred();
        unitDimensionSynch = new $.Deferred();
        // Load the master dimension data for the organization
//        document.body.style.cursor = "wait";
        updateReady = loadDimensionsByOrg(currentOrg.ID, refreshMasterDimensions, pmmodaErrorHandler);
        updateReady.done(function () {
            var myUnits = new NaturalUnit();
            unitDimensionSynch = loadNaturalUnitsByOrg(currentOrg.ID, refreshNaturalUnits, pmmodaErrorHandler);
            unitDimensionSynch.done(function () {
                dimReady = new $.Deferred();
                dimReady = loadUnitDimensions();
                dimReady.done(function () {
                    setEditMode(false,false);
                });

            })
        })

    }



    /// Delare a fuction to populate the org combo box based on the returned data from the Ajax call
    function updateOrganizations(data) {

        var index = 0;

        $("<option value='-1'></option>").appendTo($('#cbOrg'));
        while (index < data.length) {
            var org = new Organization();
            // Check to see if this this org is active
            if (data[index].isActive) {
                org.ID = data[index].Id;
                org.Name = data[index].Name;
                org.Description = data[index].Description;
                Organizations.push(org);
                // Add a list item for the organization.
                $("<option value='" + data[index].Id + "'></option>").text(data[index].Name).appendTo($('#cbOrg'));
            }
            index++;
        }
        $("#cbOrg").change(selectOrgHandler);

        // Disable the form inputs for the default stte
//        setEditMode(false);
    }


    /// Declare a function to process the organization selection event
    function selectOrgHandler() {
        var orgID;

        // reset the current form
        clearForm();

        // Get the selected org ID
        orgID = $("#cbOrg").find('option:selected').val();
        // Check to see if the current org is valid
        if (orgID > 0)
        {
            // Get the organizaiton record for the current org selection
            currentOrg = getCurrentOrganization(orgID, Organizations);
            // Make sure a valid organizaiotn was found
            if (currentOrg != undefined) {

                loadFormData();
            }
        }
        else {
            refreshForm();

        }
        // Make sure the new controls are still not editable
        setEditMode(false,false);
    }

    /// Declare a function to clear the contents of the current form
    function clearForm() {
        clearUnitDetails();
        clearUnits();
    }

    // Declare a function to process the current NAtural Unit selection from the list box. This event handler will display the current NU values and 
    // put the form into update Mode
    function unitSelectHandler() {
        var unit = new NaturalUnit();

        var ID;

        // Get ID of the currently selected dimension
        ID = $("#NaturalUnitList").find('option:selected').val();

        // Check to see if this is a current Dimension or a new dimension
        if (ID > 0) {
            // Get the current dimension ID value
            unit = getReferenceUnit(ID);


            // enable the dimension collection since this is an existing unit
            $('#DimensionRow :input').prop('disabled', false);
            $('#DimensionRow').css({ 'pointer-events': 'all' });
            // Set the active values
            setActiveNaturalUnit(unit);
            setEditMode(true,true);
            $("#btnUpdate").show();
            $("#btnSave").hide();
            // Update the current navigatino controls
        }
        else if (ID == -1) {
            // Process the new unit reuqest
            clearUnitDetails();
            setEditMode(true,true);

            $('#activeFlag').prop('checked', true);
            // Update the current navigatino controls
            $("#btnUpdate").hide();
            $("#btnSave").show();
        }
        else { // PRocess the selection of no Unit
            clearUnitDetails();
            setEditMode(false,false);
            // Disable the dimension collection since you cannot set this on new units
            $('#DimensionRow :input').prop('disabled', true);
            $('#DimensionRow').css({ 'pointer-events': 'none' });
//            $("#DimensionRow").hide();
            // Update the current navigatino controls
            $("#btnUpdate").hide();
            $("#btnSave").show();
            //            $("#btnSave").click(saveDimensionHandler);
        }
        // Enable the save button
        $("#btnSave").prop('disabled', false);
    }

    // Declare a function that searches through the Natural Unit array and returns the specified unit
    function getReferenceUnit(ID) {
        var selectedUnit = new NaturalUnit();

        for (var index = 0; index < currentOrg.NaturalUnits.length; index++) {
            if (currentOrg.NaturalUnits[index].ID == ID) {
                selectedUnit = currentOrg.NaturalUnits[index];
                break;
            }
        }
        return (selectedUnit);

    }

    // Declare a function to set the current form values to the active unit
    function setActiveNaturalUnit(unit) {

        // Set the current Name
        $("#txtName").val(unit.Name);

        // Set the current description
        $("#txtDescription").val(unit.Description);

        // Update the active flag
        if (unit.isActive) {
            $("#activeFlag").prop('checked', true);
        }
        else {
            $("#activeFlag").prop('checked', false);
        }

        // Loop over the defined dimensions and set them active as apporpriate
        $('#checkboxCollection input').each(function (index, value) {
            // reset the current checkbox
            $(value).prop('checked', false);
            // loop over the values in the current unit dimension array
            var count = 0;
            while(count < unit.Dimensions.length){
                if ($(value).val() == unit.Dimensions[count].ID) {
                    
                    $(value).prop('checked',unit.Dimensions[count].isActive);
                    break;
                }
                count++;
            }
        });

    }

    // Declre a function that will set the Unit value controls to be enabled and in edit mode
    function setEditMode(controlMode, dimMode) {
        if (controlMode) {
            $("#txtName").prop('disabled', false);
            // Update the background color since this does not happen by default
            $("#txtName").removeClass('disabledTextBox');
            $("#txtName").addClass('basicTextBox');
            $("#txtDescription").prop('disabled', false);
            $("#txtDescription").removeClass('disabledTextBox');
            $("#txtDescription").addClass('basicTextBox');

            // Disable the active flag
            $("#activeFlag").prop('disabled', false);
            // Enable the save/update buttons
            $("#btnSave").prop('disabled', false);
            $("#btnUpdate").prop('disabled', false);

//            $("#activeFlag").prop('checked', true);
        }
        else {
            $("#txtName").prop('disabled', true);
            $("#txtName").removeClass('basicTextBox');
            $("#txtName").addClass('disabledTextBox');
            $("#txtDescription").prop('disabled', true);
            $("#txtDescription").removeClass('disabledTextBox');
            $("#txtDescription").addClass('disabledTextBox');
            // Enable the active flag
            $("#activeFlag").prop('disabled', true);
            // Enable the save/update buttons
            $("#btnSave").prop('disabled', true);
            $("#btnUpdate").prop('disabled', true);
        }

        if (dimMode) {
            // Enable the dimension rows
            $('#DimensionRow :input').prop('disabled', false);
            $('#DimensionRow').css({ 'pointer-events': 'all' });
        }
        else
        {
            // Disable the dimension rows
            //            $('#DimensionRow : input').prop('disabled', false);
            $('#DimensionRow :input').prop('disabled', true);
            $('#DimensionRow').css({ 'pointer-events': 'all' });
        }
    }

    // Declare a function to clear the current unit value contents
    function clearUnitDetails() {

        // Set the current Name
        $("#txtName").val("");

        // Set the current description
        $("#txtDescription").val("");

        // Clear the dimension check boxes
        $('#checkboxCollection input').each(function (index, value) {
            // reset the current checkbox
            $(value).prop('checked', false);
        });

        // Clear the Natural Unit and Dimension boxes
//        $("#NaturalUnitList").empty();
//        $("#checkboxCollection").empty();

        // Update the active flag
        $("#activeFlag").prop('checked', false);

    }

    /// Declare an event handler function to save the current Organization
    function saveUnitHandler() {
        var dim;

        var unit = new NaturalUnit();

        // update organization record
        unit.OrganizationID = currentOrg.ID;
        unit.Name = $("#txtName").val();
        unit.Description = $("#txtDescription").val();
        unit.isActive = 1;
        unit.UserID = UserID;

        saveNaturalUnit(unit, null, pmmodaErrorHandler);
    }

    // Declare a function to insert the new NAtural Unit record
    function saveNaturalUnit(unit, callback, errorHandler) {

        // update the target URL
        var targetUrl = NaturalUnitUrl;

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }


        $.ajax({
            url: targetUrl,
            type: 'POST',
            dataType: 'json',
            data: unit,
            headers: headers
        }).done(function (data, txtStatus, jqXHR) {
            saveNewDimensions(data.ID);
            refreshForm();
        }).fail(function (xhr, textStatus, errorThrown) {
            errorHandler(xhr,601);
        });
    }

    /// Implement a function that will save the UnitDimension settings for the new Unit
    function saveNewDimensions(ID) {
        var targetUrl;
        var unit;

        unit = getCurrentNaturalUnit(ID, currentOrg.NaturalUnits);

        // Check to see if the dimensions have been updated
        if (dimensionsIsDirty) {
            // Loop over the dimensions for the current Natural Unit
            var dimIndex = 0;
            while (dimIndex < currentOrg.Dimensions.length) {
                var unitDim = new UnitDimension();
                unitDim.OrganizationID = currentOrg.ID;
                unitDim.UnitID = ID;
                unitDim.DimensionID = currentOrg.Dimensions[dimIndex].ID;
                unitDim.isActive = $("#dim" + currentOrg.Dimensions[dimIndex].ID).prop('checked');
                //                unitDim.isActive = 1;
                unitDim.UserID = c_UserID;

                targetUrl = UnitDimensionUrl + "/" + unitDim.OrganizationID;
                // Call the AJAX PUT method
                deferredArray.push($.ajax({
                    url: targetUrl,
                    type: "PUT",
                    dataType: "json",
                    data: unitDim,
                }).done(function (data, txtStatus, jqXHR) {
                    //            alert("Insert Success");
                }).fail(function (xhr, textStatus, errorThrown) {
                    alert("UnitDim Insert Error");
                }));

                dimIndex++;
            }
            //                unitIndex++;
        }


        $.when.apply(this, deferredArray).then(function () {
            // clear the dimensions dirty flag since they have been updated
            dimensionsIsDirty = false;
            refreshForm();
        });
    }


    // Declare a function to refresh the Dimensions form
    function refreshForm() {
        // Clear any current Dimension detail values
        clearUnitDetails();
        // Clear the current dimensions listbox
        clearUnits();
        // reload the current dimension values
        var targetUrl = DimensionUrl;

        // Clear the NAtural Unit and Dimension collections
        var index = 0;
        while (index < currentOrg.NaturalUnits.length) {
            currentOrg.NaturalUnits[index].Dimensions.length = 0;
            index++;
        }
        currentOrg.NaturalUnits.length = 0;
        currentOrg.Dimensions.length = 0;

        // reload the current data
        loadFormData();

    }

    // Declare a method to clear the NAtural Units list box
    function clearUnits() {
        $("#NaturalUnitList").empty();
    }


    /// Declare a funcion to populate the Master Dimension listbox
    function refreshMasterDimensions(data) {
        var index = 0;

        // reset the Dimensions array
        currentOrg.Dimensions.length = 0;

        // Empty the current contents of the list box
        $("#checkboxCollection").empty();

        while (index < data.length) {
            // Add a list item for the organization.
            var dim = new Dimension();
            dim.ID = data[index].ID;
            dim.Name = data[index].Name;
            dim.Description = data[index].Description;
            dim.isActive = data[index].isActive;
            // Add the current dimension to the reference array for the current organization
            currentOrg.Dimensions.push(dim);
            // Only add dimensions which are active
            if (data[index].isActive) {
                $("<input type='checkbox' id='dim" + data[index].ID + "' value='" + data[index].ID + "'/>" + data[index].Name + "<br />").on("click", updateDimensionHandler).appendTo($('#checkboxCollection'));
            }
            index++;
        }

//        updateReady.resolve();
    }


    // Declare a function to load the natural units and populate the listbox
    function refreshNaturalUnits(data) {
        var index = 0
        // reset the natural units array
        currentOrg.NaturalUnits.length = 0;
        // empty the current contents from the container control
        $('#NaturalUnitList').empty();

        $("<option value='0'></option>").text("").appendTo($('#NaturalUnitList'));
        while (index < data.length) {
            // Create a local instance of the current unit
            var unit = new NaturalUnit();
            unit.ID = data[index].ID;
            unit.Name = data[index].Name;
            unit.Description = data[index].Description;
            unit.isActive = data[index].isActive;
            // Add the current unit to the unit array
            currentOrg.NaturalUnits.push(unit);
            $("<option value='" + data[index].ID + "'></option>").text(data[index].Name).appendTo($('#NaturalUnitList'));
            index++;
        }
        // Add an entry to the Units list box to indicate a New Natural Unit
        $("<option value=-1></option>").text("[Add New Standard Component...]").appendTo("#NaturalUnitList");
    }


    function loadUnitDimensions() {
        var index = 0;
        var token;

        var unit = new NaturalUnit();
        // Call the common utility to load the unit dimensions
        token = loadUnitDimensionsByOrg(currentOrg.ID, updateDimensionResults,pmmodaErrorHandler);
        return (token);
    }

    function updateDimensionResults(ID, data) {

        var index = 0;

        // Loop over the data set
        while (index < data.length) {

            // Loop over the NaturalUnit collection
            var count = 0;
//            currentOrg.NaturalUnits[index].Dimensions.length = 0;

            while (count < currentOrg.NaturalUnits.length) {
                // Check to see if this unit corresponds to the current data entry
                if (data[index].UnitID == currentOrg.NaturalUnits[count].ID) {
                    // Create a new Dimension record and add it to the Dimensions array for the current Unit
                    var dim = new Dimension();
                    // Create a local dimension to get the dimension record from the reference set
                    var currentDimension = new Dimension();
                    currentDimension = getReferenceDimension(data[index].DimensionID);
                    // copy the dimension values to the new record
                    dim.ID = currentDimension.ID;
                    dim.Name = currentDimension.Name;
                    dim.Description = currentDimension.Description;
                    dim.isActive = data[index].isActive;
                    currentOrg.NaturalUnits[count].Dimensions.push(dim);
                    break;
                }
                count++;
            }
            index++;
        }


//        alert("Dimensions updated");
    }


    // Declare an function to process the update event
    function updateUnitHandler() {
        var dim;

        var unit = new NaturalUnit();

        // update organization record
        unit.ID = $("#NaturalUnitList").find('option:selected').val();
        unit.OrganizationID = currentOrg.ID;
        unit.Name = $("#txtName").val();
        unit.Description = $("#txtDescription").val();
        unit.isActive = 1;
        unit.isActive = $('#activeFlag').prop('checked');
        unit.UserID = UserID;

        updateNaturalUnit(unit, updateUnitDimensions, pmmodaErrorHandler)


    }

    // Declre a function to update the passed in Natural Unit
    function updateNaturalUnit(unit, callback, errorHandler) {

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // update the target URL to update the Unit  data
        var targetUrl = NaturalUnitUrl + '/' + unit.ID;
        $.ajax({
            url: targetUrl,
            type: 'PUT',
            dataType: 'json',
            data: unit,
            headers: headers
        }).done(function (data, txtStatus, jqXHR) {
            //            alert("Update Success");
            // Update the UnitDimension data
            callback(unit.ID);
        }).fail(function (xhr, textStatus, errorThrown) {
            errorHandler(xhr,604);
        });
    }


    /// Implement a function that will save the current state of dimensions for the current Natural Unit
    function updateUnitDimensions(ID) {
        var targetUrl;
        var unit;

        unit = getCurrentNaturalUnit(ID, currentOrg.NaturalUnits);

        // Loop over the Natural Units for the current project
//        var unitIndex = 0;
        // Check to see if the dimensions have been updated
        if (dimensionsIsDirty) {
                // Loop over the dimensions for the current Natural Unit
                var dimIndex = 0;
                while (dimIndex < unit.Dimensions.length) {
                    var unitDim = new UnitDimension();
                    unitDim.OrganizationID = currentOrg.ID;
                    unitDim.UnitID = ID;
                    unitDim.DimensionID = unit.Dimensions[dimIndex].ID;
                    unitDim.isActive = unit.Dimensions[dimIndex].isActive;
                    //                unitDim.isActive = 1;
                    unitDim.UserID = c_UserID;

                    targetUrl = UnitDimensionUrl + "/" + unitDim.OrganizationID;
                    // Call the AJAX PUT method
                    deferredArray.push($.ajax({
                        url: targetUrl,
                        type: "PUT",
                        dataType: "json",
                        data: unitDim,
                    }).done(function (data, txtStatus, jqXHR) {
                        //            alert("Insert Success");
                    }).fail(function (xhr, textStatus, errorThrown) {
                        alert("Insert Error");
                    }));

                    dimIndex++;
                }
//                unitIndex++;
        }


        $.when.apply(this, deferredArray).then(function () {
            // clear the dimensions dirty flag since they have been updated
            dimensionsIsDirty = false;
            refreshForm();
        });
    }


    // Declare a function to return the Natural Unit corresponding to the supplied ID
    function getCurrentNaturalUnit(ID,collection){
        var index = 0;
        var selectedUnit;

        // loop over the Natural Units
        while(index < collection.length){
            if(ID == collection[index].ID){
                selectedUnit = collection[index];
                break;
            }
            index++;
        }
        return(selectedUnit);
    }

    // Declare a method to process the click event son teh Dimension box
    function updateDimensionHandler() {

        // Get the current NAtural Unit
        var unit = new NaturalUnit();

        var id;

        id = $("#NaturalUnitList").find('option:selected').val();

        unit = getReferenceUnit(id);
        if (unit.ID == -1) {
            // this is a new NAtural Unit and needs to be added to the collection
        }

        // get the current Dimension
        var dim = new Dimension();

        var id = $(this).val();
        // Check to see if the dimension is already in the Unit collection
        dim = getDimension(unit, id);
        if (dim.ID != undefined) {
            // The dimension exists so just update it
            dim.isActive = $(this).prop('checked');
        }
        else {
            // Search for the currnt dimesnion in the referece set
            dim = getReferenceDimension(id, currentOrg.Dimensions);
            dim.isActive = $(this).prop('checked');
            unit.Dimensions.push(dim);
        }
        // Set the dimensions dirty flag since at least one dimension has been edited
        dimensionsIsDirty = true;

    }

    // Declare a function to get the selected dimension from the current Natural Unit
    function getDimension(unit, ID) {
        var index = 0;
        // Declare a local dimension object
        var selectedDim = new Dimension();

        while (index < unit.Dimensions.length) {
            if (ID == unit.Dimensions[index].ID) {
                selectedDim = unit.Dimensions[index];
                break;
            }
            index++;

        }
        return (selectedDim);
    }


    /// Declare a function to return the corresponding dimension in the specified array based on the passed in ID
    function getCurrentDimesion(dimensions, ID) {
        var index = 0;

        while (index < dimensions.length) {
            if (ID == dimensions[index].ID) {
                break;
            }
            index++;
        }
        if (index < dimensions.length) {
            return (dimensions[index]);
        }
        else {
            return (undefined);
        }
    }

    /// Declare a funtion to get the refernce dimension corresponding to the passed in ID
    function getReferenceDimension(ID) {
        var index = 0;
        var selectedDim = new Dimension();

        while (index < currentOrg.Dimensions.length) {
            if (ID == currentOrg.Dimensions[index].ID) {
                selectedDim = currentOrg.Dimensions[index];
                break;
            }
            index++;
        }
        return (selectedDim);
    }


    function closeNaturalUnitForm() {
        closeMethod();
        $("#form").remove();
    }

}
