
"use strict"

var DimensionForm = function () {
    this.show = showDimensionForm;
    this.close = closeDimensionForm;

//    var Organizations = [];
    var currentOrg;
    var UserID = 1; // TBD - This needs to be removed when I integrate authentication

    // Declare an object to store the  Role WebApi address
    var NaturalUnitUrl = "/api/NaturalUnit";
    var DimensionUrl = "/api/Dimension";
    var RoleUrl = "/api/Role";

    // Declare an array to store the new Roles which have been added to an org this session
    var Roles = [];
    // Declare an array to store the dimensions
    var Dimensions = [];
    // Declare an array to store the current Organization collection
    var Organizations = [];
    var myDimensions;

    // Declare an internal object to indicate whether this you are creating a new org or editing an existing org
    var editMode;
    // Create a deferred object to track when the form is fully loaded
//    var updateReady;

    // Declare an object to store the main page clean up callback method
    var closeMethod;
    // Declare a deferred to make sure this is not a rce condition
    var dimensionDeferred;


    function showDimensionForm(mode, currentOrg, callback) {
        // Declare a local variable to store the query Url
        var targetUrl;
        editMode = mode;
        closeMethod = callback;

        myDimensions = new DimensionCollection;

        // Initialize the orgID value
        orgID = $("#orgList").find('option:selected').val();
        // MAke sure there is an active organization
//        if (orgID != "") {


            $("<DIV id='form' ></DIV>").addClass("popupForm").css({ 'width': '650px', 'height': '400px', 'top': '75px', 'left': '100px' }).appendTo('body');
            $("<DIV id='header' ></DIV>").addClass("headerCol").appendTo('#form');
            $("<p></p>").addClass("pageHeader").text('Activity Dimensions').appendTo('#header');


            // Add the Right Pane content

            // Add the first row containing the org label and the org combo box box
            $("<DIV id='OrgRowContainer' ></DIV>").addClass("formRow").css({ 'margin-top': '40px' }).appendTo('#form');
            // Add the name lable and input text box
            $("<DIV id='OrgLabelContainer' ></DIV>").addClass('labelColumn').appendTo('#OrgRowContainer');
            $("<P>Project Team</p>").appendTo('#OrgLabelContainer');
            $("<DIV id='orgInput' ></DIV>").addClass("inputColumn").css({'left':'150px'}).appendTo('#OrgRowContainer');
            $("<SELECT id='cbOrg' ></SELECT>").addClass('basicComboBox').css({ 'width': '200px' }).appendTo("#orgInput");

            $("<DIV id='dimRowContainer' ></DIV>").addClass("formRow").appendTo('#form');
            $("<DIV id='dimLabelContainer'></DIV>").addClass('labelColumn').appendTo('#dimRowContainer');
            $("<P>Dimension</p>").addClass('sectionLabel').appendTo('#dimLabelContainer');
            $("<DIV id='dimInputContainer' ></DIV>").addClass("inputColumn").css({ 'left': '150px' }).appendTo('#dimRowContainer');
            $("<SELECT id='DimensionsList' ></SELECT>").addClass('basicComboBox').prop('disabled', false).css({ 'width': '200px' }).appendTo("#dimInputContainer");

            $("<DIV id='separatorRow' ></DIV>").addClass("formSeparator").appendTo('#form');

            // Add the first row containing the name input box and the role check box
            $("<DIV id='FirstRowContainer' ></DIV>").addClass("formRow").appendTo('#form');
            // Add the name lable and input text box
            $("<DIV id='NameLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#FirstRowContainer');
            $("<P>Name</p>").appendTo('#NameLabelContainer');
            $("<DIV id='NameInputContainer' ></DIV>").addClass("inputColumn").css({ 'left': '150px' }).appendTo('#FirstRowContainer');
            $("<INPUT type='text' id='txtNewName' ></INPUT>").addClass("basicTextBox").css({ 'width': '200px' }).appendTo("#NameInputContainer");

            // Add the Role label and input text box
            $("<DIV id='RoleLabelContainer' ></DIV>").addClass('labelColumn').css({ 'left': '375px' }).appendTo('#FirstRowContainer');
            $("<P>Role</p>").appendTo('#RoleLabelContainer');
            $("<DIV id='roleInput' ></DIV>").addClass("inputColumn").css({ 'left': '425px' }).appendTo('#FirstRowContainer');
            $("<SELECT id='cbRole' ></SELECT>").addClass('basicComboBox').css({'width':'175px'}).appendTo("#roleInput");

            // Add the description
//            $("<DIV id='descriptionContainer' ></DIV>").addClass("listboxCollection").css({ 'margin-top': '15px', 'height': '75px' }).appendTo('#rightPane');
            $("<DIV id='FirstDescriptionRow' ></DIV>").addClass("formRow").css({  'height': '75px' }).appendTo('#form');
            $("<DIV id='DescriptionLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#FirstDescriptionRow');
            $("<P>Description</p>").addClass('sectionLabel').appendTo('#DescriptionLabelContainer');
            $("<DIV id='DescriptionInput' ></DIV>").addClass("inputColumn").css({ 'left': '150px' }).appendTo('#FirstDescriptionRow');
            $("<TextArea id='txtDescription' cols='50' rows='3' ></TextArea>").prop('disabled', false).addClass('formInput').css({'height':'50px'}).appendTo('#DescriptionInput');

            // Add the active flag container
            $("<DIV id='activeFlagRow' ></DIV>").addClass("formRow").appendTo('#form');
            $("<DIV id='activeFlagLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#activeFlagRow');
            $("<input type='checkbox' id='activeFlag' />").addClass("basicCheckBox").appendTo("#activeFlagLabelContainer")
            $("<label for='activeFlag'>Active</label>").addClass("inputColumn").css({ 'left': '25px', 'width': '250px' }).appendTo("#activeFlagLabelContainer");

//            $("<DIV id='activeFlagRow' ></DIV>").addClass("formRow").appendTo('#form');
//            $("<DIV id='activeflagLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#activeFlagRow');
//            $("<input type='checkbox' id='activeFlag' />").addClass("basicCheckBox").appendTo("#activeflagLabelContainer")
//            $("<label for='activeFlag'>Active</label>").addClass("inputColumn").css({ 'left': '25px', 'width': '250px' }).appendTo("#activeflagLabelContainer");


            // Add the navigation bar to the bottom
            $("<DIV id='navBar' ></DIV>").addClass("navigationBar").appendTo('#form');
            $("<p id='navParagraph'></p>").css({ 'text-align': 'center' }).appendTo('#navBar');
            $("<button id='btnSave'></button>").addClass("cellButton").prop('disabled', true).text("Save").on("click", saveDimensionHandler).appendTo("#navParagraph");
            $("#btnSave").hide();
            $("<button id='btnUpdate'> </button>").addClass("cellButton").text("Update").prop('disabled', true).on("click", updateDimensionHandler).appendTo("#navParagraph");
            //        $("#btnUpdate").hide();
            $("<button></button>").addClass("cellButton").text("Close").on("click", closeDimensionForm).appendTo("#navParagraph");

            // load the organization values
            var targetUrl = organizationUrl;

            // Load the currently defined dimensions
            var org = new Organization();
//            loadOrganizations(updateOrganizations);
            loadOrganizationsByCompany(currentCompany.CompanyID, updateOrganizations, pmmodaErrorHandler);
        // Disable editing until an operation is selected
            setEditMode(false);
    }

    /// Delare a fuction to populate the org combo box based on the returned data from the Ajax call
    function updateOrganizations(data) {

        var index = 0;

        $("<option value='-1'></option>").appendTo($('#cbOrg'));
        while (index < data.length) {
            var org = new Organization();
            org.ID = data[index].Id;
            org.Name = data[index].Name;
            org.Description = data[index].Description;
            Organizations.push(org);
            // Add a list item for the organization.
            $("<option value='" + data[index].Id + "'></option>").text(data[index].Name).appendTo($('#cbOrg'));
            index++;
        }
        $("#cbOrg").on("change",dimensionOrgHandler);
    }

    function dimensionOrgHandler() {
        var orgID;

        var currentProjectID = getCookieProjectID();


        // reset the current form
        clearDimensionForm();

        // Get the selected org ID
        orgID = $("#cbOrg").find('option:selected').val();
        
        // Check to see if a valid org has been selected
        if (orgID < 0) {
            setEditMode(false);
        }
        else {
            currentOrg = getCurrentOrganization(orgID, Organizations);

            dimensionDeferred = new $.Deferred();
            loadDimensionsByOrg(currentOrg.ID, refreshDimensions,pmmodaErrorHandler)

            // Call the appropriate Load function on the Role object to get the active roles for the current project
            // Load the role data for the current org
            var targetUrl = RoleUrl + "/" + orgID;

            // Defer loading the role list until the dimensions are loaded
            $.when(dimensionDeferred).then(function () {
                loadRolesByOrganization(orgID, loadRoleList);
            });

            setEditMode(false);

            if (editMode == "new") {
                updateReady = new $.Deferred();
                // Set the org value to -1 when the form is fully loaded
                $.when(updateReady).then(function () { setFormMode("new"); });
            }
        }
    }



    function clearDimensionForm() {
        // Clear any current Dimension detail values
        clearDimensionDetails();
        // Clear the current dimensions listbox
        clearDimensions();
    }


    function loadOrgDetails() {
    }

    // Declare a function to refresh the Dimensions form
    function refreshForm() {
        clearDimensionForm();
        // reload the current dimension values
        var targetUrl = DimensionUrl;
//        myDimensions.Load(currentOrg.ID, targetUrl, refreshDimensions);
        loadDimensionsByOrg(currentOrg.ID, refreshDimensions)

    }

    function clearDimensions() {
        // remove the data rows
        $("#DimensionsList").empty();

    }

    // Declare a function to load the set of dimensions defined for the current organization
    function refreshDimensions(data) {
        var index = 0;
        // reset the dimensions array
        Dimensions.length = 0;
        // Add a blank option to the list box
        $('<option value=0></option>').appendTo($('#DimensionsList'));
        while (index < data.length) {
            var dimension = new Dimension();
            dimension.ID = data[index].ID;
            dimension.Name = data[index].Name;
            dimension.Description = data[index].Description;
            dimension.Role = data[index].Role;
            dimension.isActive = data[index].isActive;
            Dimensions.push(dimension);
            // Add a list item for the organization.
            $("<option value='" + data[index].ID + "'></option>").text(data[index].Name).appendTo($('#DimensionsList'));
            index++;
        }
        // Add the "new" option to indicate a new record should be created
        $("<option value=-1></option>").text("[Add New Dimension...]").appendTo($('#DimensionsList'));
        // Register an event handler on the dimension list
        $("#DimensionsList").change(dimensionSelectHandler);
        dimensionDeferred.resolve();
    }

    // Declare a function to process the current Dimension selection from the list box. This event handler will display the current dimension values and 
    // put the form into update Mode
    function dimensionSelectHandler() {
        var dimension = new Dimension();

        var dimID;

        // Get ID of the currently selected dimension
        dimID = $("#DimensionsList").find('option:selected').val();

        // Check to see if this is a current Dimension or a new dimension
        if (dimID > 0) {
            // Get the current dimension ID value
            dimension = getCurrentDimension($("#DimensionsList").find('option:selected').val());


            // Set the active values
            setActiveDimension(dimension);
            setEditMode(true);
            $("#btnUpdate").show();
            $("#btnSave").hide();
            // Update the current navigatino controls
        }
        else if (dimID == -1) {
            // Proccess the new dimension option
            setEditMode(true);
            clearDimensionDetails();
            // Initialize the active flag
            $('#activeFlag').prop('checked', true);
            $("#btnUpdate").hide();
            $("#btnSave").show();
        }
        else {
            setEditMode(false);
            clearDimensionDetails();
            // Update the current navigatino controls
            $("#btnUpdate").hide();
            $("#btnSave").show();
            //            $("#btnSave").click(saveDimensionHandler);
        }
        // Enable the save button
        $("#btnSave").prop('disabled', false);
    }

    /// Declare an event handler function to process the save dimension event
    function saveDimensionHandler() {
        var dim;

        dim = new Dimension();

        // update organization record
        dim.OrganizationID = currentOrg.ID;
        dim.Name = $("#txtNewName").val();
        dim.Description = $("#txtDescription").val();
        if (dim.Description == undefined) {
            dim.Description = " ";
        }
        dim.Role = $("#cbRole").find('option:selected').val();
        dim.isActive = 1;
        dim.UserID = UserID;

        // Verify that the user specified a name and a role since these are requried fields
        if (dim.Name == "" || dim.Role == undefined) {
            alert("Please enter a value for at least Name and Role")
        }
        else {

            saveDimension(dim, null, pmmodaErrorHandler);

        }
    }


    // Declare a function to insert the new dimension record
    function saveDimension(dimension,callback,errorHandler)
    {
        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // update the target URL
        var targetUrl = DimensionUrl;
        //        $.post(targetUrl, dim);
        $.ajax({
            url: targetUrl,
            type: 'POST',
            dataType: 'json',
            data: dimension,
            headers: headers
        }).done(function (data, txtStatus, jqXHR) {
            refreshForm();
            setEditMode(false);
        }).fail(function (xhr, textStatus, errorThrown) {
            errorHandler(xhr,401);
        });

    }


    function processNewDimension() {
        alert("Callback reached");
    }

    // Declare an function to process the update event
    function updateDimensionHandler() {
        var dim;

        dim = new Dimension();

        // update organization record
        dim.ID = $("#DimensionsList").find('option:selected').val();
        dim.OrganizationID = currentOrg.ID;
        dim.Name = $("#txtNewName").val();
        dim.Description = $("#txtDescription").val();
        dim.Role = $("#cbRole").find('option:selected').val();
        dim.isActive = $('#activeFlag').prop('checked');
        dim.UserID = UserID;

        // Verify that the user specified a name and a role since these are requried fields
        if (dim.Name == "" || dim.Role == undefined) {
            alert("Please enter a value for at least Name and Role")
        }
        else {

            updateDimension(dim, refreshForm,pmmodaErrorHandler)
        }
    }

    // Declare a fucntion to update the passed in Dimension
    function updateDimension(dimension, callback, errorHandler) {

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // update the target URL
        var targetUrl = DimensionUrl + '/' + dimension.ID;
        $.ajax({
            url: targetUrl,
            type: 'PUT',
            dataType: 'json',
            data: dimension,
            headers: headers
        }).done(function (data, txtStatus, jqXHR) {
            //            alert("Update Success");
            callback();
        }).fail(function (xhr, textStatus, errorThrown) {
            errorHandler(xhr,404);
        });
    }

    // Declare a function to clear the current dimension value contents
    function clearDimensionDetails() {

        // Set the current Name
        $("#txtNewName").val("");

        // Set the current description
        $("#txtDescription").val("");

        // Set the current Role value
        $("#cbRole").val(0);

        // Update the active flag
        $("#activeFlag").prop('checked', false);

    }

    // Declre a function that will set the Dimension value controls to be enabled and in edit mode
    function setEditMode(mode) {
        if (mode) {
            $("#txtNewName").prop('disabled', false);
            $("#txtNewName").removeClass('disabledTextBox');
            $("#txtNewName").addClass('basicTextBox');
            $("#txtDescription").prop('disabled', false);
            $("#txtDescription").removeClass('disabledTextBox');
            $("#txtDescription").addClass('basicTextBox');
            $("#cbRole").prop('disabled', false);
            $("#activeFlag").prop('disabled', false);
            // Enable the save/update buttons
            $("#btnSave").prop('disabled', false);
            $("#btnUpdate").prop('disabled', false);
        }
        else {
            $("#txtNewName").prop('disabled', true);
            $("#txtNewName").addClass('disabledTextBox');
            $("#txtNewName").removeClass('basicTextBox');
            $("#txtDescription").prop('disabled', true);
            $("#txtDescription").addClass('disabledTextBox');
            $("#txtDescription").removeClass('basicTextBox');
            $("#cbRole").prop('disabled', true);
            $("#activeFlag").prop('disabled', true);
            // Enable the save/update buttons
            $("#btnSave").prop('disabled', true);
            $("#btnUpdate").prop('disabled', true);
        }
    }

    // Declare a function to set the current form values to the active dimension
    function setActiveDimension(dim) {

        // Set the current Name
        $("#txtNewName").val(dim.Name);

        // Set the current description
        $("#txtDescription").val(dim.Description);

        // Set the current Role value
        $("#cbRole").val(dim.Role);

        // Update the active flag
        if (dim.isActive) {
            $("#activeFlag").prop('checked', true);
        }
        else {
            $("#activeFlag").prop('checked', false);
        }


    }

    // Declare a function that searches through the dimension array and returns the specified dimension
    function getCurrentDimension(ID) {
        var selectedDim = new Dimension();

        for (var index = 0; index < Dimensions.length; index++) {
            if (Dimensions[index].ID == ID) {
                selectedDim = Dimensions[index];
                break;
            }
        }
        return (selectedDim);

    }

    // DEclare a function to populate the Role combo box with the defined roles for the current Organization from the DB. This is a callback function passed 
    // to an instance of the Role object
    function loadRoleList(data) {

        var index = 0;
        // Add a blank option to the combo box
        $('<option></option>').appendTo($('#formOrgList'));
        while (index < data.length) {
            // Filter for the active roles
            if (data[index].isActive) {
                var role = new Role();
                role.ID = data[index].ID;
                role.Name = data[index].Name;
                role.Description = data[index].Description;
                Roles.push(role);
                // Add a list item for the organization.
                $("<option value='" + data[index].ID + "'></option>").text(data[index].Name).appendTo($('#cbRole'));
            }
            index++;
        }
        // Register an event handler on the option list
//        $("#formRoleList").change(roleSelectHandler);

    }


/*

    // Declare a functionl to load the natural units and populate the listbox
    function loadNaturalUnits(data) {
        var index = 0
        while (index < data.length) {
            $("<option value='" + data[index].Id + "'></option>").text(data[index].Name).appendTo($('#NaturalUnitList'));
            index++;
        }
    }
*/

    function closeDimensionForm() {

//        refreshForm();

        closeMethod();
        $("#form").remove();
    }

}
