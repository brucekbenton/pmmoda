
"use strict"


var updateFormMethod;
// Declare a clas variable to store the timer control
var timerControl;

var loginForm = function(){
    this.currentUser;
    this.Show = showLoginForm;
}

function User() {
    this.Email;
    this.Password;
    this.ConfirmPassword;
}


function showLoginForm(callback) {

    updateFormMethod = callback;

    var width = $(document).width();
    var left = width / 2 - 85;
    var height = $(document).height();
    var top = parseInt((height / 2) - 165);

    $("<DIV id='form' ></DIV>").addClass("popupForm").css({ 'width': '425px', 'height': '215px', 'top': '75px', 'left': '100px' }).appendTo('body');
    $("<DIV id='header' ></DIV>").addClass("headerCol").appendTo('#form');
    $("<p></p>").addClass("smallHeader").text('Login').appendTo('#header');
    // Add the name fields
    $("<DIV id='usernameRowContainer' ></DIV>").addClass("formRow").appendTo('#form');
    $("<DIV id='usernameLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#usernameRowContainer');
    $("<p></p>").text('User Name:').appendTo('#usernameLabelContainer');
    $("<DIV id='usernameInputContainer' ></DIV>").addClass("inputColumn").css({ 'left': '150px' }).appendTo('#usernameRowContainer');
    // check to see if the sprint value is defined
    $("<input id='txtUsername' type='text'></input>").addClass("formTextBox").on('keydown', processCRHandler).appendTo('#usernameInputContainer');

    // Add the password content
    $("<DIV id='passwordRowContainer' ></DIV>").addClass("formSpan").appendTo('#form');
    $("<DIV id='passwordLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#passwordRowContainer');
    $("<p></p>").text('Password:').appendTo('#passwordLabelContainer');
    $("<DIV id='passwordInputContainer' ></DIV>").addClass("inputColumn").css({ 'left': '150px' }).appendTo('#passwordRowContainer');
    // check to see if the sprint value is defined
    $("<input id='txtPassword' type='password'></input>").addClass("formTextBox").on('keydown',processCRHandler).appendTo('#passwordInputContainer');



    // Add the navigation bar to the bottom
    $("<DIV id='navBar' ></DIV>").addClass("formRow").appendTo('#form');
    $("<p id='navParagraph'></p>").css({ 'text-align': 'center' }).appendTo('#navBar');
    $("<button id='btnLogin'></button>").addClass("cellButton").text("Log In").css({ 'width': '70px' }).on("click", loginHandler).appendTo("#navParagraph");
    $("<button></button>").addClass("cellButton").text("Cancel").css({ 'width': '70px' }).on("click", closeLogin).appendTo("#navParagraph");

    // Add a timer bar to track update status
    $("<DIV id='timerBarRow' ></DIV>").addClass("formRow").css({ 'margin-top': '0px' }).appendTo('#form');
    $("<DIV id='statusLabelContainer' ></DIV>").addClass("labelColumn").css({ 'font-weight': 'normal', 'margin-left': '100px' }).appendTo('#timerBarRow');
    $("<DIV>Status</DIV>").appendTo("#statusLabelContainer");
    $("<DIV id='statusDisplayInput' ></DIV>").addClass("inputColumn").css({ 'left': '155px', 'margin-top': '5px' }).appendTo('#timerBarRow');
    $("<DIV id='timerBar' ></DIV>").addClass("timerBar").appendTo("#statusDisplayInput");


    // Set the default focus to the username field
    $("#txtUsername").focus();
    // Hide the timer bar initially
    $("#timerBarRow").hide();
}

function registerHandler() {
    //    alert("Inside Register Handler")

    var newUser = new User();

    newUser.Email = $("#txtUsername").val();
    newUser.Password = $("#txtPassword").val();
    newUser.ConfirmPassword = $("#txtConfirmation").val();



    $.ajax({
        type: 'POST',
        url: '/api/Account/Register',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(newUser)
    }).done(function (data) {
        //                self.result("Done!");
    }).fail(function (xhr, textStatus, errorThrown) {
        showError(xhr);
    });
}

function processCRHandler(event) {
    if (event.keyCode == 13) {
        // check to make sure the usernameand password are not blank
        var username = $("#txtUsername").val();
        var password = $("#txtPassword").val();
        if (username.length > 0 && password.length > 0) {
            loginHandler();
        }
    }
}

function loginHandler(callback) {
    var response;

//    promise = new $.Deferred();

    // disabled the login button to avoid multiple events
    $("#btnLogin").prop('disabled', true);
    $("#timerBarRow").show();
    timerControl = new statusBar();
    timerControl.Control = $("#timerBar");
    timerControl.Interval = 80;
    timerControl.Start();


    var loginData = {
        grant_type: 'password',
        username: $("#txtUsername").val(),
        password: $("#txtPassword").val()
    };

    
    $.ajax({
        type: 'POST',
        url: '/Token',
        data: loginData
    }).done(function (data) {
        // Cache the access token in session storage.
        sessionStorage.setItem(tokenKey, data.access_token);
        updateFormMethod(data.userName);
        // Get the current company record for the logged in user
        response = getCompany(currentCompanyHandler, errorHandler, data.userName);
        // Load the main frame data
        (response.Promise).done(function () {
            timerControl.Stop();
            loadHomePage();
            closeLogin();
        });
    }).fail(function (xhr, textStatus, errorThrown) {
        timerControl.Stop();
        $("#timerBarRow").hide();
        showError(xhr);
        // re-enable the login button 
        $("#btnLogin").prop('disabled', false);
    });

    
}


function currentCompanyHandler(data) {
    currentCompany = new Company();
    currentCompany.Name = data.Name;
    currentCompany.CompanyID = data.CompanyID;
    currentCompany.ContactName = data.ContactName;
    currentCompany.ContatAlias = data.ContactAlias;
    currentCompany.OrganizationRestricted = data.OrganizationRestricted;
    currentCompany.ProjectRestricted = data.ProjectRestricted;
    currentCompany.isActive = data.isActive;
}

function errorHandler(message) {
    alert(message);
}

// Declare a function to log the current user out
function logout() {
    var targetUrl;

    var token = sessionStorage.getItem(tokenKey);
    var headers = {};
    if (token) {
        headers.Authorization = 'Bearer ' + token;
    }

    targetUrl = "/api/account/logout";

    $.ajax({
        type: 'POST',
        url: targetUrl,
        headers: headers
    }).done(function (data) {
        //        alert(data.userName);
        updateFormMethod("");
        sessionStorage.removeItem(tokenKey);
        clearHomePage();
        enableMainMenuOptions(false, false, false);
    }).fail(function (xhr, textStatus, errorThrown) {
        showError(xhr);
    });
}

function validate() {
    alert("Feature Not Yet Implemented");
    $("#form").remove();
}

function closeLogin() {
    $("#form").remove();
}