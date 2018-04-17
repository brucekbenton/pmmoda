"use strict"



var ProjectDetailForm = function (orgID, userID) {
    this.OrgID = orgID;
    this.UserID = userID;
    this.show = showProjectForm;
    this.close = closeProjectForm;
    var UserID = 1; // TBD - This needs to be removed when I integrate authentication

    // Declare an object to store the  Role WebApi address
    var ProjectUrl = "http://localhost/WebAPITest/api/Project";
    // Declare the service address for the Deliverable WebApi. This is used to create the root deliverable for the new project
    var DeliverableUrl = "http://localhost/WebAPITest/api/deliverable";




    function showProjectForm() {
        // Declare a local variable to store the query Url
        var targetUrl;

        $("<DIV id='form' ></DIV>").addClass("popupForm").css({ 'width': '600px', 'height': '500px', 'top': '200px', 'left': '400px' }).appendTo('body');
        $("<DIV id='header' ></DIV>").addClass("headerCol").appendTo('#form');
        $("<p></p>").addClass("pageHeader").text('Organization').appendTo('#header');

        // Add the name fields
        $("<DIV id='nameContainer' ></DIV>").addClass("formSpan").css({ 'height': '35px' }).appendTo('#form');
        $("<DIV id='nameLabel' ></DIV>").addClass("formLabelCol").css({ 'column-width': '150px' }).appendTo('#nameContainer');
        $("<p></p>").addClass("formLabel").text('Name').appendTo('#nameLabel');
        $("<DIV id='nameInput' ></DIV>").addClass("formInputCol").css({ 'column-width': '425px', 'margin-top': '8px' }).appendTo('#nameContainer');
        $("<input id='txtName' type='text'></input>").css({ 'width': '365px' }).appendTo('#nameInput');

        // Add the description content
        $("<DIV id='descriptionContainer' ></DIV>").addClass("formSpan").css({ 'height': '50px' }).appendTo('#form');
        $("<DIV id='descriptionLabel' ></DIV>").addClass("formLabelCol").css({ 'column-width': '150px' }).appendTo('#descriptionContainer');
        $("<p></p>").addClass("formLabel").text('Description').appendTo('#descriptionLabel');
        $("<DIV id='descriptionInput' ></DIV>").addClass("formInputCol").css({ 'column-width': '425px' }).appendTo('#descriptionContainer');
        $("<TextArea id='txtDescription' cols='40' rows='2' ></TextArea>").addClass('formInput').appendTo('#descriptionInput');

        // Add the purpose content
        $("<DIV id='purposeContainer' ></DIV>").addClass("formSpan").css({ 'height': '50px' }).appendTo('#form');
        $("<DIV id='purposeLabel' ></DIV>").addClass("formLabelCol").css({ 'column-width': '150px' }).appendTo('#purposeContainer');
        $("<p></p>").addClass("formLabel").text('Purpose').appendTo('#purposeLabel');
        $("<DIV id='purposeInput' ></DIV>").addClass("formInputCol").css({ 'column-width': '425px' }).appendTo('#purposeContainer');
        $("<TextArea id='txtPurpose' cols='40' rows='4' ></TextArea>").addClass('formInput').appendTo('#purposeInput');

        // Add the navigation bar to the bottom
        $("<DIV id='navBar' ></DIV>").addClass("navigationBar").appendTo('#form');
        $("<p id='navParagraph'></p>").css({ 'text-align': 'center' }).appendTo('#navBar');
        $("<b id='btnSave'></b>").addClass("SelectButton").text("Save").appendTo("#navParagraph");
        $("<b></b>").addClass("SelectButton").text("Cancel").on("click", closeProjectForm).appendTo("#navParagraph");

        // Declare an event handler for the save button
        $("#btnSave").click(saveProjectHandler);

    }

    function saveProjectHandler() {

        var newProject = new Project();

        newProject.Name = $("#txtName").val();
        newProject.Description = $("#txtDescription").val();
        newProject.Purpose = $("#txtPurpose").val();
        newProject.OrganizationID = orgID;
        newProject.UserID = userID;

        // update the target URL
        var targetUrl = ProjectUrl;
        // Update the stored data
        $.ajax({
            url: targetUrl,
            type: 'POST',
            dataType: 'json',
            data: newProject,
            success: function (data, txtStatus, xhr) {
                // Get the response header text returned from the controller call
                var response = xhr.getResponseHeader("Location");
                // Parse the response text to get the new ORg ID
                var id = parseInt(response.substring(response.indexOf("Project") +"Project".length+1));
                // Add an initial deliverable into the WBS to represent the project root
                addRootDeliverable(newProject.Name,newProject.Description,id);
                closeProjectForm();
            },
            error: function (xhr, textStatus, errorThrown) {
                alert("error");
            }
        });// .done(saveNewRoles);
    }


    function addRootDeliverable(name, description, projectID) {
        var newDeliverable = new Deliverable();
        // Set the parent value based on the currentDeliverable
        newDeliverable.ParentID = 0;
        newDeliverable.ProjectID = projectID; 
        newDeliverable.Name = name;
        newDeliverable.Description = description;
        newDeliverable.CrossReference = "";
        newDeliverable.UserID = userID;


        var targetUrl = DeliverableUrl;
        // Update the stored data
        $.ajax({
            url: targetUrl,
            type: 'POST',
            dataType: 'json',
            data: newDeliverable,
            success: function (data, txtStatus, xhr) {
                window.location.reload(true);
            },
            error: function (xhr, textStatus, errorThrown) {
                alert("error");
            }
        });
    }

    function closeProjectForm() {
        $("#form").remove();
    }


}