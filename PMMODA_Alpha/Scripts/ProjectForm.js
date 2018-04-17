"use strict"

var ProjectForm = function () {
    this.show = showProjectForm;
    this.close = closeProjectForm;
    var currentOrg;
    var UserID = 1; // TBD - This needs to be removed when I integrate authentication

    // Declare an object to store the  Role WebApi address
//    var NaturalUnitUrl = "/api/NaturalUnit";
//    var DimensionUrl = "/api/Dimension";
//    var RoleUrl = "/api/Role";
//    var ProjectUrl = "/api/Project";
    // declare a local object to store the collection of Organizations
    var Organizations = [];
    // Declare an array to store the Projects associated with the current organization
    var Projects = [];
    // Declare an object to store the current project
    var currentProject;
    // Declare an array to store the set of Natural Units applicable to the current project
    var NaturalUnits = [];
    // Declare an array to store the dimensions
    var Dimensions = [];
    // Declare a DimensionCollection object to use calling the web service
    var myDimensions;

    // Declare an internal object to indicate whether this you are creating a new org or editing an existing org
    var editMode;
    // Create a deferred object to track when the form is fully loaded
    //    var updateReady;

    // Declare an object to store the main page clean up callback method
    var closeMethod;
    // Declare a Deferred obejct to indicate that the dimension data base been loaded
    var dimensionLoad;
    // Create a Deferred object to synchronize the role update and the staffing update
    var roleDeferred = new $.Deferred();
    // Create a Deffered object instance to ensure the project data is updated before we update the staffing count
    var projectDeferred;
    // Declare a local object to indicate whether the staffing data is dirty
    var staffingIsDirty = false;

    // Declare an array to hold a set of deferreds
    var deferredArray = [];

    var activeRolePromise;


    function showProjectForm(mode, currentOrg, callback) {
        // Declare a local variable to store the query Url
        var targetUrl;
        editMode = mode;

        // Initialize the callback method to call when closing the form
        closeMethod = callback;

        currentProject = new Project();

            $("<DIV id='form' ></DIV>").addClass("popupForm").css({ 'width': '550px', 'height': '650px', 'top': '75px', 'left': '100px' }).appendTo('body');
            $("<DIV id='header' ></DIV>").addClass("headerCol").appendTo('#form');
            $("<p></p>").addClass("pageHeader").text('Projects').appendTo('#header');

            // Add the first row containing the org label and the org combo box box
            $("<DIV id='OrgRowContainer' ></DIV>").addClass("formRow").css({'margin-top':'40px'}).appendTo('#form');
            // Add the name lable and input text box
            $("<DIV id='OrgLabelContainer' ></DIV>").addClass('labelColumn').appendTo('#OrgRowContainer');
            $("<P>Project Team</p>").appendTo('#OrgLabelContainer');
            $("<DIV id='orgInput' ></DIV>").addClass("inputColumn").css({'left':'125px'}).appendTo('#OrgRowContainer');
            $("<SELECT id='cbOrg' ></SELECT>").addClass('basicComboBox').appendTo("#orgInput");


            $("<DIV id='projRowContainer' ></DIV>").addClass("formRow").appendTo('#form');
            $("<DIV id='projLabelContainer'></DIV>").addClass('labelColumn').appendTo('#projRowContainer');
            $("<P>Project</p>").appendTo('#projLabelContainer');
            $("<DIV id='projInputContainer' ></DIV>").addClass("inputColumn").css({ 'left': '125px' }).appendTo('#projRowContainer');
            $("<SELECT id='ProjectList' ></SELECT>").addClass('basicComboBox').prop('disabled', false).on("change", projectSelectHandler).appendTo("#projInputContainer");

            $("<DIV id='separatorRow' ></DIV>").addClass("formSeparator").appendTo('#form');


            // Add the name and the Role controls
//            $("<DIV id='NameRoleContainer' ></DIV>").addClass("formRow").appendTo('#form');
            // Add the first row containing the name input box and the role check box
            $("<DIV id='FirstRowContainer' ></DIV>").addClass("formRow").appendTo('#form');
            // Add the name lable and input text box
            $("<DIV id='NameLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#FirstRowContainer');
            $("<P>Name</p>").appendTo('#NameLabelContainer');
            $("<DIV id='NameInputContainer' ></DIV>").addClass("inputColumn").css({'left':'125px','width':'250px'}).appendTo('#FirstRowContainer');
            $("<INPUT type='text' id='txtNewName' ></INPUT>").addClass("basicTextBox").css({'width':'250px'}).appendTo("#NameInputContainer");

            // Add the description
//            $("<DIV id='descriptionContainer' ></DIV>").addClass("listboxCollection").css({ 'margin-top': '15px', 'height': '75px' }).appendTo('#form');
            $("<DIV id='FirstDescriptionRow' ></DIV>").addClass("formRow").css({ 'height': '75px' }).appendTo('#form');
            $("<DIV id='DescriptionLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#FirstDescriptionRow');
            $("<P>Description</p>").appendTo('#DescriptionLabelContainer');
            $("<DIV id='DescriptionInput' ></DIV>").addClass("inputColumn").css({ 'left': '125px' }).appendTo('#FirstDescriptionRow');
            $("<TextArea id='txtDescription' cols='40' rows='3' ></TextArea>").prop('disabled', false).addClass('formInput').appendTo('#DescriptionInput');

            // Add the Purpose
//            $("<DIV id='purposeContainer' ></DIV>").addClass("listboxCollection").css({ 'margin-top': '15px', 'height': '75px' }).appendTo('#form');
            $("<DIV id='FirstPurposeRow' ></DIV>").addClass("formRow").css({ 'height': '75px' }).appendTo('#form');
            $("<DIV id='purposeLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#FirstPurposeRow');
            $("<P>Purpose</p>").appendTo('#purposeLabelContainer');
            $("<DIV id='purposeInput' ></DIV>").addClass("inputColumn").css({ 'left': '125px' }).appendTo('#FirstPurposeRow');
            $("<TextArea id='txtPurpose' cols='40' rows='3' ></TextArea>").prop('disabled', false).addClass('formInput').appendTo('#purposeInput');


        // Add a row for each applicable role to track staff
        // Add the staffing label
            $("<DIV></DIV>").text("Staffing").css({ 'float': 'left', 'margin-left': '10px', 'margin-top': '15px', 'font-weight': 'bold' }).appendTo("#form");
            $("<DIV id='staffContainer'</DIV>").addClass('staffingContainer').appendTo("#form");
        // Add teh overhead content
            $("<DIV id='staffHeader'</DIV>").addClass('sectionSpan').appendTo("#staffContainer");
            $("<DIV id='roleHeader'></DIV>").text("Role").addClass("staffingLabel").css({'margin-left':'5px', 'width': '150px' }).appendTo("#staffHeader");
            $("<DIV id='roleHeader'></DIV>").text("Count").addClass("staffingLabel").css({ 'width': '100px' }).appendTo("#staffHeader");


            // Add the active flag container
            $("<DIV id='activeFlagSection' ></DIV>").addClass("formRow").css({ 'float': 'left', 'margin-top': '15px', 'background-color': 'transparent' }).appendTo('#form');
            $("<DIV id='activeFlagcontainer'></DIV>").addClass("labelColumn").appendTo("#activeFlagSection");
            $("<input type='checkbox' id='activeFlag' />").addClass("basicCheckBox").appendTo("#activeFlagcontainer")
            $("<label for='activeFlag'>Active</label>").addClass("inputColumn").css({ 'left': '25px', 'width': '250px' }).appendTo("#activeFlagcontainer");


            // Add the navigation bar to the bottom
            $("<DIV id='navBar' ></DIV>").addClass("navigationBar").appendTo('#form');
            $("<p id='navParagraph'></p>").css({ 'text-align': 'center' }).appendTo('#navBar');
            $("<button id='btnSave'></button>").addClass("cellButton").prop('disabled', true).text("Save").on("click", saveProjectHandler).appendTo("#navParagraph");
            $("#btnSave").hide();
            $("<button id='btnUpdate'> </button>").addClass("cellButton").text("Update").prop('disabled', true).on("click", updateProjectHandler).appendTo("#navParagraph");
            //        $("#btnUpdate").hide();
            $("<button></button>").addClass("cellButton").text("Close").on("click", closeProjectForm).appendTo("#navParagraph");

            // Disable the Natural Unit control on initial load
            $("#unitSetContainer").prop('disabled', true);

        // Disable the screen controls until an edit mode is selected
        setEditMode(false);
        // Load the organization data
        loadOrganizationsByCompany(currentCompany.CompanyID, updateOrganizations, pmmodaErrorHandler);
//        loadOrganizationsByCompany(currentCompany.CompanyID, populateOrganizationList, pmmodaErrorHandler)

    }

    /// Declare a function to load the current data into the form
    function loadForm() {

        var projectCollection = new ProjectCollection();
        // Call the appropriate Load function on the ProjectCollection object to get the projects for the current organization
        var targetUrl = ProjectUrl + "/" + currentOrg.ID;

        loadProjectOptions(currentOrg.ID, loadProjectList,errorHandler)

        dimensionLoad = new $.Deferred();

        loadDimensionsByOrg(currentOrg.ID, populateDimensions, errorHandler);
        $.when(dimensionLoad).then(function () {
            loadNaturalUnitsByOrg(currentOrg.ID, refreshNaturalUnits, errorHandler);
        });
        
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
    }


    /// Declare a function to process the organization selection event
    function selectOrgHandler() {
        var orgID;

        // reset the current form
        clearForm();

        // Get the selected org ID
        orgID = $("#cbOrg").find('option:selected').val();
        // Check to make sure this is a valie org
        if (orgID > 0) {
            currentOrg = getCurrentOrganization(orgID, Organizations);
            // TBD - TEst code to prototype authentictation model. Need to set proper copany context
//            var role = currentCompany.Name + "_" + currentOrg.Name + "_" + "Member";
//            orgID = $("#cbOrg").find('option:selected').val();
//            currentOrg = getCurrentOrganization(orgID, Organizations);
            loadForm();
        }
        else
        {
            // Disable the form since this is not a valid org
            setEditMode(false);
            clearProjects();
        }

    }

    // Declre a function to process the access request
    function processAccess(status) {
        if (status) {
            // Get the selected org ID
            orgID = $("#cbOrg").find('option:selected').val();
            currentOrg = getCurrentOrganization(orgID, Organizations);
            loadForm();
        }
        else
        {
            alert("The current user does not have permissions for the selected Organization. Please contact your administator.")
        }
    }

    function errorHandler(response) {
        if (response.status == 401) {

            alert("The current user does not have permissions for the selected Organization. Please contact your administator.")
        }
//        alert(message);
    }

    /// Declare  function to clear the current form content
    function clearForm() {
        // Clear any current Dimension detail values
        clearProjectDetails();
        // Clear the current dimensions listbox
        clearProjects();
    }


    // Declare a function to refresh the Dimensions form
    function refreshForm() {
        // Clear any current Dimension detail values
        clearProjectDetails();
        // Clear the current dimensions listbox
        clearProjects();
        // reset the current project pointer
        currentProject = new Project();

        // reload the current data
        loadForm();
    }

    function clearProjects() {
        // remove the data rows
        $("#ProjectList").empty();

    }

    // Declare a function to load the natural units and populate the listbox
    function refreshNaturalUnits(data) {
        var index = 0
        // Reset the glabal unit array
        NaturalUnits.length = 0;
        while (index < data.length) {
            if (data[index].isActive) {
                // Create a local instance of the current unit
                var unit = new NaturalUnit();
                unit.ID = data[index].ID;
                unit.Name = data[index].Name;
                unit.Description = data[index].Description;
                unit.isActive = data[index].isActive;
                // Add the current unit to the unit array
                NaturalUnits.push(unit);
//                $("<input type='checkbox' id='UnitOption'" + data[index].ID + " value='" + data[index].ID + "'/>" + data[index].Name + "<br />").appendTo($('#unitCheckboxCollection'));
                $("<option value='" + data[index].ID + "'></option>").text(data[index].Name).addClass("disabledElement").prop('disabled',true).appendTo($('#unitCheckboxCollection'));
                // Add the event handler to the Unit options
//                $("#UnitOption" + data[index].ID).css({ 'pointer-events': 'all' }).on("click", unitSelectHandler);
            }
            index++;
        }
    }


    // Declare a function to load the set of dimensions defined for the current organization
    function populateDimensions(data) {
        var index = 0;
        // reset the dimensions array
        Dimensions.length = 0;
        // Add a blank option to the list box
        //        $('<option></option>').appendTo($('#DimensionsList'));
        while (index < data.length) {
            var dimension = new Dimension();
            // only add the active dimensions
//            if (data[index].isActive) {
                dimension.ID = data[index].ID;
                dimension.Name = data[index].Name;
                dimension.Description = data[index].Description;
                dimension.Role = data[index].Role;
                dimension.isActive = data[index].isActive;
                Dimensions.push(dimension);
                // Add a list item for the dimension.
                $("<input type='checkbox' value='" + data[index].ID + "'/>" + data[index].Name + "<br />").on("click",updateDimensionHandler).appendTo($('#dimensionCheckboxCollection'));
//            }
            index++;
        }
        dimensionLoad.resolve();
    }

    function updateDimensionHandler() {

        // Get the current NAtural Unit
        var unit = new NaturalUnit();

        unit = getUnit($("#unitCheckboxCollection").find('option:selected').val());

        // get the current Dimension
        var dim = new Dimension();

        var id = $(this).val();
        dim = getDimension(unit, id);
        dim.isActive = $(this).prop('checked');

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


    // Declare a function to process the current project selection from the list box. This event handler will display the current dimension values and 
    // put the form into update Mode
    function projectSelectHandler() {

        var ProjectID;

        // Get ID of the currently selected dimension
        ProjectID = $("#ProjectList").find('option:selected').val();

        // Check to see if this is a current Dimension or a new dimension
        if (ProjectID > 0) {
            // Get the current dimension ID value
            currentProject = getCurrentProject(ProjectID);

            // load the UnitDimension data for the selected project
            var unit = new NaturalUnit();
//            unit.LoadDimensions(currentProject.ID, loadUnitDimensions);
            loadUnitDimensionsByOrg(currentOrg.ID, loadUnitDimensions);


            // Instantiate a new deferred object to coordinate the staffing and role data load
            activeRolePromise = new $.Deferred();
            // Call the web service to get the set of active roles for the current project
            loadActiveRolesByProject(currentProject.OrganizationID, populateActiveRoles, pmmodaErrorHandler);


            activeRolePromise.done(function () { loadStaffByProject(ProjectID, setActiveRoleCounts, pmmodaErrorHandler); });
            // The callback for this method requires the Staffing collection be populated so this gets called here.
            

        }
        else if (ProjectID == 0) {
            // Handle the case where no project was selected
            setEditMode(false);
            clearProjectDetails();
            // Update the current navigatino controls
            $("#btnUpdate").hide();
            $("#btnSave").show();
        }
        else {
            setEditMode(true);
            clearProjectDetails();
            // Set the active flag true
            $("#activeFlag").prop('checked', true);
            // Update the current navigatino controls
            $("#btnUpdate").hide();
            $("#btnSave").show();
            //            $("#btnSave").click(saveDimensionHandler);
        }
        // Enable the Natural Units list box
        $("#unitSetContainer").prop('disabled', false);

        // Enable the save button
        $("#btnSave").prop('disabled', false);
    }

    /*
    // Declare a funtion to load the defined staff for the current project
    function loadStaffByProject(ProjectID, callback, errorHandler) {
        var targetUrl;

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        targetUrl = StaffUrl + "/" + ProjectID;
        $.ajax({
            url: targetUrl,
            type: 'GET',
            dataType: 'json',
            headers: headers,
        }).done(function (data, txtStatus, jqXHR) {
            //            alert("Insert Success");
            setActiveRoleCounts(data);
        }).fail(function (xhr, textStatus, errorThrown) {
            errorHandler(xhr,1303);
        });

    }

    */

    /// Declare a function to update the current staffing counts for the active roles on this project
    function setActiveRoleCounts(data) {
        // Update the count values
        var index = 0;

        while (index < data.length) {
            // Update the count for the corresponding staff entry
            var newStaff = new Staff();
            newStaff = getCurrentStaff(data[index].MasterRoleID);
            if (newStaff != undefined) {
                newStaff.count = data[index].Count;
            }

            $("#txtCount" + data[index].MasterRoleID).val(data[index].Count); //.focusout({ param1: data[index].MasterRoleID }, validateCount);
            index++;
        }
    }

    // Declare a function to validate the input staffing value
    function validateCount(event) {
        var ID = event.data.param1;
        var value;
//        var re = new RegExp(/^\d+$/);
        var re = new RegExp("^[0-9]+(\.[0-9]{1,2})?$");
        var status;

        // Declare a regular expression to use validating the input

        value = $("#txtCount" + ID).val();
        // verify that there are no non digit characters in the string
        status = re.test(value);

        if (!status) {
            alert("The count field must match a decimal format with an arbitrary number of digits before the decimal and at most 2 digits after the decimal. Please update the value.")
        }

        // set the dirty flag
        staffingIsDirty = true;
//        value = parseFloat(value);
    }


    function getCurrentStaff(ID) {
        var index = 0;
        var selectedIndex;

        while (index < currentProject.Staffing.lenght) {
            if (ID == currentProject.Staffing[index]) {
                selectedIndex = index;
                break;
            }
            index++
        }
        return (selectedIndex);
    }


    /// Declare a method to load the Active Role rows into the role container
    function populateActiveRoles(data) {
//        alert("inside loadActive Roles");

        var index = 0;

        while(index < data.length)
        {
//            if (data[index].isActive) {
                // Declare a new staff object to add to the local collection
                var staff = new Staff();
                Staff.ProjectID = currentProject.ID;
                staff.MasterRoleID = data[index].MasterRoleID;
                staff.Name = data[index].Name;
                currentProject.Staffing.push(staff);
                $("<DIV id='staffRow" + data[index].MasterRoleID + "'></DIV>").addClass('sectionSpan').appendTo("#staffContainer");
                //            $("<DIV id='staffHeader'</DIV>").addClass('sectionSpan').appendTo("#staffContainer");
                $("<DIV id='staffTitle" + data[index].MasterRoleID + "'></DIV>").text(data[index].Name).addClass('staffingEntry').css({ 'margin-left': '5px', 'width': '150px' }).appendTo('#staffRow' + data[index].MasterRoleID)
                $("<INPUT type='text' id='txtCount" + data[index].MasterRoleID + "' ></INPUT>").css({ 'width': '50px' }).appendTo('#staffRow' + data[index].MasterRoleID);
                $("#txtCount" + data[index].MasterRoleID).focusout({ param1: data[index].MasterRoleID }, validateCount);
//            }
            index++;
        }
        if (activeRolePromise != undefined) {
            activeRolePromise.resolve();
        }
    }

    function loadUnitDimensions(ProjectID,data) {

//        var currentProject = new Project();
        // process the data

        // copy the set of NAtural Units to the current project
        var unitCount = 0;
        // Empty the NaturalUnits array for the current project
        currentProject.NaturalUnits.length = 0;
        while (unitCount < NaturalUnits.length)
        {
            var currentUnit = new NaturalUnit();
            // Copy the fields form the baseline Unit record
            currentUnit.ID = NaturalUnits[unitCount].ID;
            currentUnit.Name = NaturalUnits[unitCount].Name;
            currentUnit.Description = NaturalUnits[unitCount].Description;
            currentUnit.UserID = NaturalUnits[unitCount].UserID;
            currentUnit.OrganizationID = NaturalUnits[unitCount].OrganizationID;
            currentUnit.isActive = false; 

            // Loop over the set of dimensions and add a dimension record for each dimension active for the current organization
            var dimCount = 0;
            while (dimCount < Dimensions.length) {
                // Instantiate a new Dimension record
                var dim = new Dimension();
                // copy the fields
                dim.ID = Dimensions[dimCount].ID;
                dim.Name = Dimensions[dimCount].Name;
                dim.Desciption = Dimensions[dimCount].Description;
                dim.isActive = Dimensions[dimCount].false;
                dim.Role = Dimensions[dimCount].Role;
                dim.OrganizationID = Dimensions[dimCount].OrganizationID;
                // Add the new dimension to the currentUnit Dimension array
                currentUnit.Dimensions.push(dim);
                dimCount++;
            }
            // Add the configured Unit record to the unit collection for the current project
            currentProject.NaturalUnits.push(currentUnit);
            unitCount++;
        }

        // loop over the passed in data and enable the active Unit-Dimension pairs
        var index = 0;
        while (index < data.length) {
            // Loop over the current Project units until you find the unit matching the current unit-dim pair
            unitCount = 0;
            while (unitCount < currentProject.NaturalUnits.length) {
                if(currentProject.NaturalUnits[unitCount].ID == data[index].UnitID){
                    // Check to see if the current record is enabled
                    if (data[index].isActive) {
                        currentProject.NaturalUnits[unitCount].isActive = true;
                        // Loop over the dimensions to find the current dimension and enable it
                        dimCount = 0;
                        while (dimCount < currentProject.NaturalUnits[unitCount].Dimensions.length) {
                            // Check to see if the UnitID and the DimensionID math
                            if (currentProject.NaturalUnits[unitCount].ID == data[index].UnitID && currentProject.NaturalUnits[unitCount].Dimensions[dimCount].ID == data[index].DimensionID) {
                                // enable the current record
                                currentProject.NaturalUnits[unitCount].Dimensions[dimCount].isActive = true;
                                // break out of the loop since you have processed this record
                                break;
                            }
                            dimCount++
                        }
                    }
                    // break out of the unit loop since you have processed this record
                    break;
                }
                unitCount++;
            }
            index++;
        }
        // Set the active values
        setActiveProject(currentProject);
        setEditMode(true);
        $("#btnUpdate").show();
        $("#btnSave").hide();

    }

    // Declare a function that searches through the reference dimension array and returns the specified dimension
    function getReferenceDimension(ID) {
        var selectedDim = new Dimension();

        for (var index = 0; index < Dimensions.length; index++) {
            if (Dimensions[index].ID == ID) {
                selectedDim = Dimensions[index];
                break;
            }
        }
        return (selectedDim);

    }


    /// Declare a function to find the current Natural Unit record based on the ID
    function getUnit(ID) {
        var unit = new NaturalUnit();

        // Loop over the NaturalUnit collection for the current project
        var index = 0;
        while (index < currentProject.NaturalUnits.length) {
            if (currentProject.NaturalUnits[index].ID == ID) {
                unit = currentProject.NaturalUnits[index];
                break;
            }
            index++;
        }
        return (unit);
    }

    /// Declare a function to find the current corresponding NAtural Unit in the Reference unit array
    function getReferenceUnit(ID) {
        var unit = new NaturalUnit();

        // Loop over the NaturalUnit collection for the current project
        var index = 0;
        while (index < NaturalUnits.length) {
            if (NaturalUnits[index].ID == ID) {
                unit = NaturalUnits[index];
                break;
            }
            index++;
        }
        return (unit);
    }


    // Declare an event handler to process the Natural Unit selection
    function unitSelectHandler() {
        var unitID;
        var currentUnit = new NaturalUnit;

        unitID = 0;
        // get the current unit ID value
        unitID = $('#unitCheckboxCollection').find('option:selected').val();
        currentUnit = getUnit(unitID);

        // Enable the Dimension collection
        $("#dimensionSetContainer").prop('disabled', false);

        $('#dimensionCheckboxCollection input').each(function (index, value) {
                // reset the current checkbox
            $(value).prop('checked', false);
            // Check to see if the current dimension is active for the current Unit
                // loop over the values in the current unit dimension array
                var count = 0;
                while (count < currentUnit.Dimensions.length) {
                    if ($(value).val() == currentUnit.Dimensions[count].ID) {
                        $(value).prop('checked', currentUnit.Dimensions[count].isActive);
                        //                    $(value).prop('checked', true);
                        break;
                    }
                    count++;
                }
            });

        }

    /// Declare an event handler for the new project event
    function saveProjectHandler() {
        var dim;

        var project = new Project();

        // update organization record
        project.OrganizationID = currentOrg.ID;
        project.Name = $("#txtNewName").val();
        project.Description = $("#txtDescription").val();
        project.Purpose = $("#txtPurpose").val();
        project.isActive = $("#activeFlag").val();
        project.UserID = UserID;

        

        // Make sure the user has supplied the required fields
        if (project.Name == "") {
            alert("Please enter a project Name.");
        }
        else {
            saveNewProject(project, refreshForm,pmmodaErrorHandler);
        }
    }

    // Declare a function to insert the passed in project
    function saveNewProject(project,callback,errorHandler) {
        // declare a local variable to store the constructed URL
        var targetUrl;
        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // update the target URL
        var targetUrl = ProjectUrl;
        $.ajax({
            url: targetUrl,
            type: 'POST',
            dataType: 'json',
            data: project,
            headers: headers
        }).done(function (data, txtStatus, jqXHR) {
            //            alert("Insert Success");
            callback();
        }).fail(function (xhr, textStatus, errorThrown) {
            errorHandler(xhr,1101);
        });
    }

    function processNewProject() {
        alert("Callback reached");
    }

    var UnitDimension = function () {
        this.UnitID;
        this.DimensionID;
        this.ProjectID;
        this.isActive;
        this.UserID;
    }

    // Declare an function to process the update event
    function updateProjectHandler() {

        // Update the project details
        var project = new Project();
        // Update the current values
        project.ID = currentProject.ID;
        project.Name = $("#txtNewName").val();
        project.Description = $("#txtDescription").val();
        project.Purpose = $("#txtPurpose").val();
        project.isActive = $("#activeFlag").prop('checked');
        project.OrganizationID = currentOrg.ID;

        updateProject(project, updateProject, pmmodaErrorHandler);

    }


    // DEclare a function to udpate the passed in project
    function updateProject(project, callback, errorHandler) {
        var targetUrl;

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // update the target URL
        targetUrl = ProjectUrl + "/" + project.ID;
        // Call the web service to update the current project
        projectDeferred = new $.Deferred();

        //        deferredArray.push($.ajax({
        projectDeferred = $.ajax({
            url: targetUrl,
            type: "PUT",
            dataType: "json",
            data: project,
            headers: headers
        }).done(function (data, txtStatus, jqXHR) {
            //            alert("Insert Success");
        }).fail(function (xhr, textStatus, errorThrown) {
            errorHandler(xhr,1104);
        });


        // REfresh the staffing settings
        $.when(projectDeferred).then(function () {
            updateStaffingCounts();
        });
    }

    /// Declare a function to update the staffing counts
    function updateStaffingCounts() {

        var targetUrl = StaffUrl + "/" + currentProject.ID;

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // Loop over the records in teh staffing collection
        var index = 0;
        // check to see if the staffing data is dirty
        if (staffingIsDirty) {
            while (index < currentProject.Staffing.length) {

                var staff = new Staff();

                staff.ProjectID = currentProject.ID;
                staff.MasterRoleID = currentProject.Staffing[index].MasterRoleID;
                staff.Count = $("#txtCount" + currentProject.Staffing[index].MasterRoleID).val();


                staff.isActive = 1;
                staff.UserID = UserID;

                deferredArray.push($.ajax({
                    url: targetUrl,
                    type: "PUT",
                    dataType: "json",
                    data: staff,
                    headers: headers,
                }).done(function (data, txtStatus, jqXHR) {
                    //            alert("Insert Success");
                }).fail(function (xhr, textStatus, errorThrown) {
                    pmmodaErrorHandler(xhr,1304);
                }));
                index++;
            }
        }

        $.when.apply(this, deferredArray).then(function () {
            staffingIsDirty = false;
                    refreshForm();
        });

    }

    function unitDimensionUpdateCompleted() {
    }

    // Declare a function to clear the current dimension value contents
    function clearProjectDetails() {

        // clear the current Name
        $("#txtNewName").val("");

        // clear the current description
        $("#txtDescription").val("");

        // clear the current purpose
        $("#txtPurpose").val("");

        // clear the active flag
        $("#activeFlag").prop('checked', false);

        // Clear the Role counts
        var index = 0;
        while (index < currentProject.Staffing.length) {
            $("#staffRow" + currentProject.Staffing[index].MasterRoleID).remove();
            index++;
        }
        currentProject.Staffing.length = 0;

        // Clear the NAtural Unit and Dimension boxes
//        $("#unitCheckboxCollection").empty();
//        $("#dimensionCheckboxCollection").empty();

    }

    // Declre a function that will set the Dimension value controls to be enabled and in edit mode
    function setEditMode(mode) {
        if (mode) {
            $("#txtNewName").prop('disabled', false);
            $("#txtNewName").removeClass('disabledTextBox')
            $("#txtNewName").addClass('basicTextBox')
            $("#txtDescription").prop('disabled', false);
            $("#txtPurpose").prop('disabled', false);
            $("#activeFlag").prop('disabled', false);
            // Enable the save/update buttons
            $("#btnSave").prop('disabled', false);
            $("#btnUpdate").prop('disabled', false);
        }
        else {
            $("#txtNewName").prop('disabled', true);
            $("#txtNewName").addClass('disabledTextBox')
            $("#txtNewName").removeClass('basicTextBox')
            $("#txtDescription").prop('disabled', true);
            $("#txtPurpose").prop('disabled', true);
            $("#activeFlag").prop('disabled', true);
            // Enable the save/update buttons
            $("#btnSave").prop('disabled', true);
            $("#btnUpdate").prop('disabled', true);
        }
    }

    // Declare a function to set the current form values to the active dimension
    function setActiveProject(project) {

        // Set the current Name
        $("#txtNewName").val(project.Name);

        // Set the current description
        $("#txtDescription").val(project.Description);

        // Set the current purpose
        $("#txtPurpose").val(project.Purpose);

        // Update the active flag
        if (project.isActive) {
            $("#activeFlag").prop('checked', true);
        }
        else {
            $("#activeFlag").prop('checked', false);
        }

        // Loop over the current Natural Unit options and enable them as appropriate
        $('#unitCheckboxCollection option').each(function (index, value) {
            // reset the current checkbox
            $(value).prop('checked', false);
            // Check to see if the current dimension is active for the current Unit
            // loop over the values in the current unit dimension array
            var count = 0;
            while (count < currentProject.NaturalUnits.length) {
                if ($(value).val() == currentProject.NaturalUnits[count].ID) {
                    $(value).addClass('enabledElement').prop('disabled',false);
                    break;
                }
                count++;
            }
        });


    }

    // Declare a function that searches through the dimension array and returns the specified dimension
    function getCurrentProject(ID) {
        var selectedProject = new Project();

        for (var index = 0; index < Projects.length; index++) {
            if (Projects[index].ID == ID) {
                selectedProject = Projects[index];
                break;
            }
        }
        return (selectedProject);

    }

    // DEclare a function to load the current active projects into the Project Management screen
    function loadProjectList(data) {

        var index = 0;
        // reset the Projects array
        Projects.length = 0;

        $("<option value='0'></option>").text("").appendTo($('#ProjectList'));
        while (index < data.length) {
            var project = new Project();
            project.ID = data[index].ID;
            project.OrganizationID = data[index].OrganizationID;
            project.Name = data[index].Name;
            project.Description = data[index].Description;
            project.Purpose = data[index].Purpose;
            project.isActive = data[index].isActive;
            // Make sure the project is active
            if (project.isActive) {
                Projects.push(project);
                // Add a list item for the organization.
                $("<option value='" + data[index].ID + "'></option>").text(data[index].Name).appendTo($('#ProjectList'));
            }
            index++;
        }
        // Add an entry to the Units list box to indicate a New Natural Unit
        $("<option value=-1></option>").text("[Add New Project...]").click("click", newProjectHandler).appendTo("#ProjectList");

    }

    // Declare an event handler for the New Project selection
    function newProjectHandler() {
    }

    /// Declare a function to clean up and close the current form
    function closeProjectForm() {
        // Call the passed in callback method to update the system state
        closeMethod();
        // Close the current form
        $("#form").remove();
    }

}
