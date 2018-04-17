using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
//using PMMODA_utils;
// Included to support Configuration Manager operations
using System.Configuration;


namespace PMMODA_Alpha.Models
{
    public class ProductivityModel
    {
//        public int ID { get; set; }
        public int OrganizationID { get; set; }
        public int UnitID { get; set; }
        public String UnitName { get; set; }
        public String Description { get; set; }
        public int DimensionID { get; set; }
        public String DimensionName { get; set; }

        public int MasterRoleID { get; set; }
        public double LoNominalEffort { get; set; }
        public double MedNominalEffort { get; set; }
        public double HiNominalEffort { get; set; }
        public int UserID { get; set; }
        public int RoleID { get; set; }
        public Double BillRate { get; set; }

        public static List<ProductivityModel> LoadList(int unitID)
        {
            // Declare a local variable to hold the task collection
            List<ProductivityModel> values;
            string connectionString;

            SqlConnection connection;
            SqlCommand command;
            //            SqlDataReader reader;
            String cmdString;
            SqlDataReader reader;
            // Declare a local object to store the new Task 
            ProductivityModel newValue;

            // intialize the current collection
            values = new List<ProductivityModel>();


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
                    cmdString = "EXEC ProductivityModelGetList " + unitID;


                    command = new SqlCommand(cmdString, connection);
                    reader = command.ExecuteReader();

                    int recordCount = 0;
                    while (reader.Read())
                    {
                        newValue = new ProductivityModel();
                        newValue.OrganizationID = Convert.ToInt32(reader[recordCount++].ToString());
                        newValue.UnitID = Convert.ToInt32(reader[recordCount++].ToString());
                        newValue.UnitName = reader[recordCount++].ToString();
//                        newValue.Description = reader[recordCount++].ToString();
                        newValue.DimensionID = Convert.ToInt32(reader[recordCount++].ToString());
                        newValue.DimensionName = reader[recordCount++].ToString();
                        newValue.MasterRoleID = Convert.ToInt32(reader[recordCount++].ToString());
                        Double effort = 0;
                        Double.TryParse(reader[recordCount++].ToString(), out effort);
                        newValue.LoNominalEffort = effort;
                        Double.TryParse(reader[recordCount++].ToString(), out effort);
                        newValue.MedNominalEffort = effort;
                        Double.TryParse(reader[recordCount++].ToString(), out effort);
                        newValue.HiNominalEffort = effort;
                        // initialize the RoleID field
                        newValue.RoleID = Convert.ToInt32(reader[recordCount++].ToString());
                        Double billRate = 0;
                        Double.TryParse(reader[recordCount++].ToString(), out billRate);
                        newValue.BillRate = billRate;

                        values.Add(newValue);

                        recordCount = 0;
                    }
                    reader.Close();

                    connection.Close();
                }
            }

            catch (Exception e)
            {
                String Message = e.Message;
            }

            return (values);
        }

        public static int Update(ProductivityModel item)
        {
            // Declare a local object to store the connection string
            string connectionString;
            // Declare a local object to store the DB Connection instance
            SqlConnection connection;
            SqlCommand command;
            // Declare an object to store the DB response
            object key;
            // Declare a local object to use constructing the DB command string
            String cmdString;
            // Declare a local object to store the transaction logging string
            String logStr;

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
                    cmdString = "EXEC ProductivityModelUpdate " + item.UnitID.ToString() + "," + item.DimensionID.ToString() + "," + item.OrganizationID.ToString() +
                        "," + item.LoNominalEffort.ToString() + "," + item.MedNominalEffort + "," + item.HiNominalEffort + "," + item.UserID;

                    command = new SqlCommand(cmdString, connection);
                    key = command.ExecuteScalar();
                    // TBD Get return codes working in thismodel (and the rest:-))
                    //            Int32.TryParse(key.ToString(), out ID);

                    // Construct the logging string and insert the log record for this transaction
                    logStr = "EXEC CommandLogInsert PrductivityModel" + "," + item.UnitID + "," + item.UserID + ",\"" + cmdString + "\",0";
                    command = new SqlCommand(logStr, connection);
                    command.ExecuteScalar();
                }
            }

            catch (Exception e)
            {

            }

            return (ID);

        }
    }
}