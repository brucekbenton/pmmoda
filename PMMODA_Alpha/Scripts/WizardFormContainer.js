"use strict"

var WizardFormContainer = function () {
    this.show = showWizardFormContainer;
    this.close = closeWizardFormContainer;
    var currentOrg;
    var UserID = 1; // TBD - This needs to be removed when I integrate authentication
    var closeMethod;

    function showWizardFormContainer(callback) {

        closeMethod = callback;

        $("<DIV id='form' ></DIV>").addClass("popupFrame").css({ 'width': '800px', 'height': '550px'}).appendTo('body');
        //        $("<DIV id='header' ></DIV>").addClass("headerCol").appendTo('#form');
        //        $("<p></p>").addClass("pageHeader").text('Projects').appendTo('#header');
        //        $("<DIV id='frame'></DIV>").addClass("viewFrame").css({ 'width': '550px', 'height': '650px'}).appendTo('body');
        $("#form").load('templates/Wizard.html', function () {
            var item = document.getElementById("testBody");
            angular.bootstrap(item, ["wizard"]);
        });


    }



    function closeWizardFormContainer() {
        closeMethod();
        // Close the current form
        $("#form").remove();

    }
}