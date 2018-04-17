"use strict"

//function CommonUtilities() {

var deferredArray = [];

    // Declare a funtion to load the defined staff count for the current project
    function loadStaffByProject(ProjectID, callback, errorHandler) {
        // Declare a Deferred construct to return from this method
        var response = new Response();
        var targetUrl;

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};

        if(token) {
            headers.Authorization = 'Bearer ' +token;
        }

        targetUrl = StaffUrl + "/" + ProjectID;

        response.Promise = $.ajax({
            url: targetUrl,
            type: 'GET',
            dataType: 'json',
            headers: headers,
        }).done(function (data, txtStatus, jqXHR) {
                //            alert("Insert Success");
                callback(data);
        }).fail(function (xhr, textStatus, errorThrown) {
                errorHandler(xhr, 1303);
        });

        return (response);

    }

    /// Declare a function to update the staffing counts
    function updateStaffingCounts(ProjectID,data,callback,errorHandler) { 

        var targetUrl = StaffUrl + "/" + ProjectID;
        var user = getCookieCurrentUser();

        var token = sessionStorage.getItem(tokenKey);
        var headers = { };
        if(token) {
            headers.Authorization = 'Bearer ' +token;
            }

        // Get the current userID
            // Loop over the records in teh staffing collection
        var index = 0;
        //            while (index < data.length) {
        while (index < data.length) {

                var staff = new Staff();

                staff.ProjectID = ProjectID;
                staff.MasterRoleID = data[index].MasterRoleID;
                staff.Count = data[index].Count;


                staff.isActive = 1;
                staff.UserID = 1;

                deferredArray.push($.ajax({
                    url: targetUrl,
                    type: "PUT",
                    dataType: "json",
                        data: staff,
                        headers: headers,
                        }).done(function (data, txtStatus, jqXHR) {
                            //            alert("Insert Success");
                    }).fail(function (xhr, textStatus, errorThrown) {
                    errorHandler(xhr, 1304);
    }));
                index++;
    }

            $.when.apply(this, deferredArray).then(function () {
                callback(data);
//            staffingIsDirty = false;
//                    refreshForm();
    });

    }


    /// Declare a function to load all current organizations
    function loadAllOrganizations() {
    }
    
    /// Declare a function to load the set of defined Companies in the current DB
    function loadCompanyData(callback,errorHandler) {

        // Declare a Deferred construct to return from this method
        var response = new Response();

        // declare a local variable to store the constructed URL
        var targetUrl;
        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // Hard code this to the UnitDimension service for now
        targetUrl = CompanyUrl +"/Company";
        // Make the asynchronous AJAX call to get the data
        response.Promise = $.ajax({
            url: targetUrl,
            type: 'GET',
            dataType: 'json',
            headers: headers
        }).done(function (data, txtStatus, jqXHR) {
            //            alert("Insert Success");
            callback(data);
        }).fail(function (xhr, textStatus, errorThrown) {
            response.status = xhr.status;
            errorHandler(response,102);
//            alert("Company Load Error:" + xhr.responseText);
        });

        return (response);
    }

    /// Declare a function to load the company details for the current user
    function loadCompanyDataByUser(callback, errorHandler) {

        // Declare a Deferred construct to return from this method
        var response = new Response();

        // declare a local variable to store the constructed URL
        var targetUrl;
        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // Hard code this to the UnitDimension service for now
        targetUrl = CompanyUrl + "/CompanyByUser";
        // Make the asynchronous AJAX call to get the data
        response.Promise = $.ajax({
            url: targetUrl,
            type: 'GET',
            dataType: 'json',
            headers: headers
        }).done(function (data, txtStatus, jqXHR) {
            //            alert("Insert Success");
            callback(data);
        }).fail(function (xhr, textStatus, errorThrown) {
            response.status = xhr.status;
            errorHandler(response, 102);
            //            alert("Company Load Error:" + xhr.responseText);
        });

        return (response);
    }


    /// Declare a function to get the company details for the specified user
    function getCompany(callback, errorHandler,username) {

        // Declare a Deferred construct to return from this method
        var response = new Response();

        // declare a local variable to store the constructed URL
        var targetUrl;
        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // Hard code this to the UnitDimension service for now
        targetUrl = UserUrl + "?username=" + username;
        // Make the asynchronous AJAX call to get the data
        response.Promise = $.ajax({
            url: targetUrl,
            type: 'GET',
            dataType: 'json',
            headers: headers
        }).done(function (data, txtStatus, jqXHR) {
            //            alert("Insert Success");
            callback(data);
        }).fail(function (xhr, textStatus, errorThrown) {
            response.status = xhr.status;
            errorHandler(response);
            //            alert("Company Load Error:" + xhr.responseText);
        });

        return (response);
    }

    /// Declare a function to get the company details for the current user
    function getCompanyOfCurrentUser(callback, errorHandler) {

        // Declare a Deferred construct to return from this method
        var response = new Response();

        // declare a local variable to store the constructed URL
        var targetUrl;
        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // Hard code this to the UnitDimension service for now
        targetUrl = UserUrl;
        // Make the asynchronous AJAX call to get the data
        response.Promise = $.ajax({
            url: targetUrl,
            type: 'GET',
            dataType: 'json',
            headers: headers
        }).done(function (data, txtStatus, jqXHR) {
            //            alert("Insert Success");
            callback(data);
        }).fail(function (xhr, textStatus, errorThrown) {
            response.status = xhr.status;
            errorHandler(response,103);
            //            alert("Company Load Error:" + xhr.responseText);
        });

        return (response);
    }


    // Declare a function to load the Natural  Units for the current organization
    function loadNaturalUnitsByOrg(ID, callback,errorHandler) {
        // Declare a Deferred construct to return from this method
        var promise;
        // Declare a Deferred construct to return from this method
        var response = new Response();

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // declare a local variable to store the constructed URL
        var targetUrl;

        // Hard code this to the UnitDimension service for now
        targetUrl = NaturalUnitUrl + "/" + ID;
        // Make the asynchronous AJAX call to get the data
        promise = $.ajax({
            url: targetUrl,
            type: 'GET',
            dataType: 'json',
            headers: headers,
        }).done(function (data, txtStatus, jqXHR) {
            //            alert("Insert Success");
            callback(data);
        }).fail(function (xhr, textStatus, errorThrown) {
            response.status = xhr.status;
            errorHandler(response, 603);
        });

        return (promise);
    }


    // Declare a function to load the Natural Unit Model for the specified unit and organization
    function loadNaturalUnitModel(UnitID, OrgID, callback,errorHandler) {
        // Declare a Deferred construct to return from this method
        var promise;
        // Declare a Deferred construct to return from this method
        var response = new Response();

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // declare a local variable to store the constructed URL
        var targetUrl;

//        targetUrl = NaturalUnitUrl + "/" + ID;

        targetUrl = NaturalUnitModelUrl + "?UnitID=" + UnitID + "&OrgID=" + OrgID;

        // Make the asynchronous AJAX call to get the data
        promise = $.ajax({
            url: targetUrl,
            type: 'GET',
            dataType: 'json',
            headers: headers,
        }).done(function (data, txtStatus, jqXHR) {
            //            alert("Insert Success");
            callback(data);
        }).fail(function (xhr, textStatus, errorThrown) {
            response.status = xhr.status;
            errorHandler(response, 703);
        });

        return (promise);
    }

    /// Declare a function to load  tehcurrent dimensions for the specified organization
    function loadDimensionsByOrg(ID, callback,errorHandler) {
        // Declare a Deferred construct to return from this method
        var promise;
        var targetUrl;
        // Declare a Deferred construct to return from this method
        var response = new Response();

        promise = new $.Deferred();

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        // construct the required url
        targetUrl = DimensionUrl + "/" + ID;

        promise = $.ajax({
            url: targetUrl,
            type: 'GET',
            dataType: 'json',
            headers: headers,
            success: function (data, txtStatus, xhr) {
                callback(data);
            },
            error: function (xhr, textStatus, errorThrown) {
                /// TBD - This needs to be updated to pull the error message into the alert box
                response.status = xhr.status;
                errorHandler(response, 403);
//                alert("Dimension Load Error: " + xhr.responseText);
            }
        });

        return (promise);
    }



// Declare a shared function to load the collection of Organizations
    function loadOrganizations(callback,errorHandler) {
        // Declare a Deferred construct to return from this method
        var promise;
        // Declare a Deferred construct to return from this method
        var response = new Response();

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        //        $.when($.getJSON(organizationUrl)).then(function (data, textStatus, jqXHR) { callback(data); });
        promise = $.ajax({
            url: organizationUrl,
            type: 'GET',
            dataType: 'json',
            headers: headers,
            success: function (data, txtStatus, xhr) {
                callback(data);
            },
            error: function (xhr, textStatus, errorThrown) {
                response.status = xhr.status;
                errorHandler(response, 801);
            }
        });

        return (promise);
    }

    // Declare a shared function to load the collection of Organizations
    function loadOrganizationsByCompany(ID,callback, errorHandler) {
        var targetUrl;
        // Declare a Deferred construct to return from this method
        var promise;
        // Declare a Deferred construct to return from this method
        var response = new Response();

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        //        $.when($.getJSON(organizationUrl)).then(function (data, textStatus, jqXHR) { callback(data); });

        targetUrl = organizationUrl + "?CompanyID=" + ID;
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
                errorHandler(response, 802);
            }
        });

        return (promise);
    }


    // Declare a function to load the detail results for the current organization
    function loadOrganizationDetails(ID, callback, errorHandler) {
        var promise;
        // Declare a resonse structure to return from this object
        var response = new Response();

        var targetUrl = OrganizationUrl + "/" + ID;

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // Check to make sure the org ID is defined
        promise = $.ajax({
            url: targetUrl,
            type: 'GET',
            dataType: 'json',
            headers: headers,
            success: function (data, txtStatus, xhr) {
                callback(data);
            },
            error: function (xhr, textStatus, errorThrown) {
                response.status = xhr.sttus;
                errorHandler(response,810);
            }
        });

        return (promise);
    }

    // Declare a function to load the Master Roles for the current company
    function loadMasterRoles(callback, errorHandler) {
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

        // Add a blank option to the combo box
        $('<option></option>').appendTo($('#projectList'));

        targetUrl = MasterRoleUrl;

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
                errorHandler(response,503);
            }
        });

        return (promise);
    }

    // Declare a function to load the Master Roles for the current company
    function loadMasterRolesByCompany(CompanyID, callback, errorHandler) {
        // Declare a Deferred construct to return from this method
        var promise;
        var targetUrl;
        // Declare a resonse structure to return from this object
        var response = new Response();

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // Empy any current options from the Project Select control
//        emptyProjectList();

        // Add a blank option to the combo box
        $('<option></option>').appendTo($('#projectList'));

        targetUrl = MasterRoleUrl + "?CompanyID=" + CompanyID;

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
                errorHandler(response,503);
            }
        });

        return (promise);
    }

// Declre a function to save a new MAster Role
    function saveMasterRole() {

    }
        


    // Declare a function to load the project list for the specified org
    function loadProjectOptions(ID,callback,errorHandler) {
        // Declare a Deferred construct to return from this method
        var promise;
        var targetUrl;
        // declare a variable to store the current project ID
        var projectID;
        // Declare a resonse structure to return from this object
        var response = new Response();

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // Empy any current options from the Project Select control
        emptyProjectList();

        // Add a blank option to the combo box
        $('<option></option>').appendTo($('#projectList'));

        targetUrl = ProjectUrl + "/" + ID;

        promise = $.ajax({
            url: targetUrl,
            type: 'GET',
            dataType: 'json',
            headers: headers,
            success: function (data, txtStatus, xhr) {
                // Process the supplied callback
                callback(data);
            },
            error: function (xhr, textStatus, errorThrown) {
                response.status = xhr.status;
                errorHandler(response,1103);
            }
        });

        return (promise);
    }

    // Declare a function to load the project list for the specified org
    function loadUserRolesByCompany(ID, callback, errorHandler) {
        // Declare a Deferred construct to return from this method
        var promise;
        var targetUrl;
        // Declare a resonse structure to return from this object
        var response = new Response();

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // Empy any current options from the Project Select control
//        emptyProjectList();

        // Add a blank option to the combo box
//        $('<option></option>').appendTo($('#projectList'));

        targetUrl = UserUrl + "/UserRoles" + "?CompanyID=" + ID;

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
                errorHandler(response,903);
            }
        });

        return (promise);
    }

    // Declare a function to load the project list for the specified org
    function loadUsersByCompany(ID, callback, errorHandler) {
        // Declare a Deferred construct to return from this method
        var promise;
        var targetUrl;
        // Declare a resonse structure to return from this object
        var response = new Response();

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // Empy any current options from the Project Select control
//        emptyProjectList();

        // Add a blank option to the combo box
//        $('<option></option>').appendTo($('#projectList'));

        targetUrl = UserUrl + "/Users" + "?CompanyID=" + ID;

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
                errorHandler(response, 903);
            }
        });

        return (promise);
    }


    // Declare a function to create a new user role
    function CreateNewUserRole(role, errorHandler) {
        // Declare a Deferred construct to return from this method
        var promise;
        var targetUrl;
        // Declare a resonse structure to return from this object
        var response = new Response();

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }


        targetUrl = UserUrl + "?role=" + role;

        promise = $.ajax({
            url: targetUrl,
            type: 'POST',
            dataType: 'json',
            headers: headers,
            success: function (data, txtStatus, xhr) {
            },
            error: function (xhr, textStatus, errorThrown) {
                response.Sttus = xhr.status;
                errorHandler(resposne, 901);
            }
        });

        return (promise);
    }

    // Declare a function to create a new user role
    function CreateNewUser(role, errorHandler) {
        // Declare a Deferred construct to return from this method
        var promise;
        var targetUrl;
        // Declare a resonse structure to return from this object
        var response = new Response();

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }


        targetUrl = UserUrl + "?role=" + role;

        promise = $.ajax({
            url: targetUrl,
            type: 'POST',
            dataType: 'json',
            headers: headers,
            success: function (data, txtStatus, xhr) {
            },
            error: function (xhr, textStatus, errorThrown) {
                response.status = xhr.status;
                errorHandler(response, 901);
            }
        });

        return (promise);
    }



    /// Declare a function to loop through th eorganization list and return the org corresponding to the supplied ID
    function getCurrentOrganization(ID, orgArray) {
        var selectedOrg = new Organization();

        for (var index = 0; index < orgArray.length; index++) {
            if (orgArray[index].ID == ID) {
                selectedOrg = orgArray[index];
                break;
            }
        }
        return (selectedOrg);
    }

    function getReferenceDimension(ID, orgArray) {
        var selectedDim = new Dimension();
        var index = 0;

        while (index < orgArray.length) {
            if (orgArray[index].ID == ID) {
                selectedDim = orgArray[index];
                break;
            }
            index++;
        }
        return (selecedDim);
    }

/// Declare a function to return the object instance in an array which matches the passed in ID
//  This requires that the primary ID field in the passed in array be named "ID"
    function getArrayValue(dataArray, id) {
        var selectedValue;
        var index = 0;

        while(index < dataArray.length){
            if(id == dataArray[index].ID){
                selectedValue = dataArray[index];
                break;
            }
            index++
        }
        return(selectedValue);
    }

    // Declare a function to load the Unit Dimension array for the current organization
    function loadUnitDimensionsByOrg(ID, callback) {
        // Declare a Deferred construct to return from this method
        var promise;

        // declare a local variable to store the constructed URL
        var targetUrl;
        // Declare a resonse structure to return from this object
        var response = new Response();

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // Hard code this to the UnitDimension service for now
        targetUrl = "/api/UnitDimension" + "/" + ID;
        // Make the asynchronous AJAX call to get the data
        //        $.when($.getJSON(targetUrl)).then(function (data, textStatus, jqXHR) { callback(ID,data); });
        promise = $.ajax({
            url: targetUrl,
            type: 'GET',
            dataType: 'json',
            headers: headers,
        }).done(function (data, txtStatus, jqXHR) {
            //            alert("Insert Success");
            callback(ID, data);
        }).fail(function (xhr, textStatus, errorThrown) {
            response.Sttus = xhr.status;
            pmmodaErrorHandler(response, 1403);
//            alert("Dimension Error:" + xhr.responseText);
        });

        return (promise);
    }

/// Declare a convenience functiont to get the set of roles defined for the current organization
    function loadRolesByOrganization(OrgID, callback,errorHandler) {
        var promise;
        // declare a local variable to store the constructed URL
        var targetUrl;
        // Declare a resonse structure to return from this object
        var response = new Response();

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // Hard code this to the UnitDimension service for now
        targetUrl = RoleUrl + "/AllRoles/?Id=" + OrgID;
        // Make the asynchronous AJAX call to get the data
        promise = $.ajax({
            url: targetUrl,
            type: 'GET',
            dataType: 'json',
            headers: headers,
        }).done(function (data, txtStatus, jqXHR) {
            //            alert("Insert Success");
            callback(data);
        }).fail(function (xhr, textStatus, errorThrown) {
            response.status = xhr.status;
            errorHandler(response,1203);
        });

        return(promise);
    }

    /// Declare a convenience functiont to get the set of roles defined for the current organization
    function loadActiveRolesByProject(OrgID, callback,errorHandler) {
        var promise;
        // declare a local variable to store the constructed URL
        var targetUrl;
        // Declare a resonse structure to return from this object
        var response = new Response();

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // Hard code this to the UnitDimension service for now
        // TBD - This is hardcoded to user ID 1 until USer ID is removed from this signature since it is not needed
        targetUrl = RoleUrl + "/ActiveRoles/?OrganizationID=" +OrgID;
        // Make the asynchronous AJAX call to get the data
        promise = $.ajax({
            url: targetUrl,
            type: 'GET',
            dataType: 'json',
            headers: headers,
        }).done(function (data, txtStatus, jqXHR) {
            //            alert("Insert Success");
            callback(data);
        }).fail(function (xhr, textStatus, errorThrown) {
            response.status = xhr.sttus;
            errorHandler(response,1202);
        });

        return (promise);
    }



    // Declare a function to load the Deliverables for the current project
    function loadDeliverablesByProject(ID, callback, errorHandler) {
        // Declare a Deferred construct to return from this method
        var promise;
        // Declare a resonse structure to return from this object
        var response = new Response();

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // declare a local variable to store the constructed URL
        var targetUrl;

        // Hard code this to the UnitDimension service for now
        targetUrl = DeliverableUrl + "?ProjectID=" + ID;
        // Make the asynchronous AJAX call to get the data
        promise = $.ajax({
            url: targetUrl,
            type: 'GET',
            dataType: 'json',
            headers: headers,
        }).done(function (data, txtStatus, jqXHR) {
            //            alert("Insert Success");
            callback(data);
        }).fail(function (xhr, textStatus, errorThrown) {
            response.status = xhr.status;
            errorHandler(response,203);
        });

        return (promise);
    }


    function showError(jqXHR) {
        alert(jqXHR.status + ': ' + jqXHR.responseText);
    }


    function validateAccess(successCallback, errorHandler,role){

        // declare a local variable to store the constructed URL
        var targetUrl;
        // Declare a resonse structure to return from this object
        var response = new Response();

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // Hard code this to the UnitDimension service for now
        targetUrl = UserUrl + "?Role=" + role;
        // Make the asynchronous AJAX call to get the data
        $.ajax({
            url: targetUrl,
            type: 'GET',
            dataType: 'json',
            headers: headers
        }).done(function (data, txtStatus, jqXHR) {
            successCallback(jqXHR);
        }).fail(function (xhr, textStatus, errorThrown) {
            response.status = xhr.status;
            response.Text = xhr.responseText;
            errorHandler(response,910);
        });

        return (response);

    }

    function pmmodaErrorHandler(response, srcCode) {
        if (srcCode == undefined) {
            srcCode = 0;
        }
        if (response.status == 401) {
            alert("Error ID: " + srcCode + ". The current user does not have permissions to perform the requested operation. Please contact your administrator.")
        }
        else if (response.status == 401) {
            alert("Error ID: " + srcCode + ". A precondition of the service call was not met. Please contact your administrator.")

        }
        else {
            alert("Error ID: " + srcCode + ". An unhandled error occurred on Web Service Call. Error Message: "+response.Text);
        }

    }

    function statusUpdate(control) {

    }

//}