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
    public class Company
    {
        public int CompanyID { get; set; }
        public String Name { get; set; }
        public String ContactName { get; set; }
        public String ContactAlias { get; set; }
        public String DomainName { get; set; }
        public Boolean OrganizationRestricted { get; set; }
        public Boolean ProjectRestricted { get; set; }
        public Boolean isActive { get; set; }


        public static List<Company> LoadList()
        {
            // Declare a collection to store the return values
            List<Company> values;


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
            Company  item;

            values = new List<Company>();

            try
            {
                // Establish a new connection. 
                using (connection = new SqlConnection(Authentication.ConnectionString))
                {
                    // Open the new connection
                    connection.Open();

                    if (connection.State == System.Data.ConnectionState.Open)
                    {
                        cmdString = "EXEC CompanyListGet";
                        command = new SqlCommand(cmdString, connection);

                        reader = command.ExecuteReader();

                        int recordCount = 0;
                        while (reader.Read())
                        {
                            item = new Company();
                            item.CompanyID = Convert.ToInt32(reader[recordCount++]);
                            item.Name = reader[recordCount++].ToString();
                            item.ContactName = reader[recordCount++].ToString();
                            item.ContactAlias = reader[recordCount++].ToString();
                            item.DomainName = reader[recordCount++].ToString();
                            item.OrganizationRestricted = Convert.ToBoolean(reader[recordCount++]);
                            item.ProjectRestricted = Convert.ToBoolean(reader[recordCount++]);
                            item.isActive = Convert.ToBoolean(reader[recordCount++]);
                            values.Add(item);
                            recordCount = 0;
                        }
                        reader.Close();

                        logStr = "EXEC CommandLogInsert Role" + "," + 0 + "," + -1 + ",\"" + cmdString + "\",0";
                        command = new SqlCommand(logStr, connection);
                        //                    command.ExecuteScalar();

                    }
                    connection.Close();
                }
            }
            catch (Exception e)
            {
            }


            return (values);
        }


        public static int Save(Company item)
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
                    item.Name = Utility.CleanInput(item.Name);
                    item.ContactName = Utility.CleanInput(item.ContactName);
                    item.ContactAlias = Utility.CleanInput(item.ContactAlias);
                    item.DomainName = Utility.CleanInput(item.DomainName);

                        // Consruct the insert command
                    cmdString = "EXEC CompanyInsert '" + item.Name.ToString() + "','" + item.ContactName.ToString() + "','" +
                        item.ContactAlias + "','" + item.DomainName + "'," + item.OrganizationRestricted + "," +
                        item.ProjectRestricted + "," + item.isActive + "," + UserID;


                        command = new SqlCommand(cmdString, connection);
                        key = command.ExecuteScalar();
                        Int32.TryParse(key.ToString(), out ID);


                        logStr = "EXEC CommandLogInsert Organization" + "," + item.CompanyID + "," + UserID + ",\"" + cmdString + "\",0";
                        command = new SqlCommand(logStr, connection);
                        command.ExecuteScalar();

                    connection.Close();
                }
            }
            catch (Exception e)
            {
                String message;

                message = e.Message;
            }

            // Update the ID value in the data object since this will get returned to the calling  code
            item.CompanyID = ID;
            return (ID);
        }


        public static int Update(Company item)
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
                    item.Name = Utility.CleanInput(item.Name);
                    item.ContactName = Utility.CleanInput(item.ContactName);
                    item.ContactAlias = Utility.CleanInput(item.ContactAlias);
                    item.DomainName = Utility.CleanInput(item.DomainName);

                    // Consruct the insert command
                    cmdString = "EXEC CompanyUpdate " + item.CompanyID +  ",'" + item.Name.ToString() + "','" + item.ContactName.ToString() + "','" +
                        item.ContactAlias + "','" + item.DomainName + "'," + item.OrganizationRestricted + "," +
                        item.ProjectRestricted + "," + item.isActive + "," + UserID;


                    command = new SqlCommand(cmdString, connection);
                    key = command.ExecuteScalar();
                    Int32.TryParse(key.ToString(), out ID);


                    logStr = "EXEC CommandLogInsert Organization" + "," + item.CompanyID + "," + UserID + ",\"" + cmdString + "\",0";
                    command = new SqlCommand(logStr, connection);
                    command.ExecuteScalar();

                    connection.Close();
                }
            }
            catch (Exception e)
            {
                String message;

                message = e.Message;
            }

            // Update the ID value in the data object since this will get returned to the calling  code
            item.CompanyID = ID;
            return (ID);
        }

        public static Company GetCompanyByID(int CompanyID)
        {
            // Declare a collection to store the return values
//            List<Company> values;


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
            Company item;

            item = new Company();

//            values = new List<Company>();

            try
            {
                // Establish a new connection. 
                using (connection = new SqlConnection(Authentication.ConnectionString))
                {
                    // Open the new connection
                    connection.Open();

                    if (connection.State == System.Data.ConnectionState.Open)
                    {
                        cmdString = "EXEC CompanyGetByID " + CompanyID;
                        command = new SqlCommand(cmdString, connection);

                        reader = command.ExecuteReader();

                        int recordCount = 0;
                        while (reader.Read())
                        {
                            item = new Company();
                            item.CompanyID = Convert.ToInt32(reader[recordCount++]);
                            item.Name = reader[recordCount++].ToString();
                            item.ContactName = reader[recordCount++].ToString();
                            item.ContactAlias = reader[recordCount++].ToString();
                            item.DomainName = reader[recordCount++].ToString();
                            item.OrganizationRestricted = Convert.ToBoolean(reader[recordCount++]);
                            item.ProjectRestricted = Convert.ToBoolean(reader[recordCount++]);
                            item.isActive = Convert.ToBoolean(reader[recordCount++]);
//                            values.Add(item);
                            recordCount = 0;
                        }
                        reader.Close();

                        logStr = "EXEC CommandLogInsert Role" + "," + 0 + "," + -1 + ",\"" + cmdString + "\",0";
                        command = new SqlCommand(logStr, connection);
                        //                    command.ExecuteScalar();

                    }
                    connection.Close();
                }
            }
            catch (Exception e)
            {
            }


            return (item);

        }

    }
}