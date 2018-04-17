using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
// Included for Sql interactions
using System.Data.SqlClient;
//using PMMODA_utils;
// Including to support getting class name for logging
using System.Reflection;
// Included to support Directory operations
using System.IO;
// Included to support Configuration Manager operations
using System.Configuration;
// Include for ASPNET compatibility enums
//using System.ServiceModel.Activation;
// Include for debug output
using System.Diagnostics;
using System.Web.Http.ModelBinding;

namespace PMMODA_Alpha.Models
{
    /*
    public class UnitDimensionSet
    {
        public List<UnitDimension> dataMatrix;

        public UnitDimensionSet()
        {
            dataMatrix = new List<UnitDimension>();
        }
    }
    */

    /// <summary>
    ///  Declare an abstraction object to store a UnitDimension pair. This will be used to pass data into the update procedure
    /// </summary>
    /// 
    public class UnitDimension
    {
        public int UnitID { get; set; }
        public int DimensionID { get; set; }
        public String DimensionName { get; set; }
        public int OrganizationID { get; set; }
        public Boolean isActive { get; set; }
        public int UserID { get; set; }
        public Double LoNominalEffort { get; set; }
        public Double MedNominalEffort { get; set; }
        public Double HiNominalEffort { get; set; }

        /// <summary>
        /// Declare a method to update existing UnitDimensino records
        /// </summary>
        /// <param name="UnitID"></param>
        /// <returns></returns>
        /// //UnitDimension[]

        public static void Update(UnitDimension item)
        {
            string connectionString;
            SqlConnection connection;
            SqlCommand command;
            String cmdString;

            // Get the connection string from the Configuration Manager
//            connectionString = ConfigurationManager.ConnectionStrings["AzureConnection"].ConnectionString;
            try
            {
                // Establish a new connection. 
                using (connection = new SqlConnection(Authentication.ConnectionString))
                {
                    // Open the new connection
                    connection.Open();

                    //            ApplicationLog.WriteLogEntry("UnitDimension Service", "Inside Update procedure",data.Length.ToString(), ApplicationLog.LogType.Error);
                    //            ApplicationLog.WriteLogEntry("UnitDimension Service", "Inside Update procedure", "", ApplicationLog.LogType.Error);

                    // Construct the command string 
                    cmdString = "EXEC UnitDimensionUpdate " + item.OrganizationID + "," + item.UnitID + "," + item.DimensionID + "," + item.isActive + "," +
                        item.UserID;
                    //            ApplicationLog.WriteLogEntry("UnitDimension Service", "cmd string", cmdString, ApplicationLog.LogType.Error);
                    command = new SqlCommand(cmdString, connection);
                    command.ExecuteNonQuery();
                    connection.Close();
                }
            }

            catch (Exception e)
            {

            }
        }


        public static List<UnitDimension> LoadList(int OrganizationID)
        {
            String connectionString;
            // Declare a local variable for the SQL Connection object
            SqlConnection connection;
            // Declare a local variable for the SQL Command object
            SqlCommand command;
            // Declare a local variable for the SQL data reader object
            SqlDataReader reader = null;
            // Declare a local variable to store the DB command string
            String cmdString;
//            string connectionString;
            List<UnitDimension> values;
            UnitDimension dataSet;

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
                    //            using (connection = Authentication.Connect(false))
                    //            {

                    // Construct the query to get the current sprint data
                    cmdString = "EXEC UnitDimensionListGet " + OrganizationID;

                    //            ApplicationLog.WriteLogEntry("UnitDimension Service", "Command String", cmdString, ApplicationLog.LogType.Error);

                    command = new SqlCommand(cmdString, connection);

                    reader = null;

                    // Make sure the connection is open
                    if (connection.State == System.Data.ConnectionState.Open)
                    {
                        reader = command.ExecuteReader();
                        int recordCount = 0;
                        while (reader.Read())
                        {
                            dataSet = new UnitDimension();
                            dataSet.OrganizationID = OrganizationID;
                            dataSet.UnitID = Convert.ToInt32(reader[recordCount++].ToString());
                            dataSet.DimensionID = Convert.ToInt32(reader[recordCount++].ToString());
                            dataSet.isActive = Convert.ToBoolean(reader[recordCount++]);
                            values.Add(dataSet);
                            recordCount = 0;
                        }
                        reader.Close();
                    }

                    connection.Close();
                }
            }

            catch (Exception e)
            {

            }

            return (values);
        }

    }
}