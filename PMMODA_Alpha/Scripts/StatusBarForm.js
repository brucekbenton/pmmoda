"use strict"

// Declare a clas variable to store the timer control
var timerControl;


function StatusBarForm() {

    this.Show = showStatusBarForm;
    this.Close = closeStatusBarForm;

}

    function showStatusBarForm(){
        var width = $(document).width();
        var left = width / 2 - 200;
        var height = $(document).height();
        var top = parseInt((height / 2) - 165);

        $("<DIV id='form' ></DIV>").addClass("popupForm").css({ 'width': '425px', 'height': '100px', 'top': top, 'left': left }).appendTo('body');
        $("<DIV id='header' ></DIV>").addClass("headerCol").appendTo('#form');
        $("<p></p>").addClass("smallHeader").appendTo('#header');

        // Add a timer bar to track update status
        $("<DIV id='timerBarRow' ></DIV>").addClass("formRow").css({ 'margin-top': '0px' }).appendTo('#form');
        $("<DIV id='statusLabelContainer' ></DIV>").addClass("labelColumn").css({ 'font-weight': 'normal', 'margin-left': '100px' }).appendTo('#timerBarRow');
        $("<DIV>Status</DIV>").appendTo("#statusLabelContainer");
        $("<DIV id='statusDisplayInput' ></DIV>").addClass("inputColumn").css({ 'left': '155px', 'margin-top': '5px' }).appendTo('#timerBarRow');
        $("<DIV id='timerBar' ></DIV>").addClass("timerBar").appendTo("#statusDisplayInput");

        $("#timerBarRow").show();
        timerControl = new statusBar();
        timerControl.Control = $("#timerBar");
        timerControl.Interval = 80;
        timerControl.Start();

    }


    function closeStatusBarForm() {
        timerControl.Stop();
        $("#form").remove();
    }