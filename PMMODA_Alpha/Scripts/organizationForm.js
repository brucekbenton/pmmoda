"use strict"

var OrganizationForm = function () {
    this.show = showOrganizationForm;
    this.close = closeOrganizationForm;
    var Organizations = [];
    // Declare an array to store the reference Roles
    var referenceRoles = [];
    var currentOrg;
    var UserID = 1; // TBD - This needs to be removed when I integrate authentication

    // Declare an object to store the  Role WebApi address
//    var RoleUrl = "api/Role";

    // Declare an array to store the new Roles which have been addedto an org this session
    var newRoles = [];
    // Declare an internal object to indicate whether this you are creating a new org or editing an existing org
    var editMode;
    // Create a deferred object to track when the form is fully loaded
    var updateReady;
    // declare an objecg to store the call back method to be called when the form is closed
    var updateMasterForm;
    // Declare an array to hold a set of deferreds
    var deferredArray = [];
    // Declare a local object to indicate that the Role data hase been changed and must be updated
    var roleIsDirty = false;
    // Declare a local object to store the current collection of Companies
    var Companies = [];
    // Declare a variable to store the local company for admin mode
    var localCompany;
    // Declrae a class vriable for the timer control
    var timerControl;


    // Populate the initial state of the Organization Management form and display the form
    function showOrganizationForm(mode,callback) {
        // Declare a local variable to store the query Url
        var targetUrl;
        editMode = mode;

        updateMasterForm = callback;

        // Initialize the orgID value
        orgID = $("#orgList").find('option:selected').val();


            $("<DIV id='form' ></DIV>").addClass("popupForm").css({ 'width': '700px', 'height': '700px', 'top': '75px', 'left': '100px' }).appendTo('body');
            $("<DIV id='header' ></DIV>").addClass("headerCol").appendTo('#form');
            $("<p></p>").addClass("pageHeader").text('Project Team').appendTo('#header');

        // Add the first row containing the org label and the org combo box box
            $("<DIV id='CompanyRowContainer' ></DIV>").addClass("formRow").css({ 'margin-top': '40px' }).appendTo('#form');
        // Add the name lable and input text box
            $("<DIV id='CompanyLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#CompanyRowContainer');
            $("<P>Company</p>").appendTo('#CompanyLabelContainer');
            $("<DIV id='companyInput' ></DIV>").addClass("inputColumn").css({ 'left': '125px' }).appendTo('#CompanyRowContainer');
            $("<SELECT id='formCompanyList' ></SELECT>").addClass("basicComboBox").appendTo("#companyInput");

            $("<DIV id='separatorRow' ></DIV>").addClass("formSeparator").appendTo('#form');

        // Add the first row containing the org label and the org combo box box
            $("<DIV id='OrgRowContainer' ></DIV>").addClass("formRow").css({ 'margin-top': '40px' }).appendTo('#form');
        // Add the name lable and input text box
            $("<DIV id='OrgLabelContainer' ></DIV>").addClass('labelColumn').appendTo('#OrgRowContainer');
            $("<P>Project Team</p>").appendTo('#OrgLabelContainer');
            $("<DIV id='orgInput' ></DIV>").addClass("inputColumn").appendTo('#OrgRowContainer');
            $("<SELECT id='formOrgList' ></SELECT>").addClass('basicComboBox').appendTo("#orgInput");



        // Add the first row containing the name input box a
            $("<DIV id='FirstRowContainer' ></DIV>").addClass("formRow").appendTo('#form');
        // Add the name lable and input text box
            $("<DIV id='NameLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#FirstRowContainer');
            $("<P>Name</p>").appendTo('#NameLabelContainer');
            $("<DIV id='NameInputContainer' ></DIV>").addClass("inputColumn").css({'width':'250px'}).appendTo('#FirstRowContainer');
            $("<INPUT type='text' id='txtName' ></INPUT>").addClass("basicTextBox").css({ 'width': '250px' }).appendTo("#NameInputContainer");

            $("<DIV id='FirstDescriptionRow' ></DIV>").addClass("formRow").css({ 'height': '75px'}).appendTo('#form');
            $("<DIV id='DescriptionLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#FirstDescriptionRow');
            $("<P>Description</p>").appendTo('#DescriptionLabelContainer');
            $("<DIV id='DescriptionInput' ></DIV>").addClass("inputColumn").appendTo('#FirstDescriptionRow');
            $("<TextArea id='txtDescription' cols='40' rows='2' ></TextArea>").prop('disabled', true).addClass('formInput').appendTo('#DescriptionInput');


        // Add the Role section
        // Add a link to the Overhead Calculator tool for people to use
            $("<DIV id='toolLink'></DIV>").addClass("formRow").appendTo("#form");
            $("<DIV id='toolLabelContainer' ></DIV>").addClass("inputColumn").css({ 'width':'400px' }).appendTo('#toolLink');
            $("<P id='linkLabel'></P>").text("Use this tool to estimate overhead: ").appendTo("#toolLabelContainer");
            $("<A target='_Blank'></A>").text("Overhead Calculator").prop("href", "http://www.trunbe.com/OverheadCalculator.htm").appendTo("#linkLabel");

        // Add the Role list box collection container
            $("<DIV id='roleRow' ></DIV>").addClass("formRow").css({ 'background-color': 'transparent', 'height': '175px', }).appendTo('#form');
        // Add the label
            $("<DIV id='roleLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#roleRow');
            $("<P>Roles:</p>").appendTo('#roleLabelContainer');
            $("<DIV id='roleInput' ></DIV>").addClass("inputColumn").css({ 'border': '1px solid', 'height': '175px', 'overflow': 'auto' }).appendTo('#roleRow');
        // Add the dimension list box
            $("<div id='orgRoleList' ></div>").css({ 'width': '500px', 'height': '250px', 'background-color': 'transparent' }).appendTo("#roleInput");



        // Add the active flag container
            $("<DIV id='activeFlagRow' ></DIV>").addClass("formRow").appendTo('#form');
            $("<DIV id='activeflagLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#activeFlagRow');
            $("<input type='checkbox' id='activeFlag' />").addClass("basicCheckBox").appendTo("#activeflagLabelContainer")
            $("<label for='activeFlag'>Active</label>").addClass("inputColumn").css({ 'left': '25px', 'width': '250px' }).appendTo("#activeflagLabelContainer");


        // Add the first row containing the Work Day input box a
            $("<DIV id='WorkDayContainer' ></DIV>").addClass("formRow").appendTo('#form');
        // Add the name lable and input text box
            $("<DIV id='WorkDayLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#WorkDayContainer');
            $("<P>Workday </p>").addClass('sectionLabel').appendTo('#WorkDayLabelContainer');
            $("<DIV id='WorkDayInputContainer' ></DIV>").addClass("inputColumn").appendTo('#WorkDayContainer');
            $("<INPUT type='text' id='txtWorkDay' > (Hours)</INPUT>").addClass("formTextBox").css({'width':'30px'}).appendTo("#WorkDayInputContainer");
            $("#txtWorkDay").focusout( validateWorkDay);


            // Add the navigation bar to the bottom
            $("<DIV id='navBar' ></DIV>").addClass("formRow").css({'height':'25px'}).appendTo('#form');
            $("<p id='navParagraph'></p>").css({ 'text-align': 'center' }).appendTo('#navBar');
            $("<button id='btnSave'></button>").addClass("cellButton").prop('disabled', true).text("Save").appendTo("#navParagraph");
            $("<button id='btnUpdate'></button>").addClass("cellButton").on("click", updateOrganizationHandler).prop('disabled', false).text("Update").appendTo("#navParagraph");
            $("<button></button>").addClass("cellButton").text("Close").on("click", closeOrganizationForm).appendTo("#navParagraph");

        // Add a timer bar to track update status
            $("<DIV id='timerBarRow' ></DIV>").addClass("formRow").css({ 'margin-top': '0px'}).appendTo('#form');
            $("<DIV id='statusLabelContainer' ></DIV>").addClass("labelColumn").css({'font-weight':'normal','margin-left':'150px'}).appendTo('#timerBarRow');
            $("<DIV>Status</DIV>").appendTo("#statusLabelContainer");
            $("<DIV id='statusDisplayInput' ></DIV>").addClass("inputColumn").css({'left':'205px','margin-top':'5px'}).appendTo('#timerBarRow');
            $("<DIV id='timerBar' ></DIV>").addClass("timerBar").appendTo("#statusDisplayInput");



            // Declare an event handler for the save button
            $("#btnSave").on("click", saveOrganizationHandler);
            $("#btnSave").hide();

        // Hide the timerBr until the update/save is applied
            $("#timerBarRow").hide();



            var response = new Response();
            response = loadCompanyData(refreshCompanyComboData, localAdminMode);

//            loadForm();
        // Disable the input controls for the default state
        enableOrgControls(false);
    }

    function localAdminMode(response) {
        var promise;

        loadForm(currentCompany);

        // Load the master roles to use when defining the current org roles
        loadMasterRoles(populateMasterRoles, pmmodaErrorHandler);

//        promise = loadCompanyDataByUser(populateCompanyData, pmmodaErrorHandler);

        // Hide the Company select row
        $("#CompanyRowContainer").hide();
        $("#separatorRow").hide();
        $("#OrgRowContainer").css({ 'mrgin-top': '40px' });
    }


    // Declare a method to populate the Company combo box with the updated data
    function refreshCompanyComboData(data) {
        // Delete the current data
        $("#formCompanyList").empty();

        var index = 0;

        $("<option value='0'></option>").appendTo($('#formCompanyList'));
        while (index < data.length) {
            var item = new Company();
            item.CompanyID = data[index].CompanyID;
            item.Name = data[index].Name;
            item.ContactName = data[index].ContactName;
            item.ContactAlias = data[index].ContactAlias;
            item.DomainName = data[index].DomainName;
            item.OrganizationRestricted = data[index].OrganizationRestricted;
            item.ProjectRestricted = data[index].ProjectRestricted;
            item.isActive = data[index].isActive;
            Companies.push(item);
            // Add a list item for the organization.
            $("<option value='" + data[index].CompanyID + "'></option>").text(data[index].Name).appendTo($('#formCompanyList'));
            index++;
        }
 //       $("<option value='-1'></option>").text("[Add New Company ...]").appendTo($('#formCompanyList'));
        $("#formCompanyList").change(companySelectHandler);

//        loadForm();

    }


    /// Declare a function to process the company select event
    function companySelectHandler(event) {
        var companyID;
        // Declare a local variable to store the ID of the current company
        companyID = $("#formCompanyList").find('option:selected').val();
        //        orgID = $("#orgList").find('option:selected').val();
        localCompany = getCurrentCompany(companyID);

        loadForm(localCompany);

        // Load the master roles to use when defining the current org roles
        loadMasterRolesByCompany(localCompany.CompanyID,populateMasterRoles, errorHandler);

        // Set the current company
//        setCompany(companyID);
    }

    function getCurrentCompany(ID) {
        var selectedCompany = new Company();
        var index = 0;

        while (index < Companies.length) {
            if (ID == Companies[index].CompanyID) {
                selectedCompany = Companies[index];
                break;
            }
            index++;
        }
        return (selectedCompany);
    }



    // Validate that the supplied WorkDay number is a decimal number less that 24
    function validateWorkDay() {
        var value = 0;

        value = $("#txtWorkDay").val();

        var re = new RegExp("^[0-9]+(\.[0-9]{1,2})?$");
        var status;

        // Declare a regular expression to use validating the input

        // verify that there are no non digit characters in the string
        status = re.test(value);
        // make sure the number is less than 24
        if (status) {
            value = parseFloat(value);
            if (value >= 24) {
                status = false;
            }
        }

        if (!status) {
            alert("The Workday field must contain a valid number of hours in the work day represented as decimal number less than 24. Please update the value.");
            // Set the work day to the default value
            $("#txtWorkDay").val("8");
        }

    }


    /// Declare a function to load the form meta data
    function loadForm(company) {
        var targetUrl;
        var myOrg = new Organization();

        //        myOrg.load(loadOrganizationList);
        loadOrganizationsByCompany(company.CompanyID, populateOrganizationList, pmmodaErrorHandler)
//        loadOrganizations(loadOrganizationList, loadOrgErrorHandler);


        if (editMode == "new") {
            updateReady = new $.Deferred();
            // Set the org value to -1 when the form is fully loaded
            $.when(updateReady).then(function () { setFormMode("new"); });
        }
    }

    function loadOrgErrorHandler() {
        if (response.status == 401) {
            alert("The current user does not have permissions to load the projects for this organization. Please see your administrator")
        }
        else {
            alert("unspecified error occurred on Web Service Call");
        }
    }


    /// Declare an event handler function to save the current Organization
    function saveOrganizationHandler() {
        // Check to see if the user selected a new org. For a new org you will insert a new record
        var org = new Organization();

        // disabled the login button to avoid multiple events
        $("#btnSave").prop('disabled', true);
        $("#timerBarRow").show();
        timerControl = new statusBar();
        timerControl.Control = $("#timerBar");
        timerControl.Interval = 80;
        timerControl.Start();


        //Get the autentication token
        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // update organization record
        if (localCompany != undefined) {
            org.CompanyID = localCompany.CompanyID;
        }
        else {
            org.CompanyID = currentCompany.CompanyID;
        }

        org.Name = $("#txtName").val();
        org.Description = $("#txtDescription").val();
        org.UserID = UserID;
        org.isActive = $("#activeFlag").prop('checked');
        org.WorkDay = $("#txtWorkDay").val();

        // Make sure the user has supplied the minimum fields
        if (org.Name == "") {
            alert("Please enter a Name for the current organization")
        }
        else {

            // update the target URL
            var targetUrl = organizationUrl;

            // Update the stored data
            $.ajax({
                url: targetUrl,
                type: 'POST',
                dataType: 'json',
                data: org,
                headers: headers,
                success: function (data, txtStatus, xhr) {
                    updateRoles(data.Id);
                    //                    closeOrganizationForm();
                },
                error: function (xhr, textStatus, errorThrown) {
                    errorHandler(xhr);
//                    alert("error2");
                }
            });
        }
    }


    /// Declare an event handler function to update the current Organization
    function updateOrganizationHandler() {
        var org = new Organization();

        // disable the button so a second update cannot occur
        $("#btnUpdate").prop('disabled', true);

        // disabled the login button to avoid multiple events
        $("#timerBarRow").show();
        timerControl = new statusBar();
        timerControl.Control = $("#timerBar");
        timerControl.Interval = 80;
        timerControl.Start();



        //Get the autentication token
        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // update organization record
        org.id = $("#formOrgList").find('option:selected').val();
        // Check to see if the current org is defined
        if(org.id != undefined){
            org.Name = $("#txtName").val();
            org.Description = $("#txtDescription").val();
            org.UserID = UserID;
            org.isActive = $("#activeFlag").prop('checked');
            org.WorkDay = $("#txtWorkDay").val();

            // Make sure the user has supplied the minimum fields
            if (org.Name == "") {
                alert("Please enter a Name for the current organization")
            }
            else {

                // update the target URL
                var targetUrl = organizationUrl + "/" + org.id;

                // Update the stored data
                $.ajax({
                    url: targetUrl,
                    type: 'PUT',
                    dataType: 'json',
                    data: org,
                    headers: headers,
                    success: function (data, txtStatus, xhr) {
                        // update the roles if needed
                        updateRoles(org.id);
                        //                    closeOrganizationForm();
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        pmmodaErrorHandler(xhr,804);
                    }
                });
            }
        }
        else {
            // Set the form to disabled
            enableOrgControls(false);
        }
        }
    
    // Declare a function to save the updated set of active roles for the current organization
    function updateRoles(id) {

        // update the target URL
        var targetUrl = RoleUrl;

        //Get the autentication token
        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // Loop over the roles in the newRole collection
        if (roleIsDirty) {
            for (var index = 0; index < currentOrg.Roles.length; index++) {
                var newValue = new Role();
                newValue.ID = currentOrg.Roles[index].ID;
                newValue.MasterRoleID = currentOrg.Roles[index].MasterRoleID;
                newValue.UserID = UserID;
                newValue.OrganizationID = currentOrg.ID;
                newValue.Overhead = $("#txtOverhead" + newValue.MasterRoleID).val();
                newValue.isActive = currentOrg.Roles[index].isActive;

//                deferredArray.push(updateRole(newValue, "", pmmodaErrorHandler));

                // Update the stored data
                deferredArray.push($.ajax({
                    url: targetUrl,
                    type: 'PUT',
                    dataType: 'json',
                    data: newValue,
                    headers: headers,
                    success: function (data, txtStatus, xhr) {
                        $("#btnUpdate").prop('disabled', false);
                        $("#timerBarRow").hide();
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        pmmodaErrorHandler(xhr, 1204);
                    }
                }));


            }
        }
        $.when.apply(this, deferredArray).then(function () {
            // reset the dirty flag on the roles
            roleIsDirty = false;
            clearFormContent();
            $("#btnUpdate").prop('disabled', false);
            timerControl.Stop();
            $("#timerBarRow").hide();
            // check to see if the local company value has been set. This means that you are in SU mode
            if (localCompany != undefined) {
                loadForm(localCompany);
            }
            else {
                loadForm(currentCompany);
            }
            enableOrgControls(false);
        });

    }


    /// Declare a funcion to populate the Master Role listbox
    function populateMasterRoles(data) {
        var index = 0;

        // empty any current records
        $("#orgRoleList").empty();

        while (index < data.length) {
            // Declare a local Role object
            var role = new Role();
            role.ID = data[index].ID;
            role.Name = data[index].Name;
            role.Description = data[index].Description;
            // Add the current role to the referece role array
            referenceRoles.push(role);
            // Add a list item for the organization.
            // Add a check box for each master role
            $("<DIV id='rowContainer" + data[index].ID + "'</DIV>").addClass("sectionSpan").css({ 'background-color': 'transparent' }).appendTo("#orgRoleList");
            $("<input type='checkbox' id='role" + data[index].ID + "'/>").val(data[index].ID).css({ 'margin-left': '15px' }).prop('disabled', true).on("click", activateRole).appendTo("#rowContainer" + data[index].ID);
            $("<label for='role" + data[index].ID + "'>" + data[index].Name + " </label>").addClass("sectionLabel").css({'margin-left':'10px','font-weight':'normal','width':'200px'}).appendTo("#rowContainer" + data[index].ID);

            // Add teh overhead content
            $("<DIV id='overheadContainer" + data[index].ID + "'></DIV>").addClass("overheadContainer").appendTo("#rowContainer" + data[index].ID);
            $("<p></p>").text("Overhead:").css({'float':'left'}).appendTo("#overheadContainer" + data[index].ID);
            $("<input type='text' id='txtOverhead" + data[index].ID + "'</input>").addClass("overheadTextBox").appendTo("#overheadContainer" + data[index].ID);
            // apply an input validation event handler on the text box
            $("#txtOverhead" + data[index].ID).focusout({ param1: data[index].ID },validateOverhead);
            index++;
        }
        $("#masterRoleList").change(masterRoleSelectHandler);
        if (editMode == "new") {
            updateReady.resolve();
        }
    }

    function validateOverhead(event) {
        var ID = event.data.param1;
        var value=0;
        var strVal;

        value = $("#txtOverhead" + ID).val();
        value = parseFloat(value);
        // Make sure the value is a valid overhead
        if (value > 0 && value <= 1) {
//            strVal = (parseFloat(value)).toFixed(2);
        }
        else if (value > 1 && value <= 100) {
//            strVal = (parseFloat(value / 100)).toFixed(2);
            // Update the stored overhead value
            var record;
            record = getCurrentRole(ID);
            if (record != undefined) {
                record.Overhead = value / 100;
                $("#txtOverhead" + ID).val(record.Overhead);
            }
        }
        else {
            strVal = "0";
            $("#txtOverhead" + ID).val(0);
        }

        // Set the dirty flag since at least one Role has been udpated
        roleIsDirty = true;
//        alert("Overhead value: " + strVal);
    }

    /// Declare a function to process the enable/disable event on the role list
    function activateRole() {
        var id;

        id = $(this).val();
        
        // Look for the selected role in the currentOrg.Roles collection first
        role = getCurrentRole(id);
        // IF this is undefined create a new record and add it to the collection
        if (role.ID == undefined) {
            var role = new Role();
            role = getReferenceRole(id);
            // Adjust for the Role ID and Master Role ID
            role.MasterRoleID = role.ID;
            role.ID = undefined;
            currentOrg.Roles.push(role);
        }
        role.isActive = $(this).prop('checked');
        // Set the dirty flag since at least one Role has been udpated
        roleIsDirty = true;


    }



    function getReferenceRole(ID) {
        var selectedRole = new Role();
        var index = 0;

        // loop over the current role set
        while (index < referenceRoles.length) {
            if (ID == referenceRoles[index].ID) {
                selectedRole = referenceRoles[index];
                break;
            }
            index++;
        }
        return (selectedRole);
    }


    // Declare a function to search the currentOrg role collection for the specified ID
    function getCurrentRole(ID) {
        var selectedRole = new Role();
        var index = 0;

        // loop over the current role set
        // Make sure the current org is defined
        if (currentOrg != undefined) {
            while (index < currentOrg.Roles.length) {
                if (ID == currentOrg.Roles[index].MasterRoleID) {
                    selectedRole = currentOrg.Roles[index];
                    break;
                }
                index++;
            }
        }
        return (selectedRole);
    }


    function masterRoleSelectHandler() {
        // Enable the add button
        $("#btnAdd").prop('disabled', false);
    }

    // Declare a function to process the add button event on the role List
    function addRoleHandler() {
        var newRole;

        newRole = new Role();
        // add the currently selected Role to the org role collection
        newRole.ID = $("#masterRoleList").find('option:selected').val();
        newRole.Name = $("#masterRoleList").find('option:selected').text();
        newRole.Description = "";
        // Check to make sure the selected role is not already active for the current organization
        if ($.inArray(newRole.Name, roleNameCollection) == -1) {
            roleIDCollection.push(newRole.ID);
            roleNameCollection.push(newRole.Name);
            roleCollection.push(newRole);
            // Add the current role to the new roles collection. This will be used to save changes
            newRoles.push(newRole);
            $("<option value='" + newRole.ID + "'></option>").text(newRole.Name).appendTo($('#orgRoleList'));
        }
        else {
            alert("The current selected role has already been added and cannot be added again");
        }
    }

    /// Declare a function to reset the organization specific role list box
    function resetRoleListbox() {
        // Reset the role settings
        $('#orgRoleList input').each(function (index, value) {
            $(value).prop('checked', false);
        });

//        $("#orgRoleList").empty();
        roleCollection.length = 0;
        roleNameCollection.length = 0;
        roleIDCollection.length = 0;
        currentOrg.Roles.length = 0;
    }

    /// Declare a function to process the Remove Role event request
    function removeRoleHandler() {
        alert("Remove Selected Role - This feature is not yet implemented");
    }

    // DEclare a function to populate the Organization combo box wiht the currently defined set of organizations from the DB. This is a callback function passed 
    // to an instance of the Organization object
    function populateOrganizationList(data) {

        var index = 0;

        $('#formOrgList').empty();
        // Add a blank option to the combo box
        $('<option></option>').appendTo($('#formOrgList'));
        while (index < data.length) {
            var org = new Organization();
            org.ID = data[index].Id;
            org.Name = data[index].Name;
            org.Description = data[index].Description;
            org.isActive = data[index].isActive;
            org.WorkDay = data[index].WorkDay;
            Organizations.push(org);
            // Add a list item for the organization.
            $("<option value='" + data[index].Id + "'></option>").text(data[index].Name).appendTo($('#formOrgList'));
            index++;
        }
        // Check to see if the current user has rights to create new organizations
        var role = currentCompany.Name + "_Admin";
        validateAccess(addNewOrgOption, orgAdminErrorHandler, role)
        // Register an event handler on the option list
        $("#formOrgList").change(orgSelectHandler);

    }

    function addNewOrgOption() {
        $("<option value='-1'></option>").text("[Add New Project Team...]").appendTo($('#formOrgList'));
    }

    function orgAdminErrorHandler(resonse){
//        alert(response);
    }

    // Event handler to process new selections in the Organization combo box
    function orgSelectHandler(event) {
        var id;

        id = $("#formOrgList").find('option:selected').val();

        currentOrg = new Organization();

        if (id > 0) {
            currentOrg = getCurrentOrganization(id);
            setFormMode("update");
        }
        else if (id == -1) {
            setFormMode("new");
            enableOrgControls(true);
        }
        else {
            clearDetailContent();
            //            setFormMode("new");
            enableOrgControls(false);
        }
    }



    // Configure the Organization form to the proper input mode based on the desired operation. This method will control
    // the individual control statuses based on whether this is a new organization or an edit of an existing org
    function setFormMode(mode) {

        var org;

        org = new Organization();
        // reset the form content prior to loading a new organiation
        clearDetailContent();

        if (mode == "new") {
            // Change the save button title to "Update"
            $("#btnSave").show();
            $("#btnUpdate").hide();

            $("#txtName").prop('disabled', false);
            $("#txtName").removeClass('disabledTextBox');
            $("#txtName").addClass('basicTextBox');

            // Disable the Role control since you cannot specify Roles on org creation
            $('#roleInput :input').prop('disabled', true);
            $('#roleInput').css({ 'pointer-events': 'none' });

            $("#activeFlag").prop('checked', true);
            $("#txtWorkDay").val("8");

            // reset the role collection
            roleCollection.length = 0;
            // Initialize the org ID
            org.ID = -1;
        }
        else {
            // Clear the current results
            clearDetailContent();
            // get the organization associated with the current selected org ID
            org = getCurrentOrganization($("#formOrgList").find('option:selected').val());
            // Change the save button title to "Update"
            $("#btnSave").hide();
            $("#btnUpdate").show();

            // Enable the Role control 
            $('#roleInput :input').prop('disabled', false);
            $('#roleInput').css({ 'pointer-events': 'all' });

            // Populate the controls with the current org values
            $("#txtName").val(org.Name);
            $("#txtDescription").val(org.Description);
            $("#activeFlag").prop('checked', org.isActive);
            // Update the Work Day value
            $("#txtWorkDay").val(org.WorkDay);
            // Load the role data for the current org
            var targetUrl = RoleUrl + "?Id=" + org.ID;
            var myOrg = new Organization();
            // Load the role data for the current organization
            loadRolesByOrganization(org.ID, populateCurrentRoles, pmmodaErrorHandler);
            enableOrgControls(true);

            /*
            $.ajax({
                url: targetUrl,
                type: 'GET',
                dataType: 'json',
                success: function (data, txtStatus, xhr) {
                    populateCurrentRoles(data);
                    //                updateRoles(org.id);
                    //                    closeOrganizationForm();
                },
                error: function (xhr, textStatus, errorThrown) {
                    var response = xhr.getResponseHeader("Location");
                    alert("error2: " + response);
                }
            });
            */
        }
        // Set the class variable containing the current organization
        currentOrg = org;
    }

    /// declare a function to clear all form content including master data
    function clearFormContent() {
        $("#formOrgList").empty();
        Organizations.length = 0;
        // Reset the name field
        clearDetailContent();
        currentOrg = undefined;
    }

    /// Declare a function to clear the detail content for the selected org
    function clearDetailContent() {

        $("#txtName").val("");
        $("#txtDescription").val("");
        $("#activeFlag").prop('checked', false);
        $("#txtWorkDay").val("");

        // Loop over the current role set and clear the overhead boxes
        var index = 0;

        // Loop over the defined dimensions and set them active as apporpriate
        $.each($('.overheadTextBox'), function (index, value) {
            $(value).val("");
        });

        resetRoleListbox();
    }

    // Declare a function to populate the role list for the current org after the data has loaded
    function populateCurrentRoles(data) {
        // Reset the Role list box to delete and current records
        resetRoleListbox()

        // Reset the Role array for the current ORg
        currentOrg.Roles.length = 0;
        var dummy2 = "text";
        // Loop over the defined dimensions and set them active as apporpriate
        $('#orgRoleList input').each(function (index, value) {
            $(value).prop('checked', false);
            // loop over the values in the current unit dimension array
            var count = 0;
            while (count < data.length) {
                if ($(value).val() == data[count].MasterRoleID) {

                    $(value).prop('checked', data[count].isActive);
                    // Update the overhead value
                    $("#txtOverhead" + data[count].MasterRoleID).val(data[count].Overhead);
                    // Add the current role to the orgRoles array
                    var newRole = new Role();
                    newRole.ID = data[count].ID;
                    newRole.MasterRoleID = data[count].MasterRoleID;
                    newRole.Overhead = data[count].Overhead;
                    newRole.OrganizationID = currentOrg.ID;
                    newRole.isActive = data[count].isActive;
                    currentOrg.Roles.push(newRole);
                    break;
                }
                count++;
            }
        });
        var dummy = "text";
    }

    /// Declare a function to loop through th eorganization list and return the org corresponding to the supplied ID
    function getCurrentOrganization(ID) {
        var selectedOrg = new Organization();

        for (var index = 0; index < Organizations.length; index++) {
            if (Organizations[index].ID == ID) {
                selectedOrg = Organizations[index];
                break;
            }
        }
        return (selectedOrg);
    }

    /// Declare a method to enable/disable the org input controls
    function enableOrgControls(status) {
        // The org selection combo should always be enabled
        $("#formOrgList").prop('disable', false);
        if (status) {
//            $("#txtName").prop('disabled', false);
//            $("#txtName").removeClass('disabledTextBox');
//            $("#txtName").addClass('basicTextBox');
            $("#txtDescription").prop('disabled', false);
//            $('#roleContainer :input').prop('disabled', false);
//            $('#roleContainer').css({ 'pointer-events': 'all' });
            $("#activeFlag").prop('disabled', false);
            $("#txtWorkDay").prop('disabled',false);
            $("#txtWorkDay").removeClass('disabledTextBox');
            $("#txtWorkDay").addClass('basicTextBox');
            // Enable the save button
            $("#btnSave").prop('disabled', false);
        }
        else {
            $('#roleContainer :input').prop('disabled', true);
            $('#roleContainer').css({ 'pointer-events': 'none' });

            $("#txtName").prop('disabled', true);
            $("#txtName").addClass('disabledTextBox');
            $("#txtName").removeClass('basicTextBox');
            $("#txtDescription").prop('disabled', true);
            // Disable the Role control since you cannot specify Roles on org creation
            //            $("#orgRoleList").prop('disabled', true);
            $("#activeFlag").prop('disabled', true);
            $("#txtWorkDay").prop('disabled', true);
            $("#txtWorkDay").addClass('disabledTextBox');
            $("#txtWorkDay").removeClass('basicTextBox');

        }
    }

    /// Declare a function to reset the screen content after an update or a save
    function clearForm() {

        $("#formOrgList").empty();
        $("#txtName").val("");
        $("#txtDescription").val("");
        $("#activeFlag").prop('checked', false);
        $("#orgRoleList").empty();
    }

    function closeOrganizationForm() {
        // execute the callback to cleanup the main page state
        updateMasterForm();
        $("#form").remove();
    }

}