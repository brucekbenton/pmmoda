using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
// Included for Sql interactions
using System.Data.SqlClient;
//using PMMODA_utils;
// Included to support Configuration Manager operations
using System.Configuration;

namespace PMMODA_Alpha.Models
{
    public class Role
    {
        // The surogate primary key for the current Role record
        public int ID { get; set; }
        // A foreign key into the MasterRole table
        public int MasterRoleID { get; set; }
        // The friendly name for the current Role
        public string Name { get; set; }
        // Description of the current role
        public string Description { get; set; }
        // Estimated overhead derating for the current role. Utilization equals 1 minus this number
        public Double Overhead { get; set; }
        // The number of hours in a standard workday for this role
        public Double WorkDay { get; set; }
        // This field is included for logging purposes and does not logically belong to the Role entity
        public int UserID { get; set; }
        // Indicates whether the current role is active on the project team
        public Boolean isActive { get; set; }
        // The foreign key to the Organization (Project Team) associated wiht this role
        public int OrganizationID { get; set; }
        // The hourly bill rate in dollars for teh current role.
        public Double BillRate { get; set; }

        /// <summary>
        /// Returns the set of roles defined for the current ORganization. This includes active and
        /// inactive roles.
        /// </summary>
        /// <param name="ID"></param>
        /// <returns></returns>
        public static List<Role> LoadList(int ID)
        {
            // Declare a local variable to hold the task collection
            List<Role> values;
            // Declare a local variable for the SQL Connection object
            SqlConnection connection;
            // Declare a local variable for the SQL Command object
            SqlCommand command;
            // Declare a local variable for the SQL data reader object
            SqlDataReader reader = null;
            // Declare a local variable to store the DB command string
            String cmdString;
            // Declare a local variable to store the string for the logging call to the DB
            String logStr;
            // Declare a local object to store the new Task 
            Role newValue;

            // intialize the current collection
            values = new List<Role>();


            try
            {
                // Establish a new connection. 
                using (connection = new SqlConnection(Authentication.ConnectionString))
                {
                    connection.Open();

                    // construct the command string
                    cmdString = "EXEC RoleListGet " + ID.ToString();

                    //            ApplicationLog.WriteLogEntry("Deliverable Service", "Command String", cmdString, ApplicationLog.LogType.Error);

                    command = new SqlCommand(cmdString, connection);
                    reader = command.ExecuteReader();

                    int recordCount = 0;
                    while (reader.Read())
                    {
                        newValue = new Role();
                        newValue.ID = Convert.ToInt32(reader[recordCount++].ToString());
                        newValue.MasterRoleID = Convert.ToInt32(reader[recordCount++].ToString());
                        newValue.Name = reader[recordCount++].ToString();
                        newValue.Description = reader[recordCount++].ToString();
                        Double overhead = 0;
                        Double.TryParse(reader[recordCount++].ToString(), out overhead);
                        newValue.Overhead = overhead;
                        newValue.isActive = Convert.ToBoolean(reader[recordCount++]);
                        // Initialize the OrganizatinoID
                        newValue.OrganizationID = ID;

                        values.Add(newValue);

                        recordCount = 0;
                    }
                    reader.Close();

                    logStr = "EXEC CommandLogInsert Role" + "," + ID + "," + -1 + ",\"" + cmdString + "\",0";
                    command = new SqlCommand(logStr, connection);
                    command.ExecuteScalar();


                    connection.Close();
                }

            }

            catch (Exception e)
            {

            }

            return (values);
        }

        /// <summary>
        /// Load the set of current active roles for the specified Project - TBD: This should be modified to take OrgID since this entity is not dependent on project
        /// </summary>
        /// <param name="ProjectID"></param>
        /// <returns></returns>
        public static List<Role> LoadActiveRoles(int OrganizationID)
        {
            // Declare a local variable to hold the task collection
            List<Role> values;
            // Declare a local variable for the SQL Connection object
            SqlConnection connection;
            // Declare a local variable for the SQL Command object
            SqlCommand command;
            // Declare a local variable for the SQL data reader object
            SqlDataReader reader = null;
            // Declare a local variable to store the DB command string
            String cmdString;
            // Declare a local variable to store the string for the logging call to the DB
            String logStr;
            // Declare a local object to store the new Task 
            Role newValue;

            // intialize the current collection
            values = new List<Role>();

            try
            {
                // Establish a new connection. 
                using (connection = new SqlConnection(Authentication.ConnectionString))
                {
                    connection.Open();

                    // construct the command string
                    cmdString = "EXEC RoleActiveListGet " + OrganizationID.ToString();

                    //            ApplicationLog.WriteLogEntry("Deliverable Service", "Command String", cmdString, ApplicationLog.LogType.Error);

                    command = new SqlCommand(cmdString, connection);
                    reader = command.ExecuteReader();

                    int recordCount = 0;
                    while (reader.Read())
                    {
                        newValue = new Role();
                        newValue.ID = Convert.ToInt32(reader[recordCount++].ToString());
                        newValue.MasterRoleID = Convert.ToInt32(reader[recordCount++].ToString());
                        newValue.Name = reader[recordCount++].ToString();
                        Double overhead = 0;
                        Double.TryParse(reader[recordCount++].ToString(), out overhead);
                        newValue.Overhead = overhead;
                        Double workDay = 0;
                        Double.TryParse(reader[recordCount++].ToString(), out workDay);
                        newValue.WorkDay = workDay;
                        Double billRate = 0;
                        Double.TryParse(reader[recordCount++].ToString(), out billRate);
                        newValue.BillRate = billRate;
                        // Initialize the isActive flag
                        newValue.isActive = true;
                        // Initialize the OrganizatinoID
                        newValue.OrganizationID = OrganizationID;
                        values.Add(newValue);

                        recordCount = 0;
                    }
                    reader.Close();

                    logStr = "EXEC CommandLogInsert Role" + "," + OrganizationID + "," + -1 + ",\"" + cmdString + "\",0";
                    command = new SqlCommand(logStr, connection);
                    command.ExecuteScalar();


                    connection.Close();
                }
            }

            catch (Exception e)
            {
                String message = e.Message;
            }

            return (values);
        }

       /// <summary>
       /// Update the backing data store for the passed in role
       /// </summary>
       /// <param name="item"></param>
       /// <returns></returns>
        public static int Update(Role item)
        {

//            string connectionString;
            // Declare a local variable for the SQL Connection object
            SqlConnection connection;
            // Declare a local variable for the SQL Command object
            SqlCommand command;
            // Declare a local variable for the SQL data reader object
            SqlDataReader reader = null;
            // Declare a local variable to store the DB command string
            String cmdString;
            // Declare a local variable to store the string for the logging call to the DB
            String logStr;
            object key;
            int ID = 0;



            // Get the connection string from the Configuration Manager
//            connectionString = ConfigurationManager.ConnectionStrings["AzureConnection"].ConnectionString;
            try
            {
                // Establish a new connection. 
                using (connection = new SqlConnection(Authentication.ConnectionString))
                {
                    // Open the new connection
                    connection.Open();



                    // Consruct the insert command
                    cmdString = "EXEC RoleUpdate " + item.ID + "," + item.OrganizationID.ToString() + "," + item.MasterRoleID + ","
                        + item.Overhead + "," + item.isActive + "," + item.UserID.ToString() + "," + item.BillRate;

                    //            ApplicationLog.WriteLogEntry("Role Service", "Command String", cmdString, ApplicationLog.LogType.Error);

                    command = new SqlCommand(cmdString, connection);
                    key = command.ExecuteScalar();

                    logStr = "EXEC CommandLogInsert Role" + "," + item.OrganizationID + "," + item.UserID + ",\"" + cmdString + "\",0";
                    command = new SqlCommand(logStr, connection);
                    command.ExecuteScalar();

                    connection.Close();


                    if (key != null)
                    {

                        Int32.TryParse(key.ToString(), out ID);
                    }
                }
            }

            catch (Exception e)
            {
                String message = e.Message;

            }
        
            return (ID);
        }

    
    }
}