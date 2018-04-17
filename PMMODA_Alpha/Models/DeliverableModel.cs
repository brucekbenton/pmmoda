using System;
using System.Collections.Generic;
// Included for Sql interactions
using System.Data.SqlClient;
//using PMMODA_utils;
// Included to support Configuration Manager operations
using System.Configuration;

namespace PMMODA_Alpha.Models
{
    public class DeliverableModel
    {
        public int ID { get; set; }
        public int DeliverableID { get; set; }
        public int NaturalUnitID { get; set; }
        public string NaturalUnitName { get; set; }
        public string Assumptions { get; set; }
        public double LowCount { get; set; }
        public double MedCount { get; set; }
        public double HighCount { get; set; }
        public double IterationCount { get; set; }
        public int UserID { get; set; }
        public double PercentComplete { get; set; }


        public static List<DeliverableModel> LoadList(int DeliverableID)
        {
            // Declare a local variable to hold the task collection
            List<DeliverableModel> values;
            string connectionString;

            SqlConnection connection;
            SqlCommand command;
            //            SqlDataReader reader;
            String cmdString;
            SqlDataReader reader;
            // Declare a local object to store the new Task 
            DeliverableModel newValue;

            // intialize the current collection
            values = new List<DeliverableModel>();


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
                    cmdString = "EXEC DeliverableModelGetList " + DeliverableID;

                    //            ApplicationLog.WriteLogEntry("DeliverableModel Service", "Command String", cmdString, ApplicationLog.LogType.Error);


                    command = new SqlCommand(cmdString, connection);
                    reader = command.ExecuteReader();

                    int recordCount = 0;
                    while (reader.Read())
                    {
                        newValue = new DeliverableModel();

                        newValue.ID = Convert.ToInt32(reader[recordCount++].ToString());
                        newValue.DeliverableID = DeliverableID;

                        newValue.NaturalUnitID = Convert.ToInt32(reader[recordCount++].ToString());

                        newValue.NaturalUnitName = reader[recordCount++].ToString();

                        newValue.Assumptions = reader[recordCount++].ToString();

                        Double count;
                        Double.TryParse(reader[recordCount++].ToString(), out count);
                        newValue.LowCount = count;

                        Double.TryParse(reader[recordCount++].ToString(), out count);
                        newValue.MedCount = count;

                        Double.TryParse(reader[recordCount++].ToString(), out count);
                        newValue.HighCount = count;

                        Double.TryParse(reader[recordCount++].ToString(), out count);
                        newValue.PercentComplete = count;

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


        public static int Save(DeliverableModel item)
        {

            string connectionString;
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

                    // Consruct the insert command
                    cmdString = "EXEC DeliverableModelInsert " + item.DeliverableID.ToString() + "," + item.NaturalUnitID.ToString() + ",'" +
                        Convert.ToString(item.Assumptions) + "'," + item.LowCount.ToString() + "," + item.MedCount.ToString() +
                        "," + item.HighCount.ToString() + "," + item.IterationCount.ToString() +"," + item.UserID.ToString() + "," + item.PercentComplete.ToString();

                    //            ApplicationLog.WriteLogEntry("DeliverableModel Service", "Command String", cmdString, ApplicationLog.LogType.Error);


                    command = new SqlCommand(cmdString, connection);
                    key = command.ExecuteScalar();


                    Int32.TryParse(key.ToString(), out ID);
                    //            this.ID = ID;
                }
            }
            catch (Exception e)
            {

            }
            return (ID);
        }


        /// <summary>
        /// Update the current DeliverableModel record
        /// </summary>
        /// <param name="UserID"></param>
        public static void Update(DeliverableModel item)
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

                    // Construct the command string 
                    cmdString = "EXEC DeliverableModelUpdate " + item.ID + ",'" + Convert.ToString(item.Assumptions) + "'," + item.LowCount + "," + item.MedCount + "," +
                        item.HighCount + "," +item.IterationCount + "," + item.PercentComplete.ToString() + "," + item.UserID;

                    command = new SqlCommand(cmdString, connection);

                    command.ExecuteNonQuery();
                }
            }

            catch (Exception e)
            {

            }
        }

        // Set the specified DeliverableModel record to an inactive state and update the modified by information
        public static void Delete(DeliverableModel item)
        {

            string connectionString;
            SqlConnection connection;
            SqlCommand command;
            object key;
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

                    // Consruct the insert command
                    cmdString = "EXEC DeliverableModelDelete " + item.ID + "," + item.UserID;

                    //            ApplicationLog.WriteLogEntry("DeliverableModel Service", "Command String", cmdString, ApplicationLog.LogType.Error);


                    command = new SqlCommand(cmdString, connection);
                    key = command.ExecuteScalar();
                }
            }

            catch (Exception e)
            {

            }

        }
    }
}