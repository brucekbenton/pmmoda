

var Deliverable = function () {
    this.ID;
    this.ParentID;
    this.ProjectID;
    this.WorkstreamID;
    this.Name;
    this.Description;
    this.hasChildren;
    this.CrossReference;
    this.Parent;
    this.UserID;
    this.ScopeModel = [];
    this.Effort;
    this.EffortRemaining;
    this.Cost;
    this.CostRemaining;
    // Declare an array to contain the children of this node
    this.Children = [];
    // Declare a variable to repreent the isActive flag on the Delvierable object
    this.isActive;
    this.modelActive;
    // Declare a class variable to indicate that this deliverable is a project total and should not be treated
    // as a normal deliverable
    this.Total;
}

