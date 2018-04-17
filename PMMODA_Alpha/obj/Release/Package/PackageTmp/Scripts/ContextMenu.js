"use strict"

var ContextMenu = function () {

    this.show = showMenu;
    this.close = closeMenu;



    /// DEclre a function to display the option menu
    function showMenu(top, left,options,deliverable) {
        $("<div id='menu' ></div>").addClass("deliverableContextMenu").css({ "top": top-10, "left": left-10 }).appendTo("#pageFrame");
        // Declare an event handler for when you leave the menu
        $("#menu").mouseleave(closeMenu);
        // load the options into the meu table
        loadOptions(options,deliverable);
    }

    // Load the provided array of menu option items into the option menu
    function loadOptions(options,deliverable) {
        for (var optionIndex = 0; optionIndex < options.length; optionIndex++){
            $("<div id='option" + options[optionIndex].ID + "'></div>").text(options[optionIndex].Text).addClass("optionDiv").appendTo("#menu");
            $("#option" + options[optionIndex].ID).click({ param1: options[optionIndex], param2: deliverable }, options[optionIndex].Callback);
        }
    }

    /// close the current menu
    function closeMenu() {
        if (optionMenuActive) {
            $("#menu").remove();
            optionMenuActive = false;
        }
    }
    /*
    // Hightlight the current menu option
    function highlightOption(event) {
        $("#option" + options[optionIndex].ID).class("highlightOptionDiv");

    }
    */
}