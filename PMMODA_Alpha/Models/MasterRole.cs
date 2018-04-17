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
    public class MasterRole
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public int CompanyID { get; set; }
        public string Description { get; set; }
        public int isActive { get; set; }
        public int UserID { get; set; }

        public static List<MasterRole> LoadList()
        {
            // Declare a local variable to hold the task collection
            List<MasterRole> values;
            string connectionString;

            SqlConnection connection;
            SqlCommand command;
            //            SqlDataReader reader;
            String cmdString;
            SqlDataReader reader;
            // Declare a local object to store the new Task 
            MasterRole newValue;

            // intialize the current collection
            values = new List<MasterRole>();


            // Get the connection string from the Configuration Manager
//            connectionString = ConfigurationManager.ConnectionStrings["AzureConnection"].ConnectionString;

            try
            {
                // Establish a new connection. 
                using (connection = new SqlConnection(Authentication.ConnectionString))
                {
                    // Open the new connection
                    connection.Open();



                    // construct the command string
                    cmdString = "EXEC MAsterRoleListGet ";

                    //            ApplicationLog.WriteLogEntry("Deliverable Service", "Command String", cmdString, ApplicationLog.LogType.Error);

                    command = new SqlCommand(cmdString, connection);
                    reader = command.ExecuteReader();

                    int recordCount = 0;
                    while (reader.Read())
                    {
                        newValue = new MasterRole();
                        newValue.ID = Convert.ToInt32(reader[recordCount++].ToString());
                        newValue.Name = reader[recordCount++].ToString();
                        newValue.Description = reader[recordCount++].ToString();

                        values.Add(newValue);

                        recordCount = 0;
                    }
                    reader.Close();

                    connection.Close();
                }
            }

            catch (Exception e)
            {

            }

            return (values);
        }

        public static List<MasterRole> LoadByCompany(int CompanyID)
        {
            // Declare a local variable to hold the task collection
            List<MasterRole> values;
//            string connectionString;

            SqlConnection connection;
            SqlCommand command;
            //            SqlDataReader reader;
            String cmdString;
            SqlDataReader reader;
            // Declare a local object to store the new Task 
            MasterRole newValue;

            // intialize the current collection
            values = new List<MasterRole>();


            // Get the connection string from the Configuration Manager
            //            connectionString = ConfigurationManager.ConnectionStrings["AzureConnection"].ConnectionString;

            try
            {
                // Establish a new connection. 
                using (connection = new SqlConnection(Authentication.ConnectionString))
                {
                    // Open the new connection
                    connection.Open();

                    // construct the command string
                    cmdString = "EXEC MasterRoleListByCompanyGet " + CompanyID;

                    command = new SqlCommand(cmdString, connection);
                    reader = command.ExecuteReader();

                    int recordCount = 0;
                    while (reader.Read())
                    {
                        newValue = new MasterRole();
                        newValue.ID = Convert.ToInt32(reader[recordCount++].ToString());
                        newValue.Name = reader[recordCount++].ToString();
                        newValue.Description = reader[recordCount++].ToString();

                        values.Add(newValue);

                        recordCount = 0;
                    }
                    reader.Close();

                    connection.Close();
                }
            }

            catch (Exception e)
            {

            }

            return (values);
        }

        public static int Save(int CompanyID, String username, MasterRole item)
        {
            // Declare a local variable for the SQL Connection object
            SqlConnection connection;
            // Declare a local variable for the SQL Command object
            SqlCommand command;
            // Declare a local variable to store the DB command string
            String cmdString;
            // Declare a local variable to store the string for the logging call to the DB
            String logStr;

            object key;
            int ID = 0;

            try
            {
                // Establish a new connection. 
                using (connection = new SqlConnection(Authentication.ConnectionString))
                {
                    connection.Open();

                    // Strip any illegal characters out of the input strings
                    item.Name = Utility.CleanInput(item.Name);
                    item.Description = Utility.CleanInput(item.Description);

                    // Consruct the insert command
                    cmdString = "EXEC MasterRoleInsert '" + item.Name.ToString() + "'," + CompanyID;
                    if (item.Description != null)
                    {
                        cmdString = cmdString + ",'" + item.Description.ToString() + "'";
                    }
                    else
                    {
                        cmdString += ",''";
                    }
                    cmdString = cmdString + "," + item.isActive + ",'" + username.ToString() + "'";

                    command = new SqlCommand(cmdString, connection);
                    key = command.ExecuteScalar();
                    Int32.TryParse(key.ToString(), out ID);


                    logStr = "EXEC CommandLogInsert Organization" + "," + item.ID + "," + item.UserID + ",\"" + cmdString + "\",0";
                    command = new SqlCommand(logStr, connection);
                    command.ExecuteScalar();


                    connection.Close();
                }
            }
            catch (Exception e)
            {
            }

            // ADd the initial default roles for the current organization


            // Update the ID value in the data object since this will get returned to the calling  code
            item.ID = ID;
            return (ID);

        }

    }
}
