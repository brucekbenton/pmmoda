using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
// Included for Sql interactions
using System.Data.SqlClient;
// Included to support Configuration Manager operations
using System.Configuration;

namespace PMMODA_Alpha.Models
{
    public class Deliverable
    {
        public int ID { get; set; }
        public int ParentID { get; set; }
        public int ProjectID { get; set; }
        public int WorkstreamID { get; set; }
        public string Name { get; set; }
        public string CrossReference { get; set; }
        public string Description { get; set; }
        public bool hasChildren { get; set; }
        public int DeliverableModelID { get; set; }
        public int NaturalUnitID { get; set; }
        public string NaturalUnitName { get; set; }
        public string Assumptions { get; set; }
        public double LowCount { get; set; }
        public double MedCount { get; set; }
        public double HighCount { get; set; }
        public double IterationCount { get; set; }
        public bool modelActive { get; set; }
        public Double PercentComplete { get; set; }
        public int UserID { get; set; }
        // Declare a varible to store the Deliverable isActive flag
        public int isActive { get; set; }


        public static List<Deliverable> LoadList(int ProjectID)
        {
            String connectionString;
            // Declare a local variable to hold the task collection
            List<Deliverable> values;
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
            Deliverable newValue;

            // intialize the current collection
            values = new List<Deliverable>();

            // Get the connection string from the Configuration Manager
//            connectionString = ConfigurationManager.ConnectionStrings["AzureConnection"].ConnectionString;
            try
            {
                // Establish a new connection. 
                using (connection = new SqlConnection(Authentication.ConnectionString))
                {
                    // Open the new connection
                    connection.Open();

                    //            connection = Authentication.Connect(false);

                    // construct the command string
                    cmdString = "EXEC DeliverableListGet " + ProjectID;


                    command = new SqlCommand(cmdString, connection);
                    reader = command.ExecuteReader();

                    int recordCount = 0;
                    while (reader.Read())
                    {
                        newValue = new Deliverable();
                        newValue.ID = Convert.ToInt32(reader[recordCount++].ToString());
                        //                ApplicationLog.WriteLogEntry("Deliverable Service", "Status:", "Loaded ID", ApplicationLog.LogType.Error);
                        int result = 0;
                        Int32.TryParse(reader[1].ToString(), out result);
                        newValue.ParentID = result;
                        //                ApplicationLog.WriteLogEntry("Deliverable Service", "Status:", "Loaded PArent ID", ApplicationLog.LogType.Error);
                        recordCount++;

                        int result2 = 0;
                        Int32.TryParse(reader[recordCount].ToString(), out result2);
                        newValue.WorkstreamID = result2;
                        //                ApplicationLog.WriteLogEntry("Deliverable Service", "Status:", "Loaded PArent ID", ApplicationLog.LogType.Error);
                        recordCount++;
                        newValue.ProjectID = ProjectID;
                        newValue.Name = reader[recordCount++].ToString();
                        //                ApplicationLog.WriteLogEntry("Deliverable Service", "Status:", "Loaded Name", ApplicationLog.LogType.Error);
                        newValue.CrossReference = reader[recordCount++].ToString();
                        //                ApplicationLog.WriteLogEntry("Deliverable Service", "Status:", "Loaded Cross Reference", ApplicationLog.LogType.Error);
                        newValue.Description = reader[recordCount++].ToString();
                        //                ApplicationLog.WriteLogEntry("Deliverable Service", "Status:", "Loaded Description", ApplicationLog.LogType.Error);
                        //                ApplicationLog.WriteLogEntry("Deliverable Service", "Next record:", reader[recordCount].ToString(), ApplicationLog.LogType.Error);
                        // Load the value to indicte whether the current deliverable has any child deliverables
                        newValue.hasChildren = Convert.ToBoolean(reader[recordCount++].ToString());

                        // Load the Deliverable Model ID
                        Int32.TryParse(reader[recordCount++].ToString(), out result);
                        newValue.DeliverableModelID = result;
                        // load the optional Natural Unit ID vlaue
                        Int32.TryParse(reader[recordCount++].ToString(), out result);
                        newValue.NaturalUnitID = result;
                        newValue.NaturalUnitName = reader[recordCount++].ToString();
                        // Read the optional assumptions string
                        newValue.Assumptions = reader[recordCount++].ToString();
                        // Conver the optional cout values
                        double count;
                        Double.TryParse(reader[recordCount++].ToString(), out count);
                        newValue.LowCount = count;
                        Double.TryParse(reader[recordCount++].ToString(), out count);
                        newValue.MedCount = count;
                        Double.TryParse(reader[recordCount++].ToString(), out count);
                        newValue.HighCount = count;
                        Double.TryParse(reader[recordCount++].ToString(), out count);
                        newValue.IterationCount = count;
                        // Load the flag to indicate whether the current model record is active
                        Boolean flag;
                        Boolean.TryParse(reader[recordCount++].ToString(), out flag);
                        newValue.modelActive = flag;

                        Double.TryParse(reader[recordCount++].ToString(), out count);
                        newValue.PercentComplete = count;

                        values.Add(newValue);

                        recordCount = 0;
                    }
                    reader.Close();

                    connection.Close();
                }
            }
            catch(Exception e)
            {
            }

            return (values);
        }


        public static int Save(Deliverable item,int UserID)
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
                    item.CrossReference = Utility.CleanInput(item.CrossReference);


                    // Consruct the insert command
                    cmdString = "EXEC DeliverableInsert " + item.ParentID.ToString() + "," + item.ProjectID.ToString() + ",'" +
                        item.Name.ToString() + "','" + Convert.ToString(item.CrossReference) + "','" + Convert.ToString(item.Description) + "'," + UserID.ToString();


                    command = new SqlCommand(cmdString, connection);
                    key = command.ExecuteScalar();


                    Int32.TryParse(key.ToString(), out ID);
                }
            }
            catch(Exception e)
            {
                
            }
            return (ID);
        }

        /// <summary>
        /// Update the current Deliverable record
        /// </summary>
        /// <param name="UserID"></param>
        public static void Update(Deliverable item,String user)
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
                    item.CrossReference = Utility.CleanInput(item.CrossReference);


                    // Construct the command string 
                    cmdString = "EXEC DeliverableUpdate " + item.ID + ",'" + item.Name + "','" + item.Description + "','" + item.CrossReference + "'," +
                         item.WorkstreamID + ",'" + item.UserID.ToString() + "'," + item.isActive;


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