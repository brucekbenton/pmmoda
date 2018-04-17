"use strict"

var RegisterUserForm = function () {
    this.show = showRegisterUserForm;
    this.close = closeRegisterUserForm;
    // declare an object to store the call back method to be called when the form is closed
    var updateMasterForm;
    // Declare a local object to store the current collection of Companies
    var Companies = [];


    /// Declare a function to render the Company Maintenance Form
    function showRegisterUserForm(callback) {


        updateMasterForm = callback;

        // Manage the form container
        $("<DIV id='form' ></DIV>").addClass("popupForm").css({ 'width': '425px', 'height': '350px', 'top': '75px', 'left': '100px' }).appendTo('body');
        $("<DIV id='header' ></DIV>").appendTo('#form');
        $("<p></p>").addClass("pageHeader").text('Register User').appendTo('#header');



        // Add the row containing the name input box a
        $("<DIV id='UsernameRowContainer' ></DIV>").addClass("formRow").appendTo('#form');
        // Add the name label and input text box
        $("<DIV id='UsernameLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#UsernameRowContainer');
        $("<P>Username</p>").appendTo('#UsernameLabelContainer');
        $("<DIV id='UsernameInputContainer' ></DIV>").addClass("inputColumn").css({ 'left': '150px' }).appendTo('#UsernameRowContainer');
        $("<INPUT type='text' id='txtUsername' ></INPUT>").addClass("formTextBox").appendTo("#UsernameInputContainer");


        // Add the row containing the Contact name input box a
        $("<DIV id='PasswordRowContainer' ></DIV>").addClass("formRow").appendTo('#form');
        // Add the name label and input text box
        $("<DIV id='PasswordLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#PasswordRowContainer');
        $("<P>Password</p>").appendTo('#PasswordLabelContainer');
        $("<DIV id='PasswordInputContainer' ></DIV>").addClass("inputColumn").css({ 'left': '150px' }).appendTo('#PasswordRowContainer');
        $("<INPUT type='text' id='txtPassword' ></INPUT>").addClass("formTextBox").appendTo("#PasswordInputContainer");

        // Add the row containing the Contact alias input box a
        $("<DIV id='ConfirmationRowContainer' ></DIV>").addClass("formRow").appendTo('#form');
        // Add the name label and input text box
        $("<DIV id='ConfirmationLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#ConfirmationRowContainer');
        $("<P>Confirmation</p>").appendTo('#ConfirmationLabelContainer');
        $("<DIV id='ConfirmationInputContainer' ></DIV>").addClass("inputColumn").css({ 'left': '150px' }).appendTo('#ConfirmationRowContainer');
        $("<INPUT type='text' id='txtConfirmation' ></INPUT>").addClass("formTextBox").appendTo("#ConfirmationInputContainer");



        // Add the first row containing the company label and the company combo box box
        $("<DIV id='CompanyRowContainer' ></DIV>").addClass("formRow").appendTo('#form');
        // Add the name lable and input text box
        $("<DIV id='CompanyLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#CompanyRowContainer');
        $("<P>Company</p>").appendTo('#CompanyLabelContainer');
        $("<DIV id='companyInput' ></DIV>").addClass("inputColumn").css({ 'left': '150px' }).appendTo('#CompanyRowContainer');
        $("<SELECT id='formCompanyList' ></SELECT>").addClass("basicComboBox").appendTo("#companyInput");

        // Add the active flag container
        $("<DIV id='notificationFlagRow' ></DIV>").addClass("formRow").appendTo('#form');
        $("<DIV id='notificationflagLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#notificationFlagRow');
        $("<input type='checkbox' id='notificationFlag' />").addClass("basicCheckBox").appendTo("#notificationflagLabelContainer")
        $("<label for='notificationFlag'>Notify user</label>").addClass("inputColumn").css({ 'left': '25px', 'width': '250px' }).appendTo("#notificationflagLabelContainer");
        $("#notificationFlag").prop('checked',true);

        // Add the navigation bar to the bottom
        $("<DIV id='navBar' ></DIV>").addClass("navigationBar").appendTo('#form');
        $("<p id='navParagraph'></p>").css({ 'text-align': 'center' }).appendTo('#navBar');
        $("<button id='btnRegister'></button>").addClass("cellButton").css({'width':'70px'}).prop('disabled', false).text("Register").appendTo("#navParagraph");
        $("<button id='btnCancel'></button>").addClass("cellButton").css({ 'width': '70px' }).prop('disabled', false).text("Close").appendTo("#navParagraph");
//        $("<b></b>").addClass("SelectButton").text("Close").on("click", closeRegisterUserFormHandler).appendTo("#navParagraph");

        // Create the event handlers for teh save and update buttongs
        $("#btnRegister").click(registerUserHandler);
        $("#btnCancel").click(closeRegisterUserFormHandler);
        //        $("#btnUpdate").click(updateCompanyHandler);


        // Load the company data if required
//        if (mode == 'SuperUser') {
            var token;

            token = loadCompanyData(refreshCompanyComboData, errorHandler);
//        }
    }

    // Declare a function to register the current user
    function registerUserHandler() {
        //    alert("Inside Register Handler")
        var newUser = new User();

        newUser.Username = $("#txtUsername").val();
        newUser.Email = $("#txtUsername").val();
        newUser.Password = $("#txtPassword").val();
        newUser.ConfirmPassword = $("#txtConfirmation").val();
        newUser.CompanyID = $("#formCompanyList").find("option:selected").val();

        if (newUser.Email != "" && newUser.Password != "" && newUser.ConfirmPassword != "" && newUser.CompanyID > 0) {
            registerUser(newUser);
        }
        else {
            alert("Please verify your input. All fields are required.");
        }

    }


    // Declare a function to register the specified user
    function registerUser(user) {
        var headers = {};
        var targetUrl;

        var token = sessionStorage.getItem(tokenKey);
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // TBD - HArd code the Role ID for now until this is integrated
        user.RoleID = 0;

        targetUrl = '/api/Account/Register';

        $.ajax({
            type: 'POST',
            url: targetUrl,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(user),
            headers: headers
        }).done(function (data) {
            clearRegisterDetails();
            // Insert the new user in the PmmodaUser table
            insertNewUser(user);
        }).fail(function (xhr, textStatus, errorThrown) {
            pmmodaErrorHandler(xhr, 901);
//            showError(xhr);
        });
    }

    // Declare a function to insert the new user into the PMMODA USer table. This tracks
    // application aspects of the user as opposed to authentication information
    function insertNewUser(user) {

        var headers = {};
        var targetUrl;

        var token = sessionStorage.getItem(tokenKey);
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        targetUrl = '/api/PmmodaUser?notify=' + $("#notificationFlag").prop('checked');

        $.ajax({
            type: 'POST',
            url: targetUrl,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(user),
            headers: headers
        }).done(function (data) {
            clearRegisterDetails();
            // Insert the new user in the PmmodaUser table
//            insertNewUser(user);
        }).fail(function (xhr, textStatus, errorThrown) {
            pmmodaErrorHandler(xhr, 901);
            //            showError(xhr);
        });
    }

    // Delare a function the clear the current record values
    function clearRegisterDetails() {
        $("#txtUsername").val("");
        $("#txtPassword").val("");
        $("#txtConfirmation").val("");
        $("#formCompanyList").val(0);

    }

    // Declare a function to close the current form
    function closeRegisterUserFormHandler() {
        closeRegisterUserForm();
    }

    function closeRegisterUserForm() {
        // execute the callback to cleanup the main page state
        updateMasterForm();
        $("#form").remove();

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
//        $("#formCompanyList").change(companySelectHandler);
    }

    // Declare a function to manage errors in the web service call
    function errorHandler(response) {
        if (response.Status == 401) {
            alert("The current user does not have permissions to Register new users.")
            closeRegisterUserForm();
        }
    }

}