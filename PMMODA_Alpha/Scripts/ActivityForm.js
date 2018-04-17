/*jslint white:true, this:true*/
"use strict";

var ActivityForm = function () {
    this.show = showActivityForm;
    this.close = closeActivityForm;
    
    var currentOrg;
    var UserID = 1; // TBD - This needs to be removed when I integrate authentication

    function showActivityForm() {

        $("<DIV id='form' ></DIV>").addClass("popupFrame").css({ 'width': '975px', 'height': '500px', 'top': '75px', 'left': '100px' }).appendTo('body');
        //        $("<DIV id='header' ></DIV>").addClass("headerCol").appendTo('#form');
        //        $("<p></p>").addClass("pageHeader").text('Projects').appendTo('#header');
        //        $("<DIV id='frame'></DIV>").addClass("viewFrame").css({ 'width': '550px', 'height': '650px'}).appendTo('body');
        $("#form").load('templates/sample.html', function () {
            var item = document.getElementById("testBody");
            angular.bootstrap(item, ["Administration"]);
        });


    };

    function closeFormHandler() {
        closeHostForm();
    };


    function closeActivityForm() {
        // Close the current form
        $("#form").remove();

    };
}