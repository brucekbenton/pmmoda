"use strict"

var CompanyForm = function () {
    this.show = showCompanyForm;
    this.close = closeCompanyForm;
    // declare an object to store the call back method to be called when the form is closed
    var updateMasterForm;
    // Declare a local object to store the current collection of Companies
    var Companies = [];
    // Declare a class variable to store the current company
    var currentCompany;


    /// Declare a function to render the Company Maintenance Form
    function showCompanyForm(mode, callback) {

    }



   /// Declare a function to set the input edit mode for the form
    function setEditMode(mode) {
        if (mode) {
            // enable controls
            $("#txtName").prop('disabled', false);
            $("#txtName").removeClass('disabledFormTextBox');
            $("#txtName").addClass('formTextBox');


            $("#btnSave").prop('disabled', false);
            $("#btnUpdate").prop('disabled', false);
        }
        else {
            // Disable controls
            $("#txtName").prop('disabled', true);
            $("#txtName").removeClass('formTextBox');
            $("#txtName").addClass('disabledFormTextBox');

            $("#btnSave").prop('disabled', true);
            $("#btnUpdate").prop('disabled', true);

        }
    }

    /// Declare a function to process the company select event
    function SelectHandler(event)
    {
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

        // Update the stored data
        $.ajax({
            url: targetUrl,
            type: 'POST',
            dataType: 'json',
            data: company,
            success: function (data, txtStatus, xhr) {
                var token;
                clearCompanyDetails();
                clearCompanies();
                token = loadCompanyData(refreshCompanyComboData);
                setEditMode(false);
            },
            error: function (xhr, textStatus, errorThrown) {
                alert("Error Saving new Company: " +xhr.Response.text);
            }
        });
    }


    // Declare an event handler to process the update company event
    function updateCompanyHandler() {
        var company = new Company();

        company.CompanyID = currentCompany.CompanyID;
        company.Name = $("#txtName").val();
        company.ContactName = $("#txtContactName").val();
        company.ContactAlias = $("#txtContactAlias").val();
        company.DomainName = $("#txtDomainName").val();
        company.OrganizationRestricted = $("#orgFlag").prop('checked');
        company.ProjectRestricted = $("#projectFlag").prop('checked');
        company.isActive = $("#activeFlag").prop('checked');

        updateCompany(company);

    }

    // Declare a function to update the current company record
    function updateCompany(company) {

        // update the target URL
        var targetUrl = CompanyUrl;

        // Update the stored data
        $.ajax({
            url: targetUrl,
            type: 'PUT',
            dataType: 'json',
            data: company,
            success: function (data, txtStatus, xhr) {
                var token;
                clearCompanyDetails();
                clearCompanies();
                token = loadCompanyData(refreshCompanyComboData);
                setEditMode(false);
            },
            error: function (xhr, textStatus, errorThrown) {
                alert("Error Saving new Company: " + xhr.Response.text);
            }
        });
    }


    function setCompany(companyID) {
        var localCompany = new Company();

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
            currentCompany = getCurrentCompany(companyID);
            if(currentCompany != undefined){
                setCompanyDetails(currentCompany);
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