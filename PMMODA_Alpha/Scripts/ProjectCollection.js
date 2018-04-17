"use strict"

var ProjectCollection = function () {

    this.load = loadProjects;

    function loadProjects(Url, ID, callback) {

        // declare a local variable to store the constructed URL
        var targetUrl;

        targetUrl = Url + "/" + ID;

        // Make the asynchronous AJAX call to get the data
        $.when($.getJSON(targetUrl)).then(function (data, textStatus, jqXHR) { callback(data); });
    }

}