"use strict";

var ActivityMap = function () {
    this.show = showActivityMap;
    this.close = closeActivityMap;
//    var currentOrg;
//    var UserID = 1; // TBD - This needs to be removed when I integrate authentication

    function showActivityMap() {

        $("<DIV id='form' ></DIV>").addClass("popupFrame").css({'width': '975px', 'height': '500px', 'top': '75px', 'left': '100px'}).appendTo('body');
        $("#form").load('templates/ActivityMap.html', function () {
            var item = document.getElementById("activityMap");
            angular.bootstrap(item, ["ActivityMapModule"]);
        });


    }



    function closeActivityMap() {
        // Close the current form
        $("#form").remove();

    }
}