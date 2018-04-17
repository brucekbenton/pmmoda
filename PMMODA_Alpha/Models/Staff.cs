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
    public class Staff
    {
        public int ProjectID { get; set; }
        public int MasterRoleID { get; set; }
        public String RoleName { get; set; }

        public double Count { get; set; }

        public Boolean isActive { get; set; }

        public int UserID { get; set; }


        public static List<Staff> LoadStaff(int ProjectID)
        {
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
            // Declare a local object to store the staff collection to be returned
            List<Staff> results;
            Staff dataSet;

            results = new List<Staff>();

            try
            {
                // Establish a new connection. 
                using (connection = new SqlConnection(Authentication.ConnectionString))
                {
                    connection.Open();

                    // Construct the query to get the current sprint data
                    cmdString = "EXEC StaffingListGet " + ProjectID;

                    command = new SqlCommand(cmdString, connection);

                    reader = null;

                    reader = command.ExecuteReader();
                    int recordCount = 0;
                    while (reader.Read())
                    {
                        dataSet = new Staff();
                        dataSet.ProjectID = Convert.ToInt32(reader[recordCount++].ToString());
                        dataSet.MasterRoleID = Convert.ToInt32(reader[recordCount++].ToString());
                        Double count = 0;
                        Double.TryParse(reader[recordCount++].ToString(), out count);
                        dataSet.Count = count;
                        dataSet.RoleName = reader[recordCount++].ToString();
                        results.Add(dataSet);
                        recordCount = 0;
                    }
                    reader.Close();

                    // Construct the logging string and insert the log record for this transaction
                    // TBD - NEed to fix the hardcoded user id
                    logStr = "EXEC CommandLogInsert StaffModel" + "," + -1 + "," + 1 + ",\"" + cmdString + "\",0";
                    command = new SqlCommand(logStr, connection);
                    command.ExecuteScalar();

                    connection.Close();
                }
            }

            catch (Exception e)
            {

            }

            return (results);
        }


        public static int Update(Staff item)
        {
            String connectionString;
            // Declare a local variable for the SQL Connection object
            SqlConnection connection;
            // Declare a local variable for the SQL Command object
            SqlCommand command;
            // Declare a local variable to store the DB command string
            String cmdString;
            // Declare a local variable to store the string for the logging call to the DB
//            String logStr;

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


                    //            using(connection = Authentication.Connect(false)){

                    // Construct the command string 
                    cmdString = "EXEC StaffingUpdate " + item.ProjectID + "," + item.MasterRoleID + "," + item.Count + "," + item.isActive + "," + item.UserID;

                    command = new SqlCommand(cmdString, connection);

                    command.ExecuteScalar();



                    //                Int32.TryParse(key.ToString(), out ID);
                    //            this.ID = ID;
                    //                key = command.ExecuteScalar();

                    //               Int32.TryParse(key.ToString(), out ID);
                    //            this.ID = ID;
                    connection.Close();
                }
            }

            catch (Exception e)
            {

            }

            return (ID);

        }

    }
}