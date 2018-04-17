using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PMMODA_Alpha.Models
{

        public struct RoleUtilization
        {
            public String Name;
            public double Utilization;
        }

        // Declare a structure to represent the effort associated with a specific role    
        public class RoleEffortModel
        {
            public int MasterRoleID;
            public String Name;
            public double effort;
            public double cost;
            public double Duration;
            public double Utilization;
        }

        // Declare a structure to represent the effort associated with a specific activity (previously Dimension)    
        public class ActivityEffortModel
        {
            public int ActivityID;
            public String ActivityName;
            public int MasterRoleID;
            public String RoleName;
            public double effort;
            public double cost;
        }


        // Declre a structure to represent the effort associated with a specific role    
        public class UnitEffortModel
        {
            public int NaturalUnitID;
            public String Name;
            public double effort;
            public double cost;
        }


    public class ProjectSummary
    {
        public double Duration;
        public Double TotalEffort;
        public Double EffortRemaining;
        public Double TotalCost;
        public Double CostRemaining;
        public List<RoleEffortModel> Utilization;
        public List<UnitEffortModel> UnitUtilization;
        public List<ActivityEffortModel> ActivitySummary;

       


        /// <summary>
        ///  Load summary details of the current project including total effort, remaining effort,
        ///  effort by role category and effort by natural Unit
        /// </summary>
        /// <param name="ID"></param>
        /// <param name="OrgID"></param>
        /// <returns></returns>
        public static ProjectSummary LoadSummary(int ID, int OrgID)
        {
            ProjectSummary results;
            // Declare a local obejct to store the Deliverable data
            List<Deliverable> deliverableData;
            // Declare a local object to store the Activity data (dimension)
            List<Dimension> activityData;
            // Declare a local object to store the organization productivity model
            List<ProductivityModel> productivityModel;
            // Declare a prodcutivity model to hold the productivity data for just the current unit
            List<ProductivityModel> currentProductivityModel;
            // Declare a local object to store the total effort
            Double totalEffort = 0;
            // Declare a local object to store the remaining effort after percent complete is accounted for
            Double effortRemaining = 0;
            // Declare a local object to store the total Cost
            Double totalCost = 0;
            // Declare a local object to store the remaining cost after percent complete is accounted for
            Double costRemaining = 0;
            // Declare a local variable to store the unit and dimension specific effort calculated 
            // for teh current record
            Double effort;
            // Declare a local variable to store the unit and dimension specific cost calculated 
            // for teh current record
            Double cost;
            // Declare a collection to store the Utilization data for the output
            List<RoleEffortModel> roleBasedEffort;
            // Declrae a colletion to store the unit based summary data
            List<UnitEffortModel> unitBasedEffort;
            // Declrae a colletion to store the activity based summary data
            List<ActivityEffortModel> activityBasedEffort;
            // Declare a local collection to store the staff information
            List<Staff> staff;
            // Declare a local object to store the MasterRole collection. This will be used to retrieve role names
//            List<MasterRole> masterRoles;
            // Declare a local collection to store the ACtive Role information
            List<Role> activeRoles;
            // Declare a local object to store the work dy duration for the current organization
            Double WorkDayDuration;

            // Instantiate the results data structure
            results = new ProjectSummary();
            results.Utilization = new List<RoleEffortModel>();
            results.UnitUtilization = new List<UnitEffortModel>();
            results.ActivitySummary = new List<ActivityEffortModel>();
            // Instantiate the role based effort model collection
            roleBasedEffort = new List<RoleEffortModel>();
            unitBasedEffort = new List<UnitEffortModel>();
            activityBasedEffort = new List<ActivityEffortModel>();
            // Instantiate the staff collection
            staff = new List<Staff>();
            // Instantiate the active Role array
            activeRoles = new List<Role>();

            // Load the Deliverable data
            deliverableData = new List<Deliverable>();
            deliverableData = Deliverable.LoadList(ID);

            // Load the productivity data
            productivityModel = new List<ProductivityModel>();
            productivityModel = ProductivityModel.LoadList(OrgID);


            // Load the active role data. TBD _ The UserID value is not used and needs to be removed from the procedure
            activeRoles = Role.LoadActiveRoles(OrgID);

            // Create a working list of Natural Units for the current org. These will be used to populate the 
            // UnitUtilizationList
            List<NaturalUnit> units = NaturalUnit.LoadList(productivityModel[0].OrganizationID);

            foreach (NaturalUnit unit in units)
            {
                UnitEffortModel unitModel = new UnitEffortModel();
                unitModel.NaturalUnitID = unit.ID;
                unitModel.Name = unit.Name;
                unitBasedEffort.Add(unitModel);
            }

            // Initialized the Activity Based Effort collection with an entry for each applicable activity for the current org
            activityData = new List<Dimension>();
            activityData = Dimension.LoadList(productivityModel[0].OrganizationID);
            // loop over the active dimensions
//            foreach(Dimension activity in activityData){
//                ActivityEffortModel activityModel = new ActivityEffortModel();
//                activityModel.ActivityID = activity.ID;
//                activityModel.ActivityName = activity.Name;
//                activityBasedEffort.Add(activityModel);
//            }

            // Calculate the effort and role based effort

            // Loop over the Deliverables
            int delIndex = 0;
            // Declare a counter to track the current Natural Unit
            int currentUnit=0;
            // Declare a counter to track the current role index
            int roleIndex;
            // Declare a count to track the current Natural Unit index
            int unitIndex;
            // Declare a variable to track the current activity index
            int activityIndex;
            // Instantiate a collection to store the filtered productivity model
            currentProductivityModel = new List<ProductivityModel>();

            // Loop over the current deliverable set
            while (delIndex < deliverableData.Count)
            {
                if(deliverableData[delIndex].modelActive)
                {
                // Get the subset of productivity data for the current Unit
                // Check to see if the current Natural unit has changed
                if (deliverableData[delIndex].NaturalUnitID != currentUnit)
                {
                    // Empty the current filtered set
                    currentProductivityModel.Clear();
                    // Instantiate the filtered productivity model
                    currentUnit = deliverableData[delIndex].NaturalUnitID;

                    // Loop over the Productivity model and select the required subset
                    foreach (ProductivityModel model in productivityModel)
                    {
                        if (model.UnitID == currentUnit)
                        {
                            currentProductivityModel.Add(model);
                        }
                    }
                }
                // Loop over the filtered productivity model
                foreach (ProductivityModel model in currentProductivityModel)
                //                    foreach (ProductivityModel model in currentProductivityModel)
                {
                    // MAke sure the current productivity model entry is a valid NaturalUnit
                    if (model.UnitID == deliverableData[delIndex].NaturalUnitID)
                    {
                        effort = 0;
                        // Calculate the effort for the current dimension
                        effort = model.LoNominalEffort * deliverableData[delIndex].LowCount +
                                    model.MedNominalEffort * deliverableData[delIndex].MedCount +
                                    model.HiNominalEffort * deliverableData[delIndex].HighCount;
                        // Multiply the calucated effort by the iteratino count
                        effort = effort * deliverableData[delIndex].IterationCount;
                        cost = effort * model.BillRate;
                        // Update the total effort
                        totalEffort += effort;
                        // update the total cost
                        totalCost += cost;
                        // calculate the remaining effort
                        effortRemaining += effort * (1- (deliverableData[delIndex].PercentComplete/100));
                        // calculate the costRemaining cost
                        costRemaining += effort * (1 - (deliverableData[delIndex].PercentComplete / 100)) * model.BillRate;
                        // Check to see if the effort is 0, in which case you do not want to add a record
                        if (effort * (1 - (deliverableData[delIndex].PercentComplete / 100)) > 0)
                        {
                            // Update the activiyt specific data
                            activityIndex = getActivityIndex(model.DimensionID, activityBasedEffort);
                            if (activityIndex < 0)
                            {
                                ActivityEffortModel activityModel = new ActivityEffortModel();
                                activityModel.ActivityID = model.DimensionID;
                                activityModel.ActivityName = model.DimensionName;
                                activityBasedEffort.Add(activityModel);
                                // update the activity index
                                activityIndex = activityBasedEffort.Count - 1;
                            }
                            // Update the Master Role ID
                            activityBasedEffort[activityIndex].MasterRoleID = model.MasterRoleID;
                            // update the remaining effort for this activity
                            activityBasedEffort[activityIndex].effort += effort * (1 - (deliverableData[delIndex].PercentComplete / 100));
                            // update the current role name for display convenience
                            activityBasedEffort[activityIndex].RoleName = model.DimensionName;
                            // update the remaining cost for this actiivty
                            activityBasedEffort[activityIndex].cost += effort * (1 - (deliverableData[delIndex].PercentComplete / 100)) * model.BillRate;
                        }
                        // Update the role specific effort also
                        // Get the collection index for the current role
                        roleIndex = -1;
                        roleIndex = getCollectionIndex(model.MasterRoleID, roleBasedEffort);
                        // Get the Naturalnit index for the current record
                        unitIndex = -1;
                        unitIndex = getUnitCollectionIndex(model.UnitID, unitBasedEffort);
                        if (roleIndex >= 0)
                        {
                            // increment the current effort value if a record was found
                            roleBasedEffort[roleIndex].effort += (effort * (1- (deliverableData[delIndex].PercentComplete / 100)));
                            roleBasedEffort[roleIndex].cost += (effort * (1 - (deliverableData[delIndex].PercentComplete / 100)))*model.BillRate;
                        }
                        else
                        {
                            // Insert a new record value if not record was found
                            RoleEffortModel newEffort = new RoleEffortModel();
                            newEffort.Name = getRoleName(model.MasterRoleID, activeRoles);
                            newEffort.MasterRoleID = model.MasterRoleID;
                            newEffort.effort = effort * (1 - (deliverableData[delIndex].PercentComplete / 100));
                            newEffort.cost = newEffort.effort*model.BillRate;
                            roleBasedEffort.Add(newEffort);
                        }
                        // Get the Naturalnit index for the current record
                        unitIndex = -1;
                        unitIndex = getUnitCollectionIndex(model.UnitID, unitBasedEffort);
                        if (unitIndex >= 0)
                        {
                            unitBasedEffort[unitIndex].effort += (effort * (1 - (deliverableData[delIndex].PercentComplete / 100)));
                            unitBasedEffort[unitIndex].cost += (effort * (1 - (deliverableData[delIndex].PercentComplete / 100)))*model.BillRate;
                        }
                        else
                        {
                            UnitEffortModel newUnitEffort = new UnitEffortModel();
                            newUnitEffort.Name = deliverableData[delIndex].Name;
                            newUnitEffort.NaturalUnitID = deliverableData[delIndex].NaturalUnitID;
                            newUnitEffort.effort = (effort * (1 - (deliverableData[delIndex].PercentComplete / 100)));
                            newUnitEffort.cost = (effort * (1 - (deliverableData[delIndex].PercentComplete / 100)))*model.BillRate;
                            unitBasedEffort.Add(newUnitEffort);
                        }

                    }
                }
            }
                delIndex++;
            }

            results.TotalEffort = totalEffort;
            results.EffortRemaining = effortRemaining;
            results.TotalCost = totalCost;
            results.CostRemaining = costRemaining;

            // Get the current project staff
            staff = Staff.LoadStaff(ID);

            // Calculate roject duration and utilization rates
            // Loop over roles
            Double duration;
            Double maxDuration = 0;
            int criticalRole = 0;
            Double roleStaff;
            roleIndex = 0;
            // Declare a local variable to store the overhead factor for the current role
            Double overhead;
            foreach (RoleEffortModel model in roleBasedEffort)
            {
                // Get the staff value for the current role
                roleStaff = getStaffingByRole(model.MasterRoleID, staff);
                overhead = getRoleOverhead(model.MasterRoleID,activeRoles);
                if (roleStaff > 0)
                {
                    duration = model.effort / ((roleStaff * activeRoles[0].WorkDay)*(1-overhead));
                    // update the max duration and critical role
                    if (duration > maxDuration)
                    {
                        maxDuration = duration;
                        criticalRole = model.MasterRoleID;
                    }
                    model.Duration = duration;

                }
            }

            // Update the role based data based on the identified critical role
            foreach (RoleEffortModel model in roleBasedEffort)
            {
                // Check to see if this is the critical role
                if (model.MasterRoleID == criticalRole)
                {
                    model.Utilization = 1;
                }
                else
                {
                    model.Utilization = model.Duration / maxDuration;
//                    model.Duration = maxDuration;
                }
                results.Utilization.Add(model);
            }
            // Move the unit based effort into the public data store
            foreach (UnitEffortModel model in unitBasedEffort)
            {
                results.UnitUtilization.Add(model);
            }

            // Add the Activity summary data to the public data store
            foreach (ActivityEffortModel model in activityBasedEffort)
            {
                results.ActivitySummary.Add(model);
            }

            results.Duration = maxDuration;
            return (results);
        }

        public static ProjectSummary ExportSummary(int ID, int OrgID)
        {
            ProjectSummary results;
            // Declare an internal object to 
            // Declare a local obejct to store the Deliverable data
            List<Deliverable> deliverableData;
            // Declare a local object to store the organization productivity model
            List<ProductivityModel> productivityModel;

            // Load the Deliverable data
            deliverableData = new List<Deliverable>();
            deliverableData = Deliverable.LoadList(ID);

            // Load the productivity data
            productivityModel = new List<ProductivityModel>();
            productivityModel = ProductivityModel.LoadList(OrgID);

            // Loop over


            results = new ProjectSummary();

            return (results);
        }

        private static Double getRoleOverhead(int ID, List<Role> collection)
        {
            int index = 0;
            Double value = 0;

            foreach (Role role in collection)
            {
                if (ID == role.MasterRoleID)
                {
                    value = role.Overhead;
                    break;
                }
            }

            return (value);
        }

        /// Identify the Role name corresponding to the Master Role ID
        /// 
        private static String getRoleName(int ID, List<Role> collection)
        {
            String selectedName="";

            foreach (Role role in collection)
            {
                if (ID == role.MasterRoleID)
                {
                    selectedName = role.Name;
                    break;
                }
            }
            return (selectedName);
        }


        /// <summary>
        ///  Identify the role specific staffing level from the supplied collection
        /// </summary>
        /// <param name="ID"></param>
        /// <param name="collection"></param>
        /// <returns></returns>
        private static Double getStaffingByRole(int ID, List<Staff> collection)
        {
            Double staff=0;

            // Loop over the collection
            foreach (Staff model in collection)
            {
                if (ID == model.MasterRoleID)
                {
                    staff = model.Count;
                    break;
                }
            }

            return (staff);
        }
        
    private static int getCollectionIndex(int ID, List<RoleEffortModel> collection){
        int selectedIndex = -1;

        // Find the index in teh role effort collection matching the passed in value
        int index = 0;
        foreach(RoleEffortModel model in collection){
            if (model.MasterRoleID == ID)
            {
                selectedIndex = index;
                break;
            }
            index++;
        }

        return (selectedIndex);
        }


    // Declare a function to return the ActivityBasedEffort index for the specified activity ID
        private static int getActivityIndex(int ID, List<ActivityEffortModel> collection)
    {
        int selectedIndex = -1;

        // Find the index in teh role effort collection matching the passed in value
        int index = 0;
        foreach (ActivityEffortModel activity in collection)
        {
            if (activity.ActivityID == ID)
            {
                selectedIndex = index;
                break;
            }
            index++;
        }

        return (selectedIndex);
    }

    private static int getUnitCollectionIndex(int ID, List<UnitEffortModel> collection)
    {
        int selectedIndex = -1;

        // Find the index in teh role effort collection matching the passed in value
        int index = 0;
        foreach (UnitEffortModel model in collection)
        {
            if (model.NaturalUnitID == ID)
            {
                selectedIndex = index;
                break;
            }
            index++;
        }

        return (selectedIndex);
    }

    }
}