"use strict"

var PermissionForm = function (callback) {
    this.show = showPermissionForm;
    this.close = closePermissionForm;
    // declare an object to store the call back method to be called when the form is closed
    var updateMasterForm;
    // Declare a local object to store the current collection of Companies
    var Companies = [];
    var Organizations = [];
    var localOrganization;
    var localCompany;
    // Declare a collection to store the current UserRole data
    var c_userRoleData = [];
    var userIDs = [];


    /// Declare a function to render the Company Maintenance Form
    function showPermissionForm(callback) {

        localCompany = new Company();

        updateMasterForm = callback;

        // Manage the form container
        $("<DIV id='form' ></DIV>").addClass("popupForm").css({ 'width': '950px', 'height': '500px', 'top': '75px', 'left': '100px' }).appendTo('body');
        $("<DIV id='header' ></DIV>").appendTo('#form');
        $("<p></p>").addClass("pageHeader").text('Permission Management').appendTo('#header');


        $("<DIV id='CompanyRowContainer' ></DIV>").addClass("formRow").css({ 'margin-top': '40px', 'background-color': 'transparent' }).appendTo('#form');
        // Add the Company label and input text box
        $("<DIV id='CompanyLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#CompanyRowContainer');
        $("<P>Company</p>").appendTo('#CompanyLabelContainer');
        $("<DIV id='companyInput' ></DIV>").addClass("inputColumn").css({ 'left': '125px' }).appendTo('#CompanyRowContainer');
        $("<SELECT id='permissionCompanyList' ></SELECT>").addClass("basicComboBox").appendTo("#companyInput");
        // Add the first row containing the org label and the org combo box box
        $("<DIV id='FilterRowContainer' ></DIV>").addClass("formRow").css({'background-color':'transparent' }).appendTo('#form');
        // Add the organization label and input text box
        $("<DIV id='OrganizationLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#FilterRowContainer');
        $("<P>Project Team</p>").appendTo('#OrganizationLabelContainer');
        $("<DIV id='organizationInput' ></DIV>").addClass("inputColumn").css({ 'left': '125px' }).appendTo('#FilterRowContainer');
        $("<SELECT id='permissionOrgList' ></SELECT>").addClass("basicComboBox").appendTo("#organizationInput");
        // Add the project label and input text box
        $("<DIV id='ProjectLabelContainer' ></DIV>").addClass("labelColumn").css({'left':'400px'}).appendTo('#FilterRowContainer');
        $("<P>Project</p>").appendTo('#ProjectLabelContainer');
        $("<DIV id='projectInput' ></DIV>").addClass("inputColumn").css({ 'left': '475px' }).appendTo('#FilterRowContainer');
        $("<SELECT id='permissionProjectList' ></SELECT>").addClass("basicComboBox").appendTo("#projectInput");

        // Add the labels for the permissions block
        $("<DIV id='permissionLabelRowContainer' ></DIV>").addClass("formRow").css({ 'margin-top': '15px', 'background-color': 'transparent' }).appendTo('#form');
        $("<DIV id='userLabelContainer' ></DIV>").addClass("labelColumn").css({'left':'135px'}).appendTo('#permissionLabelRowContainer');
        $("<P>User</p>").appendTo('#userLabelContainer');
        $("<DIV id='roleLabelContainer' ></DIV>").addClass("labelColumn").css({ 'left': '530px' }).appendTo('#permissionLabelRowContainer');
        $("<P>Permissions</p>").appendTo('#roleLabelContainer');

        // Add the permissions box
        $("<DIV id='permissionRowContainer' ></DIV>").addClass("formRow").css({ 'margin-top': '0px', 'height': '200px', 'background-color': 'transparent' }).appendTo('#form');
        $("<DIV id='permissionLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#permissionRowContainer');
        $("<P>Permission</p>").appendTo('#permissionLabelContainer');
        $("<DIV id='permissionInput' ></DIV>").addClass("inputColumn").css({ 'border': 'solid 1px', 'left': '125px', 'width': '725px', 'height': '200px','overflow':'scroll' }).appendTo('#permissionRowContainer');

        // Add a table to the container to display the data
        $("<TABLE id='permissionTable' style='width:400px'></TABLE>").addClass("permissionTable").appendTo("#permissionInput");
        $("<THEAD id='permissionsHeader'></THEAD>").appendTo("#permissionTable");
        $("<TH></TH>").text("Username").addClass("usernameColumn").appendTo("#permissionsHeader")
        $("<TH></TH>").text("Company Admin").addClass("roleColumn").appendTo("#permissionsHeader")
        $("<TH></TH>").text("Company Member").addClass("roleColumn").appendTo("#permissionsHeader")
//        $("<TH></TH>").text("Group Admin").addClass("roleColumn").appendTo("#permissionsHeader")
//        $("<TH></TH>").text("Group Member").addClass("roleColumn").appendTo("#permissionsHeader")
        $("<TBODY id='permissionBody'></TBODY").appendTo("#permissionTable");

        // Add the organization table
        $("<TABLE id='orgTable' style='width:203px;border-left:0px'></TABLE>").addClass("permissionTable").appendTo("#permissionInput");
        $("<THEAD id='orgHeader'></THEAD>").appendTo("#orgTable");
        $("<TH></TH>").text("Project Team Admin").addClass("roleColumn").appendTo("#orgHeader")
        $("<TH></TH>").text("Project Team Member").addClass("roleColumn").appendTo("#orgHeader")
        $("<TBODY id='orgBody'></TBODY").appendTo("#orgTable");

        // add the project table
        $("<TABLE id='projectTable' style='width:103px'></TABLE>").addClass("permissionTable").appendTo("#permissionInput");
        $("<THEAD id='projectHeader'></THEAD>").appendTo("#projectTable");
        $("<TH></TH>").text("Project Member").addClass("roleColumn").appendTo("#projectHeader")
        $("<TBODY id='projectBody'></TBODY").appendTo("#projectTable");

        //        $("<TR id='userRow'" + data[index].UserID + "'></TR>").appendTo("#permissionBody");
//        $("<TD class='usernameColumn'></TD>").text(data[index].Username).appendTo("#userRow" + data[index].UserID);

        // add a container for the Add and Remove buttons
        $("<DIV id='actionInput' ></DIV>").addClass("inputColumn").css({ 'left': '800px', 'width': '250px', 'height': '100px' }).appendTo('#permissionRowContainer');
        $("<BUTTON>Add</BUTTON>").addClass("refreshButton").css({ 'position': 'absolute', 'left': '0px', 'top': '0px','margin-top':'0px' }).appendTo("#actionInput")
        $("<BUTTON>Remove</BUTTON>").addClass("refreshButton").css({ 'position': 'absolute', 'left': '0px', 'top': '30px', 'margin-top': '0px' }).appendTo("#actionInput")
        // Add the user select controls
        $("<DIV id='userSelectInput' ></DIV>").addClass("inputColumn").css({ 'left': '90px' }).appendTo('#actionInput');
        $("<SELECT id='userList' ></SELECT>").addClass("basicComboBox").appendTo("#userSelectInput");

        // Add the navigation bar to the bottom
        $("<DIV id='navBar' ></DIV>").addClass("navigationBar").appendTo('#form');
        $("<p id='navParagraph'></p>").css({ 'text-align': 'center' }).appendTo('#navBar');
//        $("<b id='btnSave'></b>").addClass("SelectButton").prop('disabled', true).text("Save").appendTo("#navParagraph");
//        $("<b id='btnUpdate'></b>").addClass("SelectButton").prop('disabled', false).text("Update").appendTo("#navParagraph");
        $("<button></button>").addClass("cellButton").text("Close").on("click", closePermissionFormHandler).appendTo("#navParagraph");


        // TBD - Hide the action input for now until the design is final
        $("#actionInput").hide();

        var companyPromise;
        companyPromise = loadCompanyData(populateCompanyOptions, organizationModeHandler);

    }

    function companySelectHandler() {
        var companyID;

        companyID = $("#permissionCompanyList").find("option:selected").val();

        localCompany = getCurrentCompany(companyID, Companies);

        // Configure the Organization mode
        configureOrganizationMode();
    }

    function organizationModeHandler(response) {
        $("#CompanyRowContainer").hide();
        // Since this use is not a SU get their company and setup for CompanyAdmin mode
        var promise = getCompanyOfCurrentUser(updateLocalCompany, pmmodaErrorHandler)
//        var promise = loadOrganizations(populateOrganizations,pmmodaErrorHandler)
    }

    function updateLocalCompany(data) {
        localCompany = data;
        configureOrganizationMode();
    }

    function configureOrganizationMode() {

        var promise;
        var promise2;
        // Check to make sure there is a company selected
        if (localCompany.CompanyID != undefined) {
            // Check to see if the current company has restricted organizations
            if (!localCompany.OrganizationRestricted) {
                // show the Org and project selectors
                $("#FilterRowContainer").hide();

                promise = loadUserRolesByCompany(localCompany.CompanyID, populateUserRoles, pmmodaErrorHandler);

                promise2 = loadUsersByCompany(localCompany.CompanyID, populateUsers, pmmodaErrorHandler);

                promise2.done(function () {
                    orgStatusEnabled(false);
                    projectStatusEnabled(false);
                });
            }
            else {
                promise = loadUserRolesByCompany(localCompany.CompanyID, populateUserRoles, pmmodaErrorHandler);
                // Load all company users since the org filtering is disabled
                promise2 = loadUsersByCompany(localCompany.CompanyID, populateUsers, pmmodaErrorHandler);
                promise2.done(function () {
                    orgStatusEnabled(false);
                    projectStatusEnabled(false);
                });
                // Load the organization data
                loadOrganizationsByCompany(localCompany.CompanyID, populateOrganizations, pmmodaErrorHandler);
                // Check for project restrictions
                if (!localCompany.ProjectRestricted) {
                    $("#ProjectLabelContainer").hide();
                    $("#projectInput").hide();
                }
            }
            promise.done(function () {
                promise2.done(function () {
                    var index = 0;
                    while (index < c_userRoleData.length) {
                        updatePermissions(c_userRoleData[index]);
                        index++;
                    }
                });

            });
        }
        else {
            // reset the display
            clearUsers();
            // Show the org and project selectino row
            $("#FilterRowContainer").show();
            $("#ProjectLabelContainer").show();
            $("#projectInput").show();
        }

    }

    function getCurrentCompany(ID, compArray) {
        var selectedCompany = new Company();
        var index = 0;

        while (index < compArray.length) {
            if (compArray[index].CompanyID == ID) {
                selectedCompany = compArray[index];
                break;
            }
            index++;
        }
        return (selectedCompany);
    }


    // Declare an event handler to process teh Organization select event
    function orgSelectHandler() {
        var OrgID;
        var promise;

        // refresh the current permissions data
        promise = loadUserRolesByCompany(localCompany.CompanyID, populateUserRoles, pmmodaErrorHandler);

        // Get the currently selected organization value
        OrgID = $("#permissionOrgList").find("option:selected").val();

        // Make sure this is a valid organization
        if (OrgID > 0) {


                localOrganization = getCurrentOrganization(OrgID,Organizations)
                // Enable the org table results
//                orgStatusEnabled(true);

                // Check to see if Project Restriction is enabled
                if (localCompany.ProjectRestricted) {
                    var promise;
                    loadProjectOptions(OrgID, populateProjectOptions, pmmodaErrorHandler);
//                    projectStatusEnabled(true);
                }
                else {
//                    projectStatusEnabled(false);
                }
        }
        else {
            // reset the local Organization value
            localOrganization = undefined;
            // Disable orgs and projects since the user has not selected a valid org at this time
//            orgStatusEnabled(false);
//            projectStatusEnabled(false);
        }

        // Make sure the permission data is loaded before you refresh the graph
        promise.done(function () {

            var index = 0;
            clearPermissions();
            while (index < c_userRoleData.length) {
                updatePermissions(c_userRoleData[index]);
                index++;
            }

            if (OrgID > 0) {
                orgStatusEnabled(true);
                // check to see if projects are enabled
                if (localCompany.ProjectRestricted) {
                    projectStatusEnabled(true);
                }
                else {
                    projectStatusEnabled(false);

                }
            }
            else
            {
                orgStatusEnabled(false);
                projectStatusEnabled(false);
            }

        });

    }


    // Declare a function to set the enbaled status of the project permission results
    function projectStatusEnabled(mode)
    {
        if (mode) {
            // enable the project table
            $.each($("#projectBody tr"), function (index, value) {
                $(value).prop('disabled', false);
            });
        }
        else {
            // disable the project permissions table
            $.each($("#projectBody tr"), function (index, value) {
                $(value).prop('disabled', true);
            });

//            $.each($('.overheadTextBox'), function (index, value) {
//                $(value).val("");
//            });

        }

    }

    // Declare a function to set the enbaled status of the project permission results
    function orgStatusEnabled(mode) {
        if (mode) {
            // enable the project table
            $.each($("#orgBody tr"), function (index, value) {
                $(value).prop('disabled', false);
            });
        }
        else {
            // disable the project permissions table
            $.each($("#orgBody tr"), function (index, value) {
                $(value).prop('disabled', true);
            });

            //            $.each($('.overheadTextBox'), function (index, value) {
            //                $(value).val("");
            //            });

        }

    }


    // Declare a fuction to populate the user grid 
    function populateUsers(data) {
        var index = 0;

        clearUsers();
//        c_userRoleData.length = 0;
        userIDs.length = 0;


        while (index < data.length) {
            if ($.inArray(data[index].UserID, userIDs) == -1) {
                userIDs.push(data[index].UserID);
                $("<TR id='userRow" + data[index].UserID + "'></TR>").appendTo("#permissionBody");
                $("<TD class='usernameColumn' style='padding-left:5px'></TD>").text(data[index].Username).appendTo("#userRow" + data[index].UserID);
                $("<TD ><INPUT type='checkbox' id='companyAdmin" + data[index].UserID + "'></INPT></TD>").css({ 'padding-left': '35px' }).appendTo("#userRow" + data[index].UserID);
                $("<TD><INPUT  type='checkbox' id='companyMember" + data[index].UserID + "'></INPT></TD>").css({ 'padding-left': '35px' }).appendTo("#userRow" + data[index].UserID);
                $("#companyAdmin" + data[index].UserID).change({ param1 : "companyAdmin",param2: data[index].UserID,param3:data[index].Username},permissionChangeEventHandler)
                $("#companyMember" + data[index].UserID).change({ param1 : "companyMember",param2: data[index].UserID,param3:data[index].Username},permissionChangeEventHandler)

                $("<TR id='userOrgRow" + data[index].UserID + "'></TR>").appendTo("#orgBody");
                $("<TD><INPUT type='checkbox' id='orgAdmin" + data[index].UserID + "'></INPUT></TD>").css({ 'padding-left': '35px' }).appendTo("#userOrgRow" + data[index].UserID);
                $("<TD><INPUT type='checkbox' id='orgMember" + data[index].UserID + "'></INPUT></TD>").css({ 'padding-left': '35px' }).appendTo("#userOrgRow" + data[index].UserID);
                // Add event handlers to the org options
                $("#orgAdmin" + data[index].UserID).change({ param1 : "orgAdmin",param2: data[index].UserID,param3:data[index].Username},permissionChangeEventHandler)

                $("<TR id='userProjectRow" + data[index].UserID + "'></TR>").appendTo("#projectBody");
                $("<TD><INPUT type='checkbox'  id='projectMember" + data[index].UserID + "'></INPUT></TD>").css({ 'padding-left': '35px' }).appendTo("#userProjectRow" + data[index].UserID);
                $("#orgMember" + data[index].UserID).change({ param1: "orgMember", param2: data[index].UserID, param3: data[index].Username }, permissionChangeEventHandler)
            }
//            updatePermissions(data[index]);
            index++;
        }
    }

    // Declare a fuction to populate the user role data structure 
    function populateUserRoles(data) {
        var index = 0;

//        clearUsers();
        c_userRoleData.length = 0;
//        userIDs.length = 0;


        while (index < data.length) {
            var newUserRole = new UserRole();
            newUserRole.UserID = data[index].UserID;
            newUserRole.Username = data[index].Username;
            newUserRole.RoleID = data[index].RoleID;
            newUserRole.Role = data[index].Role;
            c_userRoleData.push(newUserRole);
            index++;
        }
    }


    function permissionChangeEventHandler(event) {
        var username = event.data.param3;
        switch (event.data.param1) {
            case "companyAdmin":
                // Add new role 
                var role = localCompany.Name + "_Admin";
                if ($("#companyAdmin" + event.data.param2).prop('checked')) {
                    // add the new user role
                    AddNewRole(username, role);
                }
                else {
                    // delete the new user role
                    DeleteRole(username, role);
                }
                break;
            case "companyMember":
                var role = localCompany.Name + "_Member";
                if ($("#companyMember" + event.data.param2).prop('checked')) {
                    // add the new user role
                    AddNewRole(username, role);
                }
                else {
                    // delete the new user role
                    DeleteRole(username, role);
                }
                break;

            case "orgAdmin":
                // Add new role 
                var role = localCompany.Name + "_" + localOrganization.Name + "_Admin";
                if ($("#orgAdmin" + event.data.param2).prop('checked')) {
                    // add the new user role
                    AddNewRole(username, role);
                }
                else {
                    // delete the new user role
                    DeleteRole(username, role);
                }
                break;
            case "orgMember":
                var role = localCompany.Name + "_" + localOrganization.Name + "_Member";
                if ($("#orgMember" + event.data.param2).prop('checked')) {
                    // add the new user role
                    AddNewRole(username, role);
                }
                else {
                    // delete the new user role
                    DeleteRole(username, role);
                }
                break;
        }
    }

    // Declarea function to delete the specified Role association
    function DeleteRole(username, role) {
        // Declare a Deferred construct to return from this method
        var promise;
        var targetUrl;

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        targetUrl = UserUrl + "?username=" + username + "&role=" + role;

        promise = $.ajax({
            url: targetUrl,
            type: 'DELETE',
            dataType: 'xml',
            headers: headers,
            success: function (data, txtStatus, xhr) {
                //                callback(data);
            },
            error: function (xhr, textStatus, errorThrown) {
                pmmodaErrorHandler(xhr, 901);
            }
        });

        return (promise);

    }


    // Declarea function to create teh new Role association
    function AddNewRole(username,role) {
        // Declare a Deferred construct to return from this method
        var promise;
        var targetUrl;

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        targetUrl = UserUrl + "?username=" + username + "&role=" + role;

        promise = $.ajax({
            url: targetUrl,
            type: 'POST',
            dataType: 'xml',
            headers: headers,
            success: function (data, txtStatus, xhr) {
//                alert("Added role");
//                callback(data);
            },
            error: function (xhr, textStatus, errorThrown) {
                pmmodaErrorHandler(xhr, 901);
            }
        });

        return (promise);

    }

    // Declare a function to set access permissions based on the current record
    function updatePermissions(data) {
        // Check for admin status
        if (data.Role == localCompany.Name + "_Admin") {
            // Set the company admin flag true
            $("#companyAdmin" + data.UserID).prop('checked', true);
        }
        else if (data.Role == localCompany.Name + "_Member") {
            // Set the company member flag
            $("#companyMember" + data.UserID).prop('checked', true);
        }
        else if (localOrganization != undefined && localCompany.OrganizationRestricted) {
            // Check for group admin
            if (data.Role == localCompany.Name + "_" + localOrganization.Name + "_" + "Admin") {
                $("#orgAdmin" + data.UserID).prop('checked', true);
            }
            else if (data.Role == localCompany.Name + "_" + localOrganization.Name + "_" + "Member") {
                $("#orgMember" + data.UserID).prop('checked', true);
            }
        }
    }

    function clearPermissions() {
        var index = 0;

        while (index < userIDs.length) {
            $("#companyAdmin" + userIDs[index]).prop('checked', false);
            $("#companyMember" + userIDs[index]).prop('checked', false);
            $("#orgAdmin" + userIDs[index]).prop('checked', false);
            $("#orgMember" + userIDs[index]).prop('checked', false);
            $("#projectMember" + userIDs[index]).prop('checked', false);
            index++;
        }
    }

    // Declare a function to populate the project data
    function populateProjectOptions(data) {

        var index = 0;
        // Empty ny current options
        $("#permissionProjectList").empty();
        // Add a blank option to the combo box
        $('<option></option>').appendTo($('#permissionProjectList'));
        while (index < data.length) {
            // Add a list item for the organization.
            $("<option value='" + data[index].Id + "'></option>").text(data[index].Name).appendTo($('#permissionProjectList'));
            index++;
        }
        // Register an event handler on the option list
        $("#permissionProjectList").change(projectSelectHandler);
    }

    // Declare a function to populate the Company data
    function populateCompanyOptions(data) {

        var index = 0;
        // Empty ny current options
        $("#permissionCompanyList").empty();
        // Add a blank option to the combo box
        $('<option></option>').appendTo($('#permissionCompanyList'));
        while (index < data.length) {
            var company = new Company();
            company.CompanyID = data[index].CompanyID;
            company.Name = data[index].Name;
            company.ContactName = data[index].ContactName;
            company.ContactAlias = data[index].ContactAlias;
            company.OrganizationRestricted = data[index].OrganizationRestricted;
            company.ProjectRestricted = data[index].ProjectRestricted;
            Companies.push(company);
            // Add a list item for the organization.
            $("<option value='" + data[index].CompanyID + "'></option>").text(data[index].Name).appendTo($('#permissionCompanyList'));
            index++;
        }
        // Register an event handler on the option list
        $("#permissionCompanyList").change(companySelectHandler);
    }


    // Declare a function to process the project select event
    function projectSelectHandler() {

    }

    // Declare a function to populate the org selection control
    function populateOrganizations(data) {
        var index = 0;
        Organizations.length = 0;

        $('#permissionOrgList').empty();
        // Add a blank option to the combo box
        $('<option></option>').appendTo($('#permissionOrgList'));
        while (index < data.length) {
            var org = new Organization();
            org.ID = data[index].Id;
            org.Name = data[index].Name;
            org.Description = data[index].Description;
            org.isActive = data[index].isActive;
            org.WorkDay = data[index].WorkDay;
            Organizations.push(org);
            // Add a list item for the organization.
            $("<option value='" + data[index].Id + "'></option>").text(data[index].Name).appendTo($('#permissionOrgList'));
            index++;
        }
        // Register an event handler on the option list
        $("#permissionOrgList").change(orgSelectHandler);

    }

    function clearUsers() {
        // Clear the company rows
        $('#permissionBody tr').each(function () {
                $(this).remove();
        });

        //clear the org data
        $('#orgBody tr').each(function () {
            $(this).remove();
        });

        // clear the project
        $('#projectBody tr').each(function () {
            $(this).remove();
        });

    }

    function closePermissionFormHandler() {
        closePermissionForm();
    }

    function closePermissionForm() {

        // execute the callback to cleanup the main page state
        updateMasterForm();
        $("#form").remove();
    }


}