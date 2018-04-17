"use strict"

var ProjectTeamForm = function () {
    this.show = showProjectTeamForm;
    this.close = closeProjectTeamForm;
    var currentOrg;
    var UserID = 1; // TBD - This needs to be removed when I integrate authentication
    var closeMethod;

    function showProjectTeamForm(callback) {

        closeMethod = callback;

        $("<DIV id='form' ></DIV>").addClass("popupFrame").css({ 'width': '655px', 'height': '650px', 'top': '75px', 'left': '100px' }).appendTo('body');
        //        $("<DIV id='header' ></DIV>").addClass("headerCol").appendTo('#form');
        //        $("<p></p>").addClass("pageHeader").text('Projects').appendTo('#header');
        //        $("<DIV id='frame'></DIV>").addClass("viewFrame").css({ 'width': '550px', 'height': '650px'}).appendTo('body');
        $("#form").load('templates/projectTeamForm.html', function () {
            var item = document.getElementById("testBody");
            angular.bootstrap(item, ["Organization"]);
        });


    }

    function closeFormHandler() {
        closeHostForm();
    }


    function closeProjectTeamForm() {
        closeMethod();
        // Close the current form
        $("#form").remove();

    }
}