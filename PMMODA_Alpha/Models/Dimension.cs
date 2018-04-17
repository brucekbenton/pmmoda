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
    public class Dimension
    {
        public int ID { get; set; }
        public int OrganizationID { get; set; }
        public string Name { get; set; }
        public String Description { get; set; }
        public int Role { get; set; }
        public int UserID { get; set; }
        public Boolean isActive { get; set; } 


        public static List<Dimension> LoadList(int OrganizationID)
        {
            // Declare a local variable for the SQL Connection object
            SqlConnection connection;
            // Declare a local variable for the SQL Command object
            SqlCommand command;
            // Declare a local variable for the SQL data reader object
            SqlDataReader reader = null;
            // Declare a local variable to store the DB command string
            String cmdString;
            string connectionString;
            List<Dimension> values;
            Dimension dim;


            values = new List<Dimension>();

            // Get the connection string from the Configuration Manager
            try
            {
                // Establish a new connection. 
                using (connection = new SqlConnection(Authentication.ConnectionString))
                {
                    // Open the new connection
                    connection.Open();

                    cmdString = "EXEC DimensionListGet " + OrganizationID;

                    command = new SqlCommand(cmdString, connection);

                    reader = command.ExecuteReader();



                    int recordCount = 0;
                    while (reader.Read())
                    {
                        dim = new Dimension();
                        dim.ID = Convert.ToInt32(reader[recordCount++]);
                        dim.Name = reader[recordCount++].ToString();
                        dim.Description = reader[recordCount++].ToString();
                        dim.Role = Convert.ToInt32(reader[recordCount++]);
                        dim.isActive = Convert.ToBoolean(reader[recordCount++]);
                        // initialize the organization
                        dim.OrganizationID = OrganizationID;
                        values.Add(dim);
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

        public static int Save(Dimension item)
        {

            string connectionString;
            SqlConnection connection;
            SqlCommand command;
            object key;
            String cmdString;

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
                    cmdString = "EXEC DimensionInsert " + item.OrganizationID + ",'" + item.Name.ToString() + "'";
                    if (item.Description != null)
                    {
                        cmdString = cmdString + ",'" + item.Description.ToString() + "'";
                    }
                    else
                    {
                        cmdString += ",''";
                    }

                    cmdString = cmdString + "," + item.Role.ToString() + "," + item.UserID.ToString();


                    command = new SqlCommand(cmdString, connection);
                    key = command.ExecuteScalar();

                    Int32.TryParse(key.ToString(), out ID);

                    connection.Close();
                }
            }

            catch (Exception e)
            {

            }
            
            //            this.ID = ID;
            return (ID);
        }

        public static int Update(int id, Dimension item)
        {

            SqlConnection connection;
            SqlCommand command;
            object key;
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

                    // Consruct the insert command
                    cmdString = "EXEC DimensionUpdate " + id + ",'" + item.Name.ToString() + "'";
                    if(item.Description != null){
                        cmdString = cmdString + ",'" + item.Description.ToString() + "'";
                    }
                    else {
                        cmdString += ",''";
                    }

                    cmdString = cmdString + "," + item.Role.ToString() + ","
                        + item.isActive.ToString() + "," + item.UserID.ToString();

                    command = new SqlCommand(cmdString, connection);
                    key = command.ExecuteScalar();


                    connection.Close();
                }
            }

            catch (Exception e)
            {

            }

            int ID = 0;

//            Int32.TryParse(key.ToString(), out ID);
            //            this.ID = ID;
            return (ID);
        }

    }
}