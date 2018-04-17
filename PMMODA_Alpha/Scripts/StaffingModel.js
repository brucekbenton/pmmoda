"use strict"

var StaffingModel = function () {
    // Store the record ID for the current Staffing Model
    this.ModelID
    // Friendly name for the current staffing model
    this.Name;
    // Description of the current staffing model
    this.Description;
    // Flag indicating whether the current stffing model is active
    this.isActive;

    this.load = function (callback,errorHandler) {
        // Declare a Deferred construct to return from this method
        var promise;
        // Declare a resonse structure to return from this object
        var response = new Response();
        var targetUrl;

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // Empy any current options from the Project Select control
        //        emptyProjectList();


        targetUrl = StaffingModelUrl;

        promise = $.ajax({
            url: targetUrl,
            type: 'GET',
            dataType: 'json',
            headers: headers,
            success: function (data, txtStatus, xhr) {
                callback(data);
            },
            error: function (xhr, textStatus, errorThrown) {
                response.status = xhr.status;
                errorHandler(response, 1502);
            }
        });

        return (promise);
    }
}