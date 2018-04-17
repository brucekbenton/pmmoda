"use strict"

var CompanyForm = function () {
    this.show = showCompanyForm;
    this.close = closeCompanyForm;
    // declare an object to store the call back method to be called when the form is closed
    var updateMasterForm;
    // Declare a local object to store the current collection of Companies
    var Companies = [];
    // Declare a class variable to store the current company
    var localCompany;
    // Declare a variable to track the current admin mode
    var SU_mode = false;
    // Declare a variable to track whether you are in update company or new company mode
    var newCompanyMode = false;


    /// Declare a function to render the Company Maintenance Form
    function showCompanyForm(mode,callback) {

        localCompany = new Company();

        updateMasterForm = callback;

        // check for SuperUser mode
        if (mode) {
            SU_mode = true;
        }

        // Manage the form container
        $("<DIV id='form' ></DIV>").addClass("popupForm").css({ 'width': '500px', 'height': '500px', 'top': '75px', 'left': '100px' }).appendTo('body');
        $("<DIV id='header' ></DIV>").appendTo('#form');
        $("<p></p>").addClass("pageHeader").text('Company Management').appendTo('#header');

        // Add the company select option
        if (mode) {
            // Add the first row containing the org label and the org combo box box
            $("<DIV id='CompanyRowContainer' ></DIV>").addClass("formRow").css({'margin-top':'40px'}).appendTo('#form');
            // Add the name lable and input text box
            $("<DIV id='CompanyLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#CompanyRowContainer');
            $("<P>Company</p>").appendTo('#CompanyLabelContainer');
            $("<DIV id='companyInput' ></DIV>").addClass("inputColumn").css({'left':'150px'}).appendTo('#CompanyRowContainer');
            $("<SELECT id='formCompanyList' ></SELECT>").addClass("basicComboBox").appendTo("#companyInput");

            $("<DIV id='separatorRow' ></DIV>").addClass("formSeparator").appendTo('#form');
        }

        // Add the row containing the name input box a
        $("<DIV id='NameRowContainer' ></DIV>").addClass("formRow").appendTo('#form');
        // Add the name label and input text box
        $("<DIV id='NameLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#NameRowContainer');
        $("<P>Name</p>").appendTo('#NameLabelContainer');
        $("<DIV id='NameInputContainer' ></DIV>").addClass("inputColumn").css({ 'left': '150px' }).appendTo('#NameRowContainer');
        $("<INPUT type='text' id='txtName' ></INPUT>").addClass("formTextBox").appendTo("#NameInputContainer");

//        if (mode) {
//            $("#txtName").prop('disabled', true);
//        }


        // Add the row containing the Contact name input box a
        $("<DIV id='ContactRowContainer' ></DIV>").addClass("formRow").appendTo('#form');
        // Add the name label and input text box
        $("<DIV id='ContactLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#ContactRowContainer');
        $("<P>Contact Name</p>").appendTo('#ContactLabelContainer');
        $("<DIV id='ContactInputContainer' ></DIV>").addClass("inputColumn").css({ 'left': '150px' }).appendTo('#ContactRowContainer');
        $("<INPUT type='text' id='txtContactName' ></INPUT>").addClass("formTextBox").appendTo("#ContactInputContainer");

        // Add the row containing the Contact alias input box a
        $("<DIV id='ContactAliasRowContainer' ></DIV>").addClass("formRow").appendTo('#form');
        // Add the name label and input text box
        $("<DIV id='ContactAliasLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#ContactAliasRowContainer');
        $("<P>Contact Alias</p>").appendTo('#ContactAliasLabelContainer');
        $("<DIV id='ContactAliasInputContainer' ></DIV>").addClass("inputColumn").css({ 'left': '150px' }).appendTo('#ContactAliasRowContainer');
        $("<INPUT type='text' id='txtContactAlias' ></INPUT>").addClass("formTextBox").appendTo("#ContactAliasInputContainer");

        // Add the row containing the Domain name input box a
        $("<DIV id='DomainRowContainer' ></DIV>").addClass("formRow").appendTo('#form');
        // Add the name label and input text box
        $("<DIV id='DomainLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#DomainRowContainer');
        $("<P>Domain Name</p>").appendTo('#DomainLabelContainer');
        $("<DIV id='DomainInputContainer' ></DIV>").addClass("inputColumn").css({ 'left': '150px' }).appendTo('#DomainRowContainer');
        $("<INPUT type='text' id='txtDomainName' ></INPUT>").addClass("formTextBox").appendTo("#DomainInputContainer");

        // Add the organization restriction flag container
        $("<DIV id='orgFlagRow' ></DIV>").addClass("formRow").appendTo('#form');
        $("<DIV id='orgflagLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#orgFlagRow');
        //        $("<DIV id='activeFlagcontainer'></DIV>").addClass("sectionSpan").appendTo("#activeFlagSection");
        $("<input type='checkbox' id='orgFlag' />").addClass("basicCheckBox").appendTo("#orgflagLabelContainer")
        $("<label for='orgFlag'>Enforce restricted organizations</label>").addClass("inputColumn").css({ 'left': '25px','width':'250px' }).appendTo("#orgflagLabelContainer");

        // Add the project restriction flag container
        $("<DIV id='projectFlagRow' ></DIV>").addClass("formRow").appendTo('#form');
        $("<DIV id='projectflagLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#projectFlagRow');
        //        $("<DIV id='activeFlagcontainer'></DIV>").addClass("sectionSpan").appendTo("#activeFlagSection");
        $("<input type='checkbox' id='projectFlag' />").addClass("basicCheckBox").appendTo("#projectflagLabelContainer")
        $("<label for='projectFlag'>Enforce restricted projects</label>").addClass("inputColumn").css({ 'left': '25px', 'width': '250px' }).appendTo("#projectflagLabelContainer");

        if (mode) {
            // Add the active flag container
            $("<DIV id='activeFlagRow' ></DIV>").addClass("formRow").appendTo('#form');
            $("<DIV id='activeflagLabelContainer' ></DIV>").addClass("labelColumn").appendTo('#activeFlagRow');
            //        $("<DIV id='activeFlagcontainer'></DIV>").addClass("sectionSpan").appendTo("#activeFlagSection");
            $("<input type='checkbox' id='activeFlag' />").addClass("basicCheckBox").appendTo("#activeflagLabelContainer")
            $("<label for='activeFlag'>Active</label>").addClass("inputColumn").css({ 'left': '25px', 'width': '250px' }).appendTo("#activeflagLabelContainer");
        }

        // Add the navigation bar to the bottom
        $("<DIV id='navBar' ></DIV>").addClass("navigationBar").appendTo('#form');
        $("<p id='navParagraph'></p>").css({ 'text-align': 'center' }).appendTo('#navBar');
        $("<button id='btnSave'></button>").addClass("cellButton").prop('disabled', true).text("Save").appendTo("#navParagraph");
        $("<button id='btnUpdate'></button>").addClass("cellButton").prop('disabled', false).text("Update").appendTo("#navParagraph");
        $("<button></button>").addClass("cellButton").text("Close").on("click", closeCompanyFormHandler).appendTo("#navParagraph");

        // Create the event handlers for teh save and update buttongs
        $("#btnSave").click(saveCompanyHandler);
        $("#btnUpdate").click(updateCompanyHandler);
        $("#btnUpdate").hide();

        setEditMode(false);

        var promise;
        if (SU_mode) {
            SuperUserMode();
        }
        else {
            localAdminMode();
        }
//        promise = validateAccess(SuperUserMode, localAdminMode, "SuperUser");

    }

    function SuperUserMode(response) {
        var promise;
        promise = loadCompanyData(refreshCompanyComboData, localAdminMode);
    }

    function loadData() {

        var response = new Response();
        response = loadCompanyData(refreshCompanyComboData, localAdminMode);
    }

    function localAdminMode(response) {
        var promise;

        promise = loadCompanyDataByUser(populateCompanyData, pmmodaErrorHandler);

        // Hide the Company select row
        $("#CompanyRowContainer").hide();
        $("#separatorRow").hide();
        $("#NameRowContainer").css({ 'mrgin-top': '40px' });
        // Disable the company active flag for non super users
        $("#activeFlag").prop('disabled', true);
    }

    function populateCompanyData(data) {

        Companies.length = 0

        var item = new Company();
        localCompany.CompanyID = data.CompanyID;
        localCompany.Name = data.Name;
        localCompany.ContactName = data.ContactName;
        localCompany.ContactAlias = data.ContactAlias;
        localCompany.DomainName = data.DomainName;
        localCompany.OrganizationRestricted = data.OrganizationRestricted;
        localCompany.ProjectRestricted = data.ProjectRestricted;
        localCompany.isActive = data.isActive;
        Companies.push(localCompany);
//        localCompany = item;
        setCompany(localCompany.CompanyID);
    }

    // Declare a function to manage errors in the web service call
    function errorHandler(response) {
        if (response.Status == 401) {
            // Hide the company selector and populate the current values
            $("#CompanyRowContainer").hide();
            $("#separatorRow").hide();
            $("#NameRowContainer").css({ 'margin-top': '40px' });

            // check to see if the current user is a Company Admin and load that dataset
//            var username = $("#txtCurrentUserAlias").find("option:seelcted").text()
//            username = $("#txtCurrentUserAlias").find("option:seelcted").val()
            //            companyID = $("#formCompanyList").find('option:selected').val();
        }
    }


    // Declare a method to populate the Company combo box with the updated data
    function refreshCompanyComboData(data) {
        // Delete the current data
        $("#formCompanyList").empty();

        var index = 0;

        $("<option value='0'></option>").appendTo($('#formCompanyList'));
        while (index < data.length) {
            var item = new Company();
            item.CompanyID = data[index].CompanyID;
            item.Name = data[index].Name;
            item.ContactName = data[index].ContactName;
            item.ContactAlias = data[index].ContactAlias;
            item.DomainName = data[index].DomainName;
            item.OrganizationRestricted = data[index].OrganizationRestricted;
            item.ProjectRestricted = data[index].ProjectRestricted;
            item.isActive = data[index].isActive;
            Companies.push(item);
            // Add a list item for the organization.
            $("<option value='" + data[index].CompanyID + "'></option>").text(data[index].Name).appendTo($('#formCompanyList'));
            index++;
        }
        $("<option value='-1'></option>").text("[Add New Company ...]").appendTo($('#formCompanyList'));
        $("#formCompanyList").change(companySelectHandler);
    }
 
    /// Declare a function to set the input edit mode for the form
    function setEditMode(mode) {
        if (mode) {
            // enable controls
            if (SU_mode) {
                $("#txtName").prop('disabled', false);
                $("#txtName").removeClass('disabledFormTextBox');
                $("#txtName").addClass('formTextBox');
            }
            else {

                $("#txtName").prop('disabled', false);
                $("#txtName").removeClass('disabledFormTextBox');
                $("#txtName").addClass('formTextBox');
            }

            $("#txtContactName").prop('disabled', false);
            $("#txtContactName").removeClass('disabledFormTextBox');
            $("#txtContactName").addClass('formTextBox');

            $("#txtContactAlias").prop('disabled', false);
            $("#txtContactAlias").removeClass('disabledFormTextBox');
            $("#txtContactAlias").addClass('formTextBox');

            $("#txtDomainName").prop('disabled', false);
            $("#txtDomainName").removeClass('disabledFormTextBox');
            $("#txtDomainName").addClass('formTextBox');

            $("#orgFlag").prop('disabled', false);
            $("#projectFlag").prop('disabled', false);
            $("#activeFlag").prop('disabled', false);

            $("#btnSave").prop('disabled', false);
            $("#btnUpdate").prop('disabled', false);
        }
        else {
            // Disable controls
            $("#txtName").prop('disabled', true);
            $("#txtName").removeClass('formTextBox');
            $("#txtName").addClass('disabledFormTextBox');

            $("#txtContactName").prop('disabled', true);
            $("#txtContactName").removeClass('formTextBox');
            $("#txtContactName").addClass('disabledFormTextBox');

            $("#txtContactAlias").prop('disabled', true);
            $("#txtContactAlias").removeClass('formTextBox');
            $("#txtContactAlias").addClass('disabledFormTextBox');

            $("#txtDomainName").prop('disabled', true);
            $("#txtDomainName").removeClass('formTextBox');
            $("#txtDomainName").addClass('disabledFormTextBox');

            $("#orgFlag").prop('disabled', true);
            $("#projectFlag").prop('disabled', true);
            $("#activeFlag").prop('disabled', true);

            $("#btnSave").prop('disabled', true);
            $("#btnUpdate").prop('disabled', true);

        }
    }

    /// Declare a function to process the company select event
    function companySelectHandler(event)
    {
        var companyID;
        // Declare a local variable to store the ID of the current company
        companyID = $("#formCompanyList").find('option:selected').val();
        // Update the newCompanyEdit mode based on the companyID
        if (companyID == -1) {
            newCompanyMode = true;
        }
        else {
            newCompanyMode = false;
        }
//        orgID = $("#orgList").find('option:selected').val();
        localCompany = getCurrentCompany(companyID);
        // Set the current company
        setCompany(companyID);
    }

    // Declare an event handler to process the new company event
    function saveCompanyHandler() {
        var company = new Company();

        company.Name = $("#txtName").val();
        company.ContactName = $("#txtContactName").val();
        company.ContactAlias = $("#txtContactAlias").val();
        company.DomainName = $("#txtDomainName").val();
        company.OrganizationRestricted = $("#orgFlag").prop('checked');
        company.ProjectRestricted = $("#projectFlag").prop('checked');
        company.isActive = $("#activeFlag").prop('checked');

        saveCompany(company);
        
        }

    // Declare a function to save the current company record
    function saveCompany(company) {

        // update the target URL
        var targetUrl = CompanyUrl;

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // Update the stored data
        $.ajax({
            url: targetUrl,
            type: 'POST',
            dataType: 'json',
            data: company,
            headers: headers,
            success: function (data, txtStatus, xhr) {
                var promise;
//                CreateNewUserRole(company.Name + "_Admin",pmmodaErrorHandler);
                clearCompanyDetails();
                clearCompanies();
                loadData();
                setEditMode(false);
            },
            error: function (xhr, textStatus, errorThrown) {
                pmmodaErrorHandler(xhr, 101);
            }
        });
    }


    // Declare an event handler to process the update company event
    function updateCompanyHandler() {
        var company = new Company();

        company.CompanyID = localCompany.CompanyID;
        company.Name = $("#txtName").val();
        company.ContactName = $("#txtContactName").val();
        company.ContactAlias = $("#txtContactAlias").val();
        company.DomainName = $("#txtDomainName").val();
        company.OrganizationRestricted = $("#orgFlag").prop('checked');
        company.ProjectRestricted = $("#projectFlag").prop('checked');
        company.isActive = $("#activeFlag").prop('checked');

        updateCompany(company);
        // update the current Company if required
        if (localCompany.CompanyID = company.CompanyID) {
            localCompany.Name = company.Name;
            localCompany.ContactName = company.ContactName;
            localCompany.ContactAlias = company.ContactAlias;
            localCompany.DomainName = company.DomainName;
            localCompany.OrganizationRestricted = company.OrganizationRestricted;
            localCompany.ProjectRestricted = company.ProjectRestricted;
            localCompany.isActive = company.isActive;
        }

    }

    // Declare a function to update the current company record
    function updateCompany(company) {

        // update the target URL
        var targetUrl = CompanyUrl;

        var token = sessionStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // Update the stored data
        $.ajax({
            url: targetUrl,
            type: 'PUT',
            dataType: 'json',
            data: company,
            headers: headers,
            success: function (data, txtStatus, xhr) {
                var token;
                clearCompanyDetails();
                clearCompanies();
                loadData();
                setEditMode(false);
            },
            error: function (xhr, textStatus, errorThrown) {
                response.Status = xhr.status;
                pmmodaErrorHandler(response, 102);
//                pmmodaErrorHandler("Error Saving new Company: " + xhr.Response.text);
            }
        });
    }


    /// declare a method to set the form the the correct state for the specific company
    function setCompany(companyID) {
//        var localCompany = new Company();

        // Check the ID value and process appropriately
        if(companyID == 0){
            // Process the blank company selection
            clearCompanyDetails();
            setEditMode(false);
            $("#btnSave").show();
            $("#btnUpdate").hide();
        }
        else if(companyID > 0)
        {
            // process the valid current company
            clearCompanyDetails();
            if (localCompany != undefined) {
                setCompanyDetails(localCompany);
                setEditMode(true);
                $("#btnSave").hide();
                $("#btnUpdate").show();
            }
            else{
                alert("An invalid Company record was detected at Company ID = " + companyID);
            }
        }
        else{
            // process the "Add New Company" option
            clearCompanyDetails();
            setEditMode(true);
            $("#btnSave").show();
            $("#btnUpdate").hide();
        }

    }

    // Declare a function to set the form controls to the current company record
    function setCompanyDetails(company){
        $("#txtName").val(company.Name);
        $("#txtContactName").val(company.ContactName);
        $("#txtContactAlias").val(company.ContactAlias);
        $("#txtDomainName").val(company.DomainName);
        $("#orgFlag").prop('checked',company.OrganizationRestricted);
        $("#projectFlag").prop('checked', company.ProjectRestricted);
        $("#activeFlag").prop('checked', company.isActive);
    }

    // Declare a function to clear the current company controls
    function clearCompanyDetails(){

        $("#txtName").val("");
        $("#txtContactName").val("");
        $("#txtContactAlias").val("");
        $("#txtDomainName").val("");
        $("#orgFlag").prop('checked', false);
        $("#projectFlag").prop('checked', false);
        $("#activeFlag").prop('checked', false);
    }

    // Declare a funtion to clear the current Company list
    function clearCompanies() {
        Companies.length = 0;
        $("#formComapnyList").empty();
    }

    function getCurrentCompany(ID) {
        var selectedCompany = new Company();
        var index = 0;

            while (index < Companies.length) {
                if (ID == Companies[index].CompanyID) {
                    selectedCompany = Companies[index];
                    break;
                }
                index++;
            }
        return (selectedCompany);
    }

    /// Declare an event handler to process the close button
    function closeCompanyFormHandler() {
        closeCompanyForm();
    }

    function closeCompanyForm() {
        // execute the callback to cleanup the main page state
        updateMasterForm();
        $("#form").remove();

    }

}