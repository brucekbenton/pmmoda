"use strict"

// Declare an object to represent the producivity model for a specific dimension. In 
// application this will only have meaning in the context of a specific Natural Unit
function DimensionModel() {
    // The dimension ID for the current record
    this.ID;
    // The activity name of the current activity dimension
    this.Name;
    // Store the component name for the current dimension
    this.ComponentName;
    // Store the ID of the corresponding MasterRole for this dimensino
    this.MasterRoleID;
    // Store the RoleID
    this.RoleID;
    // Store the bill rate for the current role
    this.BillRate;
    // The effort matrix for the current dimension
    this.Effort = [];

}