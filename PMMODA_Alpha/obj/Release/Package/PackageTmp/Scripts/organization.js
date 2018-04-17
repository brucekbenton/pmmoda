

var Organization = function () {
    // Declre an object to store the organization ID
    this.Id;
    // Declare an object to store the friendly name
    this.Name;
    // Declare an object to store the description
    this.Description;
    // Declre an object to store the work day duration represented in hours
    this.WorkDay;
    this.isActive;
    this.Assumption;
    this.Roles = new Array();
    this.Url = "api/Organization";
    this.NaturalUnits = [];
    this.Dimensions = [];



}