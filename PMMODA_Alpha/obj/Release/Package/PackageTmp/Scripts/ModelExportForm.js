"use strict"

var updateFormMethod;


function ModelExportForm() {
    this.Show = showModelExportForm;

}

function showModelExportForm(callback) {

    updateFormMethod = callback;

    var width = $(document).width();
    var left = width / 2 - 85;
    var height = $(document).height();
    var top = parseInt((height / 2) - 165);

    $("<DIV id='form' ></DIV>").addClass("popupForm").css({ 'width': '425px', 'height': '175px', 'top': '75px', 'left': '100px' }).appendTo('body');
    $("<DIV id='header' ></DIV>").addClass("headerCol").appendTo('#form');
    $("<p></p>").addClass("smallHeader").text('Model Export Report').appendTo('#header');

    // Add the password content
    $("<DIV id='MethodRowContainer' ></DIV>").addClass("formSpan").css({'margin-top':'10px','height':'30px'}).appendTo('#form');
    $("<input type='radio' id='email'></input>").prop('checked', true).addClass("basicCheckBox").appendTo("#MethodRowContainer")
    $("<label for='email'>Email</label>").addClass("inputColumn").css({ 'left': '25px', 'width': '100px' }).appendTo("#MethodRowContainer");
    $("<input type='radio' id='future'></input>").addClass("basicCheckBox").css({'position':'absolute', 'left': '100px' }).prop('disabled', true).appendTo("#MethodRowContainer")
    $("<label for='email'>Future</label>").addClass("inputColumn").css({ 'left': '125px', 'width': '100px' }).appendTo("#MethodRowContainer");


    // Add the name fields
    $("<DIV id='usernameRowContainer' ></DIV>").addClass("formRow").appendTo('#form');
    $("<DIV id='usernameLabelContainer' ></DIV>").addClass("labelColumn").css({'margin-top':'-5px','padding-top':'0px'}).appendTo('#usernameRowContainer');
    $("<p></p>").text('Email Address:').appendTo('#usernameLabelContainer');
    $("<DIV id='usernameInputContainer' ></DIV>").addClass("inputColumn").css({ 'left': '150px','margin-top':'5px' }).appendTo('#usernameRowContainer');
    // check to see if the sprint value is defined
    $("<input id='txtUsername' type='text'></input>").addClass("formTextBox").appendTo('#usernameInputContainer');


    // Add the navigation bar to the bottom
    $("<DIV id='navBar' ></DIV>").addClass("navigationBar").appendTo('#form');
    $("<p id='navParagraph'></p>").css({ 'text-align': 'center' }).appendTo('#navBar');
    $("<b id='btnSend'></b>").addClass("SelectButton").text("Send").on('click', ModelExportReportHandler).appendTo("#navParagraph");
    $("<b></b>").addClass("SelectButton").text("Cancel").on('click',closeModelExportForm).appendTo("#navParagraph");

    $("#txtUsername").val($("#txtCurrentUserAlias").val());
}

// Declre a function to send a summary deliverable report for the current project
function ModelExportReportHandler() {
    var promise;
    var username;

    username = $("#txtUsername").val();
    var targetUrl = ReportUrl + "/DeliverableSummary?OrgID=" + orgID + "&ProjectID=" + c_currentProjectID + "&emailAddress=" + username + "&method=" + "EMAIL";

    var token = sessionStorage.getItem(tokenKey);
    var headers = {};
    if (token) {
        headers.Authorization = 'Bearer ' + token;
    }

    // Check to make sure the org ID is defined
    promise = $.ajax({
        url: targetUrl,
        type: 'GET',
        headers: headers,
        success: function (data, txtStatus, xhr) {
            closeModelExportForm();
//            alert("Check for email");
            //                    callback(data);
        },
        error: function (xhr, textStatus, errorThrown) {
            pmmodaErrorHandler(xhr, 303);
        }
    });

}


function closeModelExportForm() {
    $("#form").remove();
}