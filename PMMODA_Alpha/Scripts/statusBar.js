"use strict"

var width;
var height;
var TickCount = 0;
var id;


function statusBar() {
    // The ID of the control being updated
    this.Control
    // The interval in milliseconds to update the status br
    this.Interval
    // The number of ticks elapsed
//    this.TickCount;
    // An optional callback function to execute when the time ends
    this.updateMainForm;

    var Timer;

    this.Start = StartTimer;
    this.Stop = StopTimer;



}

function StartTimer() {
//    var width;
//    var height;

    width = this.Control.width();
    height = this.Control.height();

    if (this.Control != undefined) {

        $("<DIV id='innerBar'></DIV>").css({ 'width': '5px', 'height': height, 'background-color': 'orange' }).appendTo(this.Control);
        id = setInterval(refreshControl, this.Interval);
//        this.Timer = $.timer(refreshControl, this.Interval, true);
    }

}

function refreshControl() {
//    var width;
//    var height;

    TickCount = TickCount + 1;

//    width = this.Control.width();
//    height = this.Control.height();
    $("#innerBar").width((width / 40) * TickCount);
    if (TickCount > 39) {
        TickCount=0;
    }

}

function StopTimer() {
    $("#innerBar").remove();
    clearInterval(id);
//    Timer.stop();
}