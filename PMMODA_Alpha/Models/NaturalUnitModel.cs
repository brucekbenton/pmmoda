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
    public class NaturalUnitModel
    {
        public int ID { get; set; }
        public int NaturalUnitID { get; set; }
        public int RoleID { get; set; }
        public string Role { get; set; }
        public double LoEffort { get; set; }
        public double MedEffort { get; set; }
        public double HiEffort { get; set; }
        public int UserID { get; set; }

        public static List<UnitDimension> LoadList(int UnitID, int OrgID)
        {
            // Declare a local variable to hold the task collection
            List<UnitDimension> values;
            string connectionString;

            SqlConnection connection;
            SqlCommand command;
            //            SqlDataReader reader;
            String cmdString;
            SqlDataReader reader;
            // Declare a local object to store the new Task 
            UnitDimension newValue;

            // intialize the current collection
            values = new List<UnitDimension>();


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
                    cmdString = "EXEC ProductivityModelGet " + UnitID + "," + OrgID;

                    command = new SqlCommand(cmdString, connection);
                    reader = command.ExecuteReader();

                    int recordCount = 0;
                    while (reader.Read())
                    {
                        newValue = new UnitDimension();
                        String name;
                        newValue.UnitID = UnitID;
                        newValue.OrganizationID = OrgID;
                        newValue.DimensionID = Convert.ToInt32(reader[recordCount++].ToString());
                        // read off the dimension name
                        newValue.DimensionName = reader[recordCount++].ToString();
                        Double effort = 0;
                        Double.TryParse(reader[recordCount++].ToString(), out effort);
                        newValue.LoNominalEffort = effort;
                        Double.TryParse(reader[recordCount++].ToString(), out effort);
                        newValue.MedNominalEffort = effort;
                        Double.TryParse(reader[recordCount++].ToString(), out effort);
                        newValue.HiNominalEffort = effort;

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

        /// <summary>
        /// Update the current sprint values to the data store - TBD: This should be changed to and Insert and an Update method provided
        /// </summary>
        /// <param name="UserID"></param>
        public static void Update(NaturalUnitModel item)
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

                    // Get the desired work item type. TBD - USer ID currently hardcoded to 1
                    cmdString = "EXEC DetailActivityUpdate " + item.ID + "," + item.LoEffort + "," + item.MedEffort + "," + item.HiEffort + "," + item.UserID;
                    command = new SqlCommand(cmdString, connection);

                    command.ExecuteNonQuery();
                }
            }

            catch (Exception e)
            {

            }
        }
    
    }

}