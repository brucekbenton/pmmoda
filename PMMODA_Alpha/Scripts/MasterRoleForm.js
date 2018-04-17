"use strict"

var MasterRoleForm = function () {
    this.show = showMasterRoleForm;
    this.close = closeMasterRoleForm;
    // Declare an array to store the reference Roles
    var referenceRoles = [];

    // Declare an object to store the  Role WebApi address
//    var RoleUrl = "api/Role";

    // Declare a local object to store the current collection of Companies
    var Companies = [];
    // Declare a variable to store the local company for admin mode
    var localCompany;
    // Declare an internal object to indicate whether the current user is a SuperUser
    var isSuperUser = false;
    // Create a deferred object to track when the form is fully loaded
    var updateReady;
    // Declrae a class vriable for the timer control
    var timerControl;
    // declare an objecg to store the call back method to be called when the form is closed
    var updateMasterForm;
    // Delare a class variable to track whether any roles rae currently selected
    var roleIsDirty = false;


    // Populate the initial state of the Organization Management form and display the form
    function showMasterRoleForm(su_mode, callback) {
        // Declare a local variable to store the query Url
        var targetUrl;
        isSuperUser = su_mode;

        updateMasterForm = callback;

        // Initialize the orgID value
        orgID = $("#orgList").find('option:selected').val();


        $("<DIV id='form' ></DIV>").addClass("popupForm").css({ 'width': '650px', 'height': '425px', 'top': '75px', 'left': '100px' }).appendTo('body');
        $("<DIV id='header' ></DIV>").addClass("headerCol").appendTo('#form');
        $("<p></p>").addClass("pageHeader").text('Master Roles').appendTo('#header');

        // check for SuperUser Mode
        if (su_mode) {
            // Add the first row containing the Company label and the company combo box box
            $("<DIV id='CompanyRowContainer' ></DIV>").addClass("formRow").css({ 'margin-top': '40px' }).appendTo('#form');
            // Add the name lable and input text box
            $("<DIV id='CompanyLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#CompanyRowContainer');
            $("<P>Company</p>").appendTo('#CompanyLabelContainer');
            $("<DIV id='companyInput' ></DIV>").addClass("inputColumn").css({ 'left': '125px' }).appendTo('#CompanyRowContainer');
            $("<SELECT id='formCompanyList' ></SELECT>").addClass("basicComboBox").appendTo("#companyInput");

            $("<DIV id='separatorRow' ></DIV>").addClass("formSeparator").appendTo('#form');
        }



        // Add the first row containing the name input box a
        $("<DIV id='FirstRowContainer' ></DIV>").addClass("formRow").appendTo('#form');
        // Add the name lable and input text box
        $("<DIV id='NameLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#FirstRowContainer');
        $("<P>Role</p>").appendTo('#NameLabelContainer');
        $("<DIV id='NameInputContainer' ></DIV>").addClass("inputColumn").css({'width':'250px'}).appendTo('#FirstRowContainer');
        $("<INPUT type='text' id='txtName' ></INPUT>").addClass("basicTextBox").css({ 'width': '250px' }).on('keyup',roleNameHandler).appendTo("#NameInputContainer");
        $("<DIV id='buttonContainer' ></DIV>").addClass("inputColumn").css({'left':'400px', 'width': '75px' }).appendTo('#FirstRowContainer');
        $("<BUTTON id='btnAdd'>Add</BUTTON>").addClass("cellButton").on('click', saveNewRoleHandler).appendTo("#buttonContainer");


        // Add the Role list box collection container
        $("<DIV id='roleRow' ></DIV>").addClass("formRow").css({ 'background-color': 'transparent', 'height': '175px', }).appendTo('#form');
        // Add the label
        $("<DIV id='roleLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#roleRow');
        $("<P>Master Roles:</p>").appendTo('#roleLabelContainer');
        $("<DIV id='roleInput' ></DIV>").addClass("inputColumn").css({ 'border': '1px solid', 'height': '175px', 'overflow': 'auto' }).appendTo('#roleRow');
        // Add the dimension list box
        $("<div id='orgRoleList' ></div>").css({ 'width': '400px', 'height': '250px', 'background-color': 'transparent' }).appendTo("#roleInput");
        $("<BUTTON id='btnRemove'>Remove</BUTTON>").addClass("cellButton").css({ 'margin-left': '550px', 'width': '70px' }).on('click', removeRoleHandler).appendTo("#roleRow");



        // Add the navigation bar to the bottom
        $("<DIV id='navBar' ></DIV>").addClass("formRow").css({'height':'25px'}).appendTo('#form');
        $("<p id='navParagraph'></p>").css({ 'text-align': 'center' }).appendTo('#navBar');
        $("<button></button>").addClass("cellButton").text("Close").on("click", closeMasterRoleForm).appendTo("#navParagraph");

        // Add a timer bar to track update status
            $("<DIV id='timerBarRow' ></DIV>").addClass("formRow").css({ 'margin-top': '0px'}).appendTo('#form');
            $("<DIV id='statusLabelContainer' ></DIV>").addClass("labelColumn").css({'font-weight':'normal','margin-left':'150px'}).appendTo('#timerBarRow');
            $("<DIV>Status</DIV>").appendTo("#statusLabelContainer");
            $("<DIV id='statusDisplayInput' ></DIV>").addClass("inputColumn").css({'left':'205px','margin-top':'5px'}).appendTo('#timerBarRow');
            $("<DIV id='timerBar' ></DIV>").addClass("timerBar").appendTo("#statusDisplayInput");


        // Hide the timerBr until the update/save is applied
        $("#timerBarRow").hide();
        // Disabel teh remove button and the add button until they have input
        $("#btnRemove").prop('disabled', true);
        $("#btnRemove").addClass("disabledCellButton2");
        $("#btnAdd").prop('disabled', true);
        $("#btnAdd").addClass("disabledCellButton2");


        //Check to see if the form is in SuperUSer Mode
        if (isSuperUser) {
            var response = new Response();
            response = loadCompanyData(refreshCompanyComboData, "");

        }
        else {
            // Load the master roles 
            loadMasterRoles(populateMasterRoles, errorHandler);

        }

    }

    // Declare a function to process the add Master Role event
    function saveNewRoleHandler(event) {
        // get the new Master Role name
        var newRole = new MasterRole();
        newRole.Name = $("#txtName").val();
        newRole.Description = "temp";
        newRole.isActive = 1;
        // Check the current user mode. If the current user is a SuperUser then the CompanyID vlaue here will get used. 
        // Otherwise the server will assign the company ID for the current user
        if (isSuperUser) {
            newRole.CompanyID = localCompany.CompanyID;
        }
        // Add the new role to the Master role data store for this company
        SaveNewMasterRole(newRole);
    }

    // Declare a function to save the new master role
    function SaveNewMasterRole(role) {

        var promise;

        $("#timerBarRow").show();
        timerControl = new statusBar();
        timerControl.Control = $("#timerBar");
        timerControl.Interval = 80;
        timerControl.Start();


        // update the target URL
        var targetUrl = MasterRoleUrl;

        //Get the autentication token
        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

            // Update the stored data
            promise = $.ajax({
                url: targetUrl,
                type: 'POST',
                data: role,
                headers: headers,
                success: function (data, txtStatus, xhr) {
                    //                        $("#btnUpdate").prop('disabled', false);
                    timerControl.Stop();
                    $("#timerBarRow").hide();
                    $("#txtName").val("");
                    $("#btnAdd").prop('disabled', true);
                    $("#btnAdd").addClass("disabledCellButton2");
                    loadForm(currentCompany);
                },
                error: function (xhr, textStatus, errorThrown) {
                    timerControl.Stop();
                    $("#timerBarRow").hide();
                    pmmodaErrorHandler(xhr, 1204);
                }
            });

            return (promise);
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
        $("#formCompanyList").change(companySelectHandler);


    }

    // Declare an event handler for new role name text box
    function roleNameHandler(event) {
        // check to see if the box has any content
        var name = $("#txtName").val();
        if (name.length > 0) {
            $("#btnAdd").prop('disabled', false);
            $("#btnAdd").removeClass("disabledCellButton2");
        }
        else {
            $("#btnAdd").prop('disabled', true);
            $("#btnAdd").addClass("disabledCellButton2");

        }

    }


    /// Declare a function to process the company select event
    function companySelectHandler(event) {
        var companyID;
        // Declare a local variable to store the ID of the current company
        companyID = $("#formCompanyList").find('option:selected').val();
        //        orgID = $("#orgList").find('option:selected').val();
        if (companyID > 0) {
            localCompany = getCurrentCompany(companyID);

            // Load the master roles to use when defining the current org roles
            loadMasterRolesByCompany(companyID, populateMasterRoles, errorHandler);

            loadForm(localCompany);
        }
        else {
            clearDetailContent();
        }
    }

    // Declre a convenience function to get the company record corresponding to the passed in ID
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


    /// Declare a function to load the Master Role data based on the user mode
    function loadForm(company) {

        if (isSuperUser) {
            // Load the master roles 
            loadMasterRolesByCompany(localCompany.CompanyID, populateMasterRoles, errorHandler);

        }
        else {
            // Load the master roles 
            loadMasterRoles(populateMasterRoles, errorHandler);

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


                // Update the stored data
                deferredArray.push($.ajax({
                    url: targetUrl,
                    type: 'PUT',
                    dataType: 'json',
                    data: newValue,
                    headers: headers,
                    success: function (data, txtStatus, xhr) {
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
//            $("#btnUpdate").prop('disabled', false);
            timerControl.Stop();
            $("#timerBarRow").hide();
        });

    }


    /// Declare a funcion to populate the Master Role listbox
    function populateMasterRoles(data) {
        var index = 0;

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
            $("<DIV id='rowContainer" + data[index].ID + "'</DIV>").addClass("sectionSpan").appendTo("#orgRoleList");
//            var node = <label for = 'role" + data[index].ID + "'>" + data[index].Name + "</label>";
            $("<input type='checkbox' id='role" + data[index].ID + "'/>").val(data[index].ID).css({ 'margin-left': '15px' }).on("click", activateRole).appendTo("#rowContainer" + data[index].ID);
            $("<label for='role" + data[index].ID + "'>" + data[index].Name + " </label>").addClass("sectionLabel").css({'margin-left':'10px','font-weight':'normal','width':'200px'}).appendTo("#rowContainer" + data[index].ID);
            index++;
        }
        $("#masterRoleList").change(masterRoleSelectHandler);
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
        checkAllRoles();
        if (roleIsDirty) {
            $("#btnRemove").prop('disabled', false);
            $("#btnRemove").removeClass("disabledCellButton2");
        }
        else {
            $("#btnRemove").prop('disabled', true);
            $("#btnRemove").addClass("disabledCellButton2");
        }
    }

    // Declare a function to check if any roles are currently selected
    function checkAllRoles() {
        roleIsDirty = false;
        $('#orgRoleList input').each(function (index, value) {
            if ($(value).prop('checked')) {
                roleIsDirty = true;
            }
            });
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
        $("#orgRoleList").empty();
    }

    /// Declare a function to process the Remove Role event request
    function removeRoleHandler() {
        alert("Remove Selected Role - This feature is not yet implemented");

        // Loop over the roles in teh list box
        $.each($("#orgRoleList input"), function (index, value) {
            // check to see if the current record is selected
            if ($(value).prop('checked')) {
                // Delete the current record
                var role = new MasterRole();
                role.ID = $(value).val();
                role.name = $("label[for='role" + role.ID + "']").text();
//                deleteRole(role);
            }
            
        });
    }

    /// Declre a function to delete the specific role
    function deleteRole(role) {
        // update the target URL
        var targetUrl = MasterRoleUrl;

        //Get the autentication token
        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        deferredArray.push($.ajax({
            url: targetUrl,
            type: 'DELETE',
            dataType: 'json',
            data: role,
            headers: headers,
            success: function (data, txtStatus, xhr) {
                //                        $("#btnUpdate").prop('disabled', false);
//                $("#timerBarRow").hide();
            },
            error: function (xhr, textStatus, errorThrown) {
                pmmodaErrorHandler(xhr, 505);
            }
        }));


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
        $("#btnAdd").prop('disabled', true);
        $("#btnAdd").addClass("disabledCellButton2");

        resetRoleListbox();
    }


    /*
    /// Declare a method to enable/disable the org input controls
    function enableOrgControls(status) {
        // The org selection combo should always be enabled
        $("#formOrgList").prop('disabled', false);
        if (status) {
            $("#txtDescription").prop('disabled', false);
        }
        else {
//            $('#roleContainer :input').prop('disabled', true);
//            $('#roleContainer').css({ 'pointer-events': 'none' });

            // Disable the Role control since you cannot specify Roles on org creation
            //            $("#orgRoleList").prop('disabled', true);

        }
    }
    */

    /// Declare a function to reset the screen content after an update or a save
    function clearForm() {

        $("#formOrgList").empty();
        $("#txtName").val("");
        $("#txtDescription").val("");
        $("#activeFlag").prop('checked', false);
        $("#orgRoleList").empty();
    }

    function closeMasterRoleForm() {
        // execute the callback to cleanup the main page state
        updateMasterForm();
        $("#form").remove();
    }

}