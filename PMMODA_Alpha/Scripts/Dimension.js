"use strict"

var Dimension = function () {

    this.ID;
    // Declre an object to store the organization ID
    this.OrganizationID;
    // Declare an object to store teh friendly name
    this.Name;
    // Declare an object to store the description
    this.Description;
    // Declare an object to store the assigned role for this dimension
    this.Role;
    // Declare an object to store the active state flag
    this.isActive;

    this.Load = loadData;

//    this.loadDimensionsByOrg = loadDimensionsByOrg;
//    this.Save = saveData;
//    this.Update = updateData;

    function loadData(Url, ID, callback) {

        // declare a local variable to store the constructed URL
        var targetUrl;

        if (ID != undefined) {
            targetUrl = Url + "/" + ID;
            // Make the asynchronous AJAX call to get the data
            $.when($.getJSON(targetUrl)).then(function (data, textStatus, jqXHR) { callback(data); });
        }
    }

}