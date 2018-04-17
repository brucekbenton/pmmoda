var pages = ["Productivity Model", "Scope Model", "Effort Model", "Project Management", "Administration","timeline"];
var currentPage;
// var ProjectUrl = "/api/project";
// Declare a variable to track whether the current user is a SuperUSer
var superUserMode = false;

// Declare an object to store the currently selected org
var orgID = 0;
// Declare a class variable to store the current company
var currentCompany;
// Declare an object to store the current organization entity information
var currentOrg;
// Declare an object to store the currently selected project ID
var currentProjectID;
// Declare an object to store the current UserID
var c_UserID = 1; // TBD - currently hard coded to 1. Needs to be updated when authentication is added
// Declare a collection of Roles to represent the roles assigned to the current organization
var roleCollection = [];
// Declare a collection of Role IDs to represent the roles assigned to the current organization
var roleIDCollection = [];
// Declare a collection of Role Names to represent the roles assigned to the current organization
var roleNameCollection = [];
// Declare a collection of ORganizations to represent the set of current orgs
var orgCollection = [];
// Declare an error message to indicate that the current use is not an admin
var notAdminMessage = "The current user does not have Admin permissions. Please see your Administrator."

var activityForm;
var activityMap;
var projectTeamForm;
var projectTeamWizardForm;

// Declare the event handler that gets fired when the main page is loaded
function InitializeHomePage() {

    // enable the default page state
    enableMainMenuOptions(false, false);
    // Hide the temp utility
//    $("#tempRoleFeature").hide();
    $("#currentUserAliasContainer").hide();
}

function loadHomePage() {
    // Load the master data
    loadHomeData();
    // configure the menu based on user role
    validateAccess(configureMenu, suErrorHandler,'SuperUser');
    // configure the menu based on company admin role
//    validateAccess(configureAdminMenu, adminErrorHandler, currentCompany.Name+"_Admin");
    // enable the default page state
    enableMainMenuOptions(true, true);

}

function configureMenu(response) {
    if(response.status == 200)
    {
        superUserMode = true;

        $("#systemOptions").show();
    }
}

function configureAdminMenu(response) {
    if (response.status == 200) {
        $("#companyOptions").show();
    }
}


function clearHomePage(){
    $("#orgList").empty();
    $("#projectList").empty();
}

function suErrorHandler() {

    superUserMode = false;

    // Hide the SuperUser options. This is only for usability purposes. All data and updates are 
    // controlled via authentication on the server
    $("#systemOptions").hide();
}

function adminErrorHandler() {
    // Hide the company admin options. This is only for usability purposes. All data and updates are 
    // controlled via authentication on the server
    // Hide the permissions form by default
    $("#companyOptions").hide();
}


function loadHomeData() {
    var deferredToken;

    // Initialize the current Org data isntance
    currentOrg = new Organization();

    var targetUrl;
    var element;


    targetUrl = organizationUrl;

    // clear any current data from the Org selection combo box
    element = $("#orgList");
    element.empty();

    // Add a blank option to the combo box
    $('<option></option>').appendTo($('#orgList'));
    // Send an AJAX request to get the list of organizations
    deferredToken = loadOrganizations(populateOrgList);

    orgID = getCookieOrgID();
    // Update the current selection once the org list has been updated
    $.when(deferredToken).then(function () {
        if (orgID != 0) {
            currentOrg = getCurrentOrganization(orgID, orgCollection);
            // Load the project list for the current organization
            loadProjectOptions(orgID, refreshProjectOptions,projectLoadErrorHandler);
            $('#orgList').val(orgID);
            enableMainMenuOptions(true, true);
        }
    });
}

function projectLoadErrorHandler(response) {
    if (response.status == 401) {
        alert("The current user does not have permissions to load the projects for this organization. Please see your administrator")
    }
}

function populateOrgList(data) {
    var index = 0;
    orgCollection.length = 0;
        while(index < data.length){
            // Declare a new org instance
            var org = new Organization();
            org.ID = data[index].Id;
            org.Name = data[index].Name;
            org.Description = data[index].Description;
            org.isActive = data[index].isActive;
            // Filter for the active orgainzations
            if (org.isActive) {
                // add the current record to the org collection
                orgCollection.push(org);

                // Add a list item for the organization.
                $("<option value='" + org.ID + "'></option>").text(org.Name).appendTo($('#orgList'));
            }
            index++;
        }
    }


// Declare a function to control the status of the main menu options (not including contorls)
function enableMainMenuOptions(adminMode, controlMode) {
    var projectID;
    var orgID;

    // check to see if there is a currently selecte organization
    orgID = $("#orgList").find('option:selected').val();
    if (orgID == undefined || orgID == "" || orgID==0) {
        orgMode = false;
    }
    else {
        orgMode = true;
    }
    // configure the organization options
    if (orgMode) {
        $('#orgMenu').css({ 'pointer-events': 'all' });
        $('#orgMenu :input').prop('disabled', false);
    }
    else {
        $('#orgMenu :input').prop('disabled', true);
        $('#orgMenu').css({ 'pointer-events': 'none' });
    }

    // Check to see if there is an active project selected
    // Check to see if there is an active Project. If this is null then the admin menus should still be disabled
    projectID = $("#projectList").find('option:selected').val();
    if (projectID == undefined || projectID == "" || projectID == 0) {
        projectMode = false;
    }
    else {
        projectMode = true;
    }


    // Configure the project menu options
    if (projectMode) {
        $('#projectMenu').css({ 'pointer-events': 'all' });
        $('#projectMenu :input').prop('disabled', false);
    }
    else {
        $('#projectMenu :input').prop('disabled', true);
        $('#projectMenu').css({ 'pointer-events': 'none' });
    }

    // Configure the admin menu options
    if (adminMode) {
        $('#adminMenu').css({ 'pointer-events': 'all' });
        $('#adminMenu :input').prop('disabled', false);
    }
    else {
        $('#adminMenu :input').prop('disabled', true);
        $('#adminMenu').css({ 'pointer-events': 'none' });
    }

    // Confgure the control options
    if (controlMode) {
        $("#orgList").prop('disabled', false);
        $("#projectList").prop('disabled', false);
    }
    else {
        $("#orgList").prop('disabled', true);
        $("#projectList").prop('disabled', true);
    }
}

// Declare a function to force the state of the control menus
function forceMainMenuOptions(orgMode, projectMode, adminMode, controlMode) {
    var projectID;
    // configure the organization options
    if (orgMode) {
        $('#orgMenu').css({ 'pointer-events': 'all' });
        $('#orgMenu :input').prop('disabled', false);
    }
    else {
        $('#orgMenu :input').prop('disabled', true);
        $('#orgMenu').css({ 'pointer-events': 'none' });
    }


    // Configure the project menu options
    if (projectMode) {
        $('#projectMenu').css({ 'pointer-events': 'all' });
        $('#projectMenu :input').prop('disabled', false);
    }
    else {
        $('#projectMenu :input').prop('disabled', true);
        $('#projectMenu').css({ 'pointer-events': 'none' });
    }

    // Configure the admin menu options
    if (adminMode) {
        $('#adminMenu').css({ 'pointer-events': 'all' });
        $('#adminMenu :input').prop('disabled', false);
    }
    else {
        $('#adminMenu :input').prop('disabled', true);
        $('#adminMenu').css({ 'pointer-events': 'none' });
    }

    // Confgure the control options
    if (controlMode) {
        $("#orgList").prop('disabled', false);
        $("#projectList").prop('disabled', false);
    }
    else {
        $("#orgList").prop('disabled', true);
        $("#projectList").prop('disabled', true);
    }
}


// Declare am event handler for the Login/Logout action
function loginControlHandler() {
    var state;

    state = $("#loginControl").text();

    if (state == "Log In") {
        loadLoginForm();
    }
    else
    {
        logout();
        // reset the frame content on logout
        $("#frameContainer").attr('src', "");

        var parameter = "currentUser = " + "";
        // Create a cookie for the current org
        document.cookie = parameter;


    }
}

// Declare a function to load the login popup form
function loadLoginForm() {
    var currentUser;
    var form = new loginForm();
    form.Show(updateUserStatus);

}
// Declare am event handler for the Login/Logout action
function changePasswordControlHandler() {

        loadChangePasswordForm();
}

// Declare a handler to process the SystemPasswordReset form request
function systemPasswordResetControlHandler() {
    loadSystemPasswordResetForm();
}

// Declare a handler to process the ProjectTeamWizard form request
function projectTeamWizardControlHandler() {
    loadProjectTeamWizardForm();
}

function loadProjectTeamWizardForm() {

    var currentUser;
    var role;

    // Disable the main menu
    forceMainMenuOptions(false, false, false, false);

    // Create the Organization form and display it
    projectTeamWizardForm = new WizardFormContainer();
    projectTeamWizardForm.show(resetMainPage);

//    $("#frameContainer").attr('src', "Wizard.html");
//    currentPage = pages[3];
}

function closeProjectTeamWizardHandler() {
    projectTeamWizardForm.close();
    refreshMenuContents();

}

// Declare a functiont to load the SystemResetPassword
function loadChangePasswordForm() {
    var form = new changePasswordForm();
    form.Show();

}

// Declare a function to load the change password popup form
function loadSystemPasswordResetForm() {
//    var currentUser;
    var form = new systemPasswordResetForm();
    form.Show();

}




// Declare a callback form to update the app based on teh login status
function updateUserStatus(username) {
    if (username != "" && username != "") {
        $("#currentUserAliasContainer").show();

        $("#txtCurrentUserAlias").text(username);
        $("#loginControl").text("Log Out");
        var parameter = "currentUser = " + username;
        // Create a cookie for the current org
        document.cookie = parameter;

    }
    else
    {
        $("#currentUserAliasContainer").hide();
        $("#txtCurrentUserAlias").text("");
        $("#loginControl").text("Log In");

    }

}

// Declare a function to load the organization popup form in "New" org mode
function loadNewOrganizationForm() {
    loadOrganizationForm("new");
}

// Delare a function to manage the work dimensions for the current organization
function loadDimensionForm(mode) {
    var currentUser;

    // Disable the main menu bar
    forceMainMenuOptions(false, false, false, false);
    //            enableMenuBar(false);

    // Create the Natural unit form and display it
    var form = new DimensionForm();
    form.show("", orgID, resetMainPage);


}


// Delare a function to load the Natural Unit popup
function loadNaturalUnitForm(mode) {
    var currentUser;

    // Disable the main menu bar
    forceMainMenuOptions(false, false, false, false);

    // Create the Natural unit form and display it
    var form = new NaturalUnitForm();
    form.show("", orgID, resetMainPage);

//    role = currentCompany.Name + "_Admin";
    // Check for access to this form
//    validateAccess(manageNaturalUnitsForm, naturalUnitsFormErrorHandler, role)


}


// Declare a callback method to reset the main page state when the admin form is closed
function resetMainPage() {
    // Declare a local variable to store the active project ID
    var projectID;
    var orgID;

    // reload the master data to account for any admin changes
    loadHomeData();
    //            adminScreenActive = false;
    // get the current org selected
    orgID = $("#orgList").find('option:selected').val();
    // Check to see if there is an active Project. If this is null then the admin menus should still be disabled
    projectID = $("#projectList").find('option:selected').val();
    // Check to see if there is a valid org selected
    enableMainMenuOptions(true, true);
//    if (orgID > 0) {
        // Check to see if there is a valid project selected
//        if (projectID == "" || projectID == undefined) {
//        }
//        else {
//            enableMainMenuOptions(false, false, true, true);
//        }
//    }
//    else {
//        enableMainMenuOptions(false,false, true, true);
//    }
}

// Declare a function to load the project popup form
function loadProjectForm(mode) {
    var currentUser;

    // Disable the main menu
    forceMainMenuOptions(false, false, false, false);

    // Create the Organization form and display it
    var form = new ProjectForm();
    form.show("", orgID, resetMainPage);

//    role = currentCompany.Name + "_Admin";
    // Check for access to this form
//    validateAccess(manageProjectForm, projectFormErrorHandler, role)

}

// Declare a function to load the Activity management form
function loadActivityForm(mode) {

    // Disable the main menu
    forceMainMenuOptions(false, false, false, false);

    // Create the Organization form and display it
    activityForm = new ActivityForm();
    activityForm.show();
}

// Declare a function to load the Activity Map form
function loadActivityMap() {

    // Disable the main menu
    forceMainMenuOptions(false, false, false, false);

    // Create the Organization form and display it
    activityMap = new ActivityMap();
    activityMap.show();
}

function closeActivityMapHandler() {
    activityMap.close();
    refreshMenuContents();
}

function closeProjectTeamFormHandler() {
    projectTeamForm.close();
    refreshMenuContents();
}



function closeFormHandler() {
    activityForm.close();
    refreshMenuContents();
}



// Declare a function to load the organization popup form
function loadOrganizationForm(mode) {
    var currentUser;
    var role;

    // Disable the main menu
    forceMainMenuOptions(false, false, false, false);

    // Create the Organization form and display it
    var form = new OrganizationForm();
    form.show("", resetMainPage);
}

// Declare a function to load the organization popup form
function loadProjectTeamForm(mode) {
    var currentUser;
    var role;

    // Disable the main menu
    forceMainMenuOptions(false, false, false, false);

    // Create the Organization form and display it
    projectTeamForm = new ProjectTeamForm();
    projectTeamForm.show(resetMainPage);
}



// Declare an event handler to manage the company form
function loadCompanyFormHandler(mode) {
    var currentUser;
    // Disable the main menu
    forceMainMenuOptions(false, false, false, false);

    // Create the Organization form and display it
    var form = new CompanyForm();
    form.show(superUserMode, resetMainPage);

}

// Declare an event handler to manage the company form
function loadRegisterUserFormHandler(mode) {
    // Disable the main menu
    forceMainMenuOptions(false, false, false, false);

    // Create the Organization form and display it
    var form = new RegisterUserForm();
    form.show(resetMainPage);

}

function loadPermissionFormHandler() {

    // Disable the main menu
    forceMainMenuOptions(false, false, false, false);

    // Create the Organization form and display it
    var form = new PermissionForm();
    form.show(resetMainPage);
}

// Declre a
function loadMasterRoleFormHandler() {

    // Disable the main menu
    forceMainMenuOptions(false, false, false, false);
    

    var form = new MasterRoleForm(superUserMode);
    form.show(superUserMode, resetMainPage);

}


function loadWorkstreamForm(mode) {
    alert("This Form Not Yet Implemented");
}


function organizationSelectHandler() {
    // Declare a local variable to store the seb service URL
    var targetUrl;

    orgID = $("#orgList").find('option:selected').val();

    // update the currentOrg value
//    currentOrg.ID = orgID;


    // Reset the frame contents
    $("#frameContainer").attr('src', "");


    if (orgID > 0) {
        // Get the org details for the current org
        var org;

        currentOrg = getReferenceOrganization(orgID);
//        org = getReferenceOrganization(currentOrg.ID);
        // copy the vaue over
//        currentOrg.Name = org.Name;
//        currentOrg.Description = org.Description;
//        currentOrg.isActive = org.isActive;

        var parameter = "currentOrg = " + orgID.toString();
        // Create a cookie for the current org
        document.cookie = parameter;
        // reset the project parameter
        parameter = "currentProject = '0'";
        document.cookie = parameter;

        // Check to see if the current user has permissions to load the projects
        if (currentCompany.OrganizationRestricted) {
            role = currentCompany.Name + "_" + currentOrg.Name + "_Member";
        }
        else {
            role = currentCompany.Name + "_Member";

        }
        // Check for access to this form
        validateAccess(refreshMenuContents, pmmodaErrorHandler, role)
    }
    else {
        enableMainMenuOptions(false, false, true, true);
        // reset the project selection option
        $("#projectList").val(0);
    }
}

function orgErrorHandler(response) {
    if (response.status == 401) {
        alert("The current user does not have permissions to load the projects for this organization. Please see your administrator")
    }
    else {
        alert("unspecified error occurred on Web Service Call");
    }
}

function refreshMenuContents(){
    // Load the project list for the current organization
    loadProjectOptions(currentOrg.ID, refreshProjectOptions, projectLoadErrorHandler);
    enableMainMenuOptions( true, true);

}

/// Declare a function to return teh corresponding org entity from teh reference collection
function getReferenceOrganization(ID) {
    var index = 0;
    var selectedOrg = new Organization();

    while (index < orgCollection.length) {
        if (ID == orgCollection[index].ID) {
            selectedOrg = orgCollection[index];
            break;
        }
        index++;
    }
    return (selectedOrg);
}

function updateOrganization(data) {
}

// Declare a function to load the project list for the current org
function refreshProjectOptions(data) {

    // Declare a local variable to store the projectID
    var projectID;
    // Empy any current options from the Project Select control
    emptyProjectList();

    // Add a blank option to the combo box
    $("<option value='0'></option>").appendTo($('#projectList'));

        // On success, 'data' contains a list of organizations.
        $.each(data, function (key, value) {
            var project = new Project();
            project.ID = value["ID"];
            project.Name = value["Name"];
            // Add a list item for the organization.
            $("<option id='option" + value["ID"] + "' value='" + value["ID"] + "'></option>").text(value["Name"]).appendTo($('#projectList'));

        });

        // Get the current projectID value
        projectID = getCookieProjectID();
    // Check to see if the current projectID is in the data set
        var index = 0;
        while (index < data.length) {
            if (data[index].ID == projectID) {
                // Set the combo box to the current value
                $("#projectList").val(projectID);
            }
            index++;
        }
        enableMainMenuOptions(true, true);
}

function emptyProjectList() {
    $('#projectList option').each(function () {
        $(this).remove();
    });
}

// Update the currently active project
function updateProject() {

    currentProjectID = $("#projectList").val();
    var parameter = "currentProject = " + currentProjectID.toString();
    // Create a cookie for the current org
    document.cookie = parameter;

    switch (currentPage) {
        case pages[0]:
            break;
        case pages[1]:
        case pages[3]:
            document.getElementById('frameContainer').contentWindow.location.reload(true); //  .location.reload(true);
            break;
        default:
            break;
    }
    enableMainMenuOptions(true, true, true, true);
}

/// Declare a method to load the new project form
function loadNewProjectForm() {
    var form = new ProjectDetailForm(orgID, c_UserID);

    form.show();
    //            alert("New Project Form - Feature Not Yet Implemented");
}


/// Declare an event handler to load the Project Management functionality
function loadProjects() {
    $("#frameContainer").attr('src', "Calendar.html");
    currentPage = pages[3];
}

// Declare a function to load the MB2E overview content in the frame
function loadOverviewDoc() {
    $("#frameContainer").css({ 'background-color': 'white' }).attr('src', "Mb2e Overview.html");

}
/// Declare an event handler to load the Productivity Modeling functionality
function loadProductivityModel() {

    if (currentCompany.OrganizationRestricted) {
        role = currentCompany.Name + "_" + currentOrg.Name + "_Member";
    }
    else
    {
        role = currentCompany.Name + "_Member";
    }
    // Check for access to this form
    validateAccess(showProductivityModel, pmmodaErrorHandler, role)

}

function showProductivityModel(response) {
    if(response.status == 200){
        $("#frameContainer").attr('src', "ProductivityModel.html");
        currentPage = pages[0];
    }
    else {
        productivityModelErrorHandler(rsponse);
    }
}

function productivityModelErrorHandler(response) {
    if (response.status == 401) {
        alert("The current user does not have permissions to load the Productivity Model for this organization. Please see your administrator")
    }
    else {
        alert("unspecified error occurred on Web Service Call");
    }
    $("#frameContainer").attr('src', "");
}

/// Declare an event handler to load the timeline page
function loadTimeline() {
    if (currentCompany.OrganizationRestricted) {
        role = currentCompany.Name + "_" + currentOrg.Name + "_Member";
    }
    else {
        role = currentCompany.Name + "_Member";
    }
    // Check for access to this form
    validateAccess(showTimeline, timelineErrorHandler, role)

}

function showTimeline(response) {
    if (response.status == 200) {
//        $("#frameContainer").attr('src', "Timeline.html");
        $("#frameContainer").attr('src', "../templates/CustomModel.html");
        currentPage = pages[5];
    }
    else {
        productivityModelErrorHandler(rsponse);
    }
}

function timelineErrorHandler(response) {
    if (response.status == 401) {
        alert("The current user does not have permissions to load the timeline view for this organization. Please see your administrator")
    }
    else {
        alert("unspecified error occurred on Web Service Call");
    }
    $("#frameContainer").attr('src', "");
}

/// Declare an event handler to load the Scope Modeling functionality
function loadScopeModel() {
    var wid = $("#frameContainer").width();
    if (currentCompany.OrganizationRestricted) {
        role = currentCompany.Name + "_" + currentOrg.Name + "_Member";
    }
    else {
        role = currentCompany.Name + "_Member";
    }
    // Check for access to this form
    validateAccess(showEffortModel, productivityModelErrorHandler, role)

}

function showEffortModel(response) {
    if (response.status == 200) {
        $("#frameContainer").attr('src', "ScopeModeling.html");
        currentPage = pages[1];
    }
    else {
        effortModelErrorHandler(rsponse);
    }
}

function effortModelErrorHandler(response) {
    if (response.status == 401) {
        alert("The current user does not have permissions to load the Scope Model for this organization. Please see your administrator")
    }
    else {
        alert("unspecified error occurred on Web Service Call");
    }
    $("#frameContainer").attr('src', "");
}


/// Declare an event handler to load the Effort Modeling functionality
function loadWorkstreamModel() {
    $("#frameContainer").attr('src', "WorkstreamModeling.html");
    currentPage = pages[2];

}

/// Declare a temporary function to support custo creating roles
function addRole()
{
    var role = $("#txtRole").val();
    CreateNewUserRole(role, pmmodaErrorHandler);
}

/// Declare a temporary function to support custom creating users
function addUser() {

    var newUser = new User();

    newUser.Username = $("#txtUser").val();
    newUser.Email = $("#txtUser").val();
    newUser.Password = $("#txtSUPassword").val();
    newUser.ConfirmPassword = $("#txtSUPassword").val();
    newUser.CompanyID = 1;

    if (newUser.Email != "" && newUser.Password != "" && newUser.ConfirmPassword != "" && newUser.CompanyID > 0) {
        CreateNewUser(newUser);
    }
    else {
        alert("Please verify your input. All fields are required.");
    }

}

// Declare a function to register the specified user
function CreateNewUser(user) {
    var headers = {};

//    var token = sessionStorage.getItem(tokenKey);
//    if (token) {
//        headers.Authorization = 'Bearer ' + token;
//    }

    // TBD - HArd code the Role ID for now until this is integrated
    user.RoleID = 0;

    $.ajax({
        type: 'POST',
        url: '/api/Account/Register',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(user),
    }).done(function (data) {
//        clearRegisterDetails();
        // Insert the new user in the PmmodaUser table
//        insertNewUser(user);
    }).fail(function (xhr, textStatus, errorThrown) {
        pmmodaErrorHandler(xhr, 901);
        //            showError(xhr);
    });
}
