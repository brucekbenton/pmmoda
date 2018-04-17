
"use strict"


//var updateFormMethod;

var systemPasswordResetForm = function () {
    this.currentUser;
    this.Show = showPasswordResetForm;
}


function showPasswordResetForm() {


    var width = $(document).width();
    var left = width / 2 - 85;
    var height = $(document).height();
    var top = parseInt((height / 2) - 165);

    $("<DIV id='form' ></DIV>").addClass("popupForm").css({ 'width': '425px', 'height': '225px', 'top': '75px', 'left': '100px' }).appendTo('body');
    $("<DIV id='header' ></DIV>").addClass("headerCol").appendTo('#form');
    $("<p></p>").addClass("smallHeader").text('Change Password').appendTo('#header');
    // Add the name fields
    $("<DIV id='usernameRowContainer' ></DIV>").addClass("formRow").appendTo('#form');
    $("<DIV id='usernameLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#usernameRowContainer');
    $("<p></p>").text('Username:').appendTo('#usernameLabelContainer');
    $("<DIV id='usernameInputContainer' ></DIV>").addClass("inputColumn").css({ 'left': '150px' }).appendTo('#usernameRowContainer');
    $("<input id='txtUsername' type='text'></input>").addClass("formTextBox").appendTo('#usernameInputContainer');


    // Add the old password content
//    $("<DIV id='oldPasswordRowContainer' ></DIV>").addClass("formRow").appendTo('#form');
//    $("<DIV id='oldPasswordLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#oldPasswordRowContainer');
//    $("<p></p>").text('Old Password:').appendTo('#oldPasswordLabelContainer');
//    $("<DIV id='oldPasswordInputContainer' ></DIV>").addClass("inputColumn").css({ 'left': '150px'}).appendTo('#oldPasswordRowContainer');
//    $("<input id='txtOldPassword' type='password'></input>").addClass("formTextBox").appendTo('#oldPasswordInputContainer');

    $("<DIV id='newPasswordRowContainer' ></DIV>").addClass("formRow").appendTo('#form');
    $("<DIV id='newPasswordLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#newPasswordRowContainer');
    $("<p></p>").text('New Password:').appendTo('#newPasswordLabelContainer');
    $("<DIV id='newPasswordInputContainer' ></DIV>").addClass("inputColumn").css({ 'left': '150px' }).appendTo('#newPasswordRowContainer');
    $("<input id='txtNewPassword' type='password'></input>").addClass("formTextBox").appendTo('#newPasswordInputContainer');

//    $("<DIV id='confirmPasswordRowContainer' ></DIV>").addClass("formRow").appendTo('#form');
//    $("<DIV id='confirmPasswordLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#confirmPasswordRowContainer');
//    $("<p></p>").text('Confirm Password:').appendTo('#confirmPasswordLabelContainer');
//    $("<DIV id='confirmPasswordInputContainer' ></DIV>").addClass("inputColumn").css({ 'left': '150px' }).appendTo('#confirmPasswordRowContainer');
//    $("<input id='txtConfirmPassword' type='password'></input>").addClass("formTextBox").appendTo('#confirmPasswordInputContainer');


    // Add the navigation bar to the bottom
    $("<DIV id='navBar' ></DIV>").addClass("navigationBar").appendTo('#form');
    $("<p id='navParagraph'></p>").css({ 'text-align': 'center' }).appendTo('#navBar');
    $("<button id='btnLogin'></button>").addClass("cellButton").text("Apply").on("click", systemResetUpdateHandler).appendTo("#navParagraph");
    $("<button></button>").addClass("cellButton").text("Cancel").on("click", closeLogin).appendTo("#navParagraph");
}


function systemResetUpdateHandler(callback) {
    var response;
    var targetUrl;
    var username;
    var password;

    // disabled the login button to avoid multiple events
    $("#btnLogin").prop('disabled', true);

//    var loginData = {
//        grant_type: 'password',
    //};

    username = $("#txtUsername").val();
    password = $("#txtNewPassword").val();


    var token = sessionStorage.getItem(tokenKey);
    var headers = {};
    if (token) {
        headers.Authorization = 'Bearer ' + token;
    }


    targetUrl = UserUrl +"/SystemPasswordReset" + "?username=" + username + "&password=" + password;

    $.ajax({
        type: 'PUT',
        url: targetUrl,
        headers: headers,
    }).done(function (data) {
            closeChangePassword();
    }).fail(function (xhr, textStatus, errorThrown) {
        pmmodaErrorHandler(xhr,0);
        // re-enable the login button 
        $("#btnLogin").prop('disabled', false);
    });
}

function passwordErrorHandler(response,code){
    alert(response.responseText);
}


function closeChangePassword() {
    $("#form").remove();
}