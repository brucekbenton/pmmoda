"use strict"

var DimensionCollection = function () {

    // Declare a function to load the current Organization data set
    this.Load = loadDimensionData;


    function loadDimensionData(ID, targetUrl, callback) {
        if (ID != "") {
            targetUrl = targetUrl + "/" + ID;
            $.when($.getJSON(targetUrl)).then(function (data, textStatus, jqXHR) { callback(data); });
        }
        else {
            alert("No Organization currently selected");
        }
    }


}