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
    public class NaturalUnit
    {
        public int ID { get; set; }
        public string Name {get;set;}
        public string Description {get;set;}
        public int UserID { get; set; }
        public int OrganizationID { get; set; }
        public Boolean isActive { get; set; }


        public static List<NaturalUnit> LoadList(int OrgID)
        {
            // Declare a local variable to hold the task collection
            List<NaturalUnit> values;
            string connectionString;

            SqlConnection connection;
            SqlCommand command;
            //            SqlDataReader reader;
            String cmdString;
            SqlDataReader reader;
            // Declare a local object to store the new Task 
            NaturalUnit newValue;

            // intialize the current collection
            values = new List<NaturalUnit>();


            // Get the connection string from the Configuration Manager
//            connectionString = ConfigurationManager.ConnectionStrings["AzureConnection"].ConnectionString;
            // Establish a new connection. Need a separate connection because the connections are single threaded and the service calls can overlap

            try
            {
                // Establish a new connection. 
                using (connection = new SqlConnection(Authentication.ConnectionString))
                {
                    // Open the new connection
                    connection.Open();



                    // construct the command string
                    cmdString = "EXEC NaturalUnitListGetByOrganization " + OrgID;

                    //            ApplicationLog.WriteLogEntry("Natural Unit Service", "Command String", cmdString, ApplicationLog.LogType.Error);


                    command = new SqlCommand(cmdString, connection);
                    reader = command.ExecuteReader();

                    int recordCount = 0;
                    while (reader.Read())
                    {
                        newValue = new NaturalUnit();
                        newValue.ID = Convert.ToInt32(reader[recordCount++].ToString());
                        newValue.Name = reader[recordCount++].ToString();
                        newValue.Description = reader[recordCount++].ToString();
                        newValue.isActive = Convert.ToBoolean(reader[recordCount++]);
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

        public static int Save(NaturalUnit item)
        {

//            string connectionString;
            SqlConnection connection;
            SqlCommand command;
            object key;
            String cmdString;
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

                    // Strip any illegal characters out of the input strings
                    item.Name = Utility.CleanInput(item.Name);
                    item.Description = Utility.CleanInput(item.Description);

                    // Consruct the insert command
                    cmdString = "EXEC NaturalUnitInsert " + item.OrganizationID + ",'" + item.Name.ToString() + "','" + Convert.ToString(item.Description) + "'," + item.UserID.ToString();

                    //            ApplicationLog.WriteLogEntry("NaturalUnit Service", "Command String", cmdString, ApplicationLog.LogType.Error);


                    command = new SqlCommand(cmdString, connection);
                    key = command.ExecuteScalar();

                    Int32.TryParse(key.ToString(), out ID);

                    connection.Close();
                }
            }

            catch (Exception e)
            {

            }

            item.ID = ID;
            return (ID);
        }

        public static void Update(NaturalUnit item)
        {
            SqlConnection connection;
            SqlCommand command;
            String cmdString;

            try
            {
                // Establish a new connection. 
                using (connection = new SqlConnection(Authentication.ConnectionString))
                {

                    connection.Open();

                    // Strip any illegal characters out of the input strings
                    item.Name = Utility.CleanInput(item.Name);
                    item.Description = Utility.CleanInput(item.Description);

                    // Construct the command string 
                    cmdString = "EXEC NaturalUnitUpdate " + item.ID + ",'" + item.Name + "','" + item.Description + "'," + item.isActive + "," +
                         item.UserID;

                    command = new SqlCommand(cmdString, connection);

                    command.ExecuteNonQuery();

                    connection.Close();
                }
            }

            catch (Exception e)
            {

            }

        }


    }
}