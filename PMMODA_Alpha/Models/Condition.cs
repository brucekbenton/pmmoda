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
    public class Condition
    {
        public int ID { get; set; }
        public int ProjectID { get; set; }
        public int ActivityID { get; set; }
        public String ActivityName { get; set; }
        public int DependencyID { get; set; }
        public String DependencyName { get; set; }
        public Double CompletionPercentage { get; set; }
        public int ConditionTypeID { get; set; }
        public String ConditionType { get; set; }


        public static List<Condition> LoadList(int ProjectID)
        {
            // Declare a local variable for the SQL Connection object
            SqlConnection connection;
            // Declare a local variable for the SQL Command object
            SqlCommand command;
            // Declare a local variable for the SQL data reader object
            SqlDataReader reader = null;
            // Declare a local variable to store the DB command string
            String cmdString;
            List<Condition> values;
            Condition condition;


            values = new List<Condition>();

            // Get the connection string from the Configuration Manager
            try
            {
                // Establish a new connection. 
                using (connection = new SqlConnection(Authentication.ConnectionString))
                {
                    // Open the new connection
                    connection.Open();

                    cmdString = "EXEC ConditionGetByProject " + ProjectID;

                    command = new SqlCommand(cmdString, connection);

                    reader = command.ExecuteReader();



                    int recordCount = 0;
                    while (reader.Read())
                    {
                        condition = new Condition();
                        condition.ID = Convert.ToInt32(reader[recordCount++]);
                        condition.ProjectID = Convert.ToInt32(reader[recordCount++]);
                        condition.ActivityID = Convert.ToInt32(reader[recordCount++]);
                        condition.ActivityName = reader[recordCount++].ToString();
                        condition.DependencyID = Convert.ToInt32(reader[recordCount++]);
                        condition.DependencyName = reader[recordCount++].ToString();
                        Double completion;
                        Double.TryParse(reader[recordCount++].ToString(), out completion);
                        condition.CompletionPercentage = completion;
                        condition.ConditionTypeID = Convert.ToInt32(reader[recordCount++]);
                        condition.ConditionType = reader[recordCount++].ToString();

                        values.Add(condition);
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

        public static int Save(Condition item)
        {
            // Declare a local variable for the SQL Connection object
            SqlConnection connection;
            // Declare a local variable for the SQL Command object
            SqlCommand command;
            // Declare a local variable to store the DB command string
            String cmdString;
            // Declare a local variable to store the string for the logging call to the DB
            String logStr;

            int UserID = 1;


            object key;
            int ID = 0;

            try
            {
                // Establish a new connection. 
                using (connection = new SqlConnection(Authentication.ConnectionString))
                {
                    connection.Open();

                    // Strip any illegal characters out of the input strings
                    item.ActivityName = Utility.CleanInput(item.ActivityName);

                    // Consruct the insert command
                    cmdString = "EXEC ConditionInsert " + item.ProjectID + "," + item.ActivityID + "," +
                        item.DependencyID + "," + item.CompletionPercentage + "," + item.ConditionTypeID;


                    command = new SqlCommand(cmdString, connection);
                    key = command.ExecuteScalar();
                    Int32.TryParse(key.ToString(), out ID);

                    connection.Close();
                }
            }
            catch (Exception e)
            {
                String message;

                message = e.Message;
            }

            // Update the ID value in the data object since this will get returned to the calling  code
            item.ID = ID;
            return (ID);
        }

        public static void Update(Condition item)
        {
            // Declare a local variable for the SQL Connection object
            SqlConnection connection;
            // Declare a local variable for the SQL Command object
            SqlCommand command;
            // Declare a local variable to store the DB command string
            String cmdString;

//            object key;
//            int ID = 0;

            try
            {
                // Establish a new connection. 
                using (connection = new SqlConnection(Authentication.ConnectionString))
                {
                    connection.Open();

                    // Strip any illegal characters out of the input strings
                    item.ActivityName = Utility.CleanInput(item.ActivityName);

                    // Consruct the insert command
                    cmdString = "EXEC ConditionUpdate " + item.ProjectID + "," + item.ActivityID + "," +
                        item.DependencyID + "," + item.CompletionPercentage;


                    command = new SqlCommand(cmdString, connection);
                    command.ExecuteScalar();

                    connection.Close();
                }
            }
            catch (Exception e)
            {
                String message;

                message = e.Message;
            }

        }


        public static void Delete(int ProjectID,Condition item)
        {
            // Declare a local variable for the SQL Connection object
            SqlConnection connection;
            // Declare a local variable for the SQL Command object
            SqlCommand command;
            // Declare a local variable to store the DB command string
            String cmdString;


            try
            {
                // Establish a new connection. 
                using (connection = new SqlConnection(Authentication.ConnectionString))
                {
                    connection.Open();


                    // Consruct the insert command
                    cmdString = "EXEC ConditionDelete " + item.ProjectID + "," + item.ActivityID + "," +
                        item.DependencyID + "," + item.ConditionTypeID;


                    command = new SqlCommand(cmdString, connection);
                    command.ExecuteScalar();

                    connection.Close();
                }
            }
            catch (Exception e)
            {
                String message;

                message = e.Message;
            }

        }

    }
}