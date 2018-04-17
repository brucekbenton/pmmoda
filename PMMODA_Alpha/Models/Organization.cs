using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Script.Services;
using System.Net.Http;
using System.Web.Http;

using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;

using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.ModelBinding;
using PMMODA_Alpha.Models;
using PMMODA_Alpha.Providers;
using PMMODA_Alpha.Results;

// Included for Sql interactions
using System.Data.SqlClient;
//using PMMODA_utils;
// Included to support Configuration Manager operations
using System.Configuration;

namespace PMMODA_Alpha.Models
{
    public class Organization
    {
        public int Id { get; set; }
        public int CompanyID { get; set; }
        public string Name { get; set; }
        public String Description {get;set;}
        public Double WorkDay { get; set; }
        public Boolean isActive { get; set;}
        public int UserID { get; set; }




        public static List<Organization> LoadList(int CompanyID)
        {
            // Declare a collection to store the return values
            List<Organization> values;
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
            Organization org;


            values = new List<Organization>();

            try
            {
                // Establish a new connection. 
                using (connection = new SqlConnection(Authentication.ConnectionString))
                {
                    // Open the new connection
                    connection.Open();

                    if (connection.State == System.Data.ConnectionState.Open)
                    {
                        cmdString = "EXEC OrganizationListGet " + CompanyID;
                        command = new SqlCommand(cmdString, connection);

                        reader = command.ExecuteReader();

                        int recordCount = 0;
                        while (reader.Read())
                        {
                            org = new Organization();
                            org.Id = Convert.ToInt32(reader[recordCount++]);
                            org.Name = reader[recordCount++].ToString();
                            org.Description = reader[recordCount++].ToString();
                            Double workHours = 0;
                            Double.TryParse(reader[recordCount++].ToString(), out workHours);
                            org.WorkDay = workHours;
                            org.isActive = Convert.ToBoolean(reader[recordCount++]);
                            values.Add(org);
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



        // Declare a class method that will return the org details for the current org
        public static Organization GetOrganizationByID(int ID)
        {
            Organization org;
            // Declare a collection to store the return values
            List<Organization> values;
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


            org = new Organization();

            try
            {
                // Establish a new connection. 
                using (connection = new SqlConnection(Authentication.ConnectionString))
                {
                    // Open the new connection
                    connection.Open();

                    if (connection.State == System.Data.ConnectionState.Open)
                    {
                        cmdString = "EXEC OrganizationGet " + ID;
                        command = new SqlCommand(cmdString, connection);

                        reader = command.ExecuteReader();
                        int recordCount = 0;
                        reader.Read();
                        org = new Organization();
                        org.Id = Convert.ToInt32(reader[recordCount++]);
                        org.CompanyID = Convert.ToInt32(reader[recordCount++]);
                        org.Name = reader[recordCount++].ToString();
                        org.Description = reader[recordCount++].ToString();
                        Double workHours = 0;
                        Double.TryParse(reader[recordCount++].ToString(), out workHours);
                        org.WorkDay = workHours;
                        org.isActive = Convert.ToBoolean(reader[recordCount++]);

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


            return (org);
        }
        /// <summary>
        /// Save the passed in company s a newe record in the database
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        public static int Save(Organization item)
        {
            // Declare a local variable for the SQL Connection object
            SqlConnection connection;
            // Declare a local variable for the SQL Command object
            SqlCommand command;
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

                    // check to see if this is an insert or an update
                    if (item.Id == 0)
                    {

                        // Consruct the insert command
                        cmdString = "EXEC OrganizationInsert '" + item.Name.ToString() + "'," + item.CompanyID;
                        if(item.Description != null){
                            cmdString = cmdString + ",'" + item.Description.ToString() + "'"; 
                        }
                        else{
                            cmdString += ",''";
                        }
                        cmdString = cmdString + "," + item.UserID.ToString() + "," + item.WorkDay;

                        command = new SqlCommand(cmdString, connection);
                        key = command.ExecuteScalar();
                        Int32.TryParse(key.ToString(), out ID);


                        logStr = "EXEC CommandLogInsert Organization" + "," + item.Id + "," + item.UserID + ",\"" + cmdString + "\",0";
                        command = new SqlCommand(logStr, connection);
                        command.ExecuteScalar();

                    }
                    else
                    {

                        cmdString = "EXEC OrganizationUpdate " + item.Id.ToString() + ",'" + item.Name.ToString() + "'";
                        if(item.Description != null){
                            cmdString = cmdString + ",'" + item.Description.ToString() + "'"; 
                        }
                        else{
                            cmdString += ",''";
                        }
                        cmdString = cmdString + "," +item.isActive + "," + item.WorkDay + "," + item.UserID.ToString();

                        command = new SqlCommand(cmdString, connection);
                        key = command.ExecuteScalar();

                    }

                    connection.Close();
                }
            }
            catch (Exception e)
            {
            }

            // ADd the initial default roles for the current organization

            // get the current company
            Company company = Company.GetCompanyByID(item.CompanyID);
            String role;

            role = company.Name + "_" + item.Name + "_Admin";
            PmmodaUser.CreateRole(role);

            role = company.Name + "_" + item.Name + "_Member";
            PmmodaUser.CreateRole(role);

            // Update the ID value in the data object since this will get returned to the calling  code
            item.Id = ID;
            return (ID);
        }

        /// <summary>
        ///  Update the DB record to match the passed in record
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        public static Organization Update(Organization item)
        {
            // Declare a local variable for the SQL Connection object
            SqlConnection connection;
            // Declare a local variable for the SQL Command object
            SqlCommand command;
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



                        cmdString = "EXEC OrganizationUpdate " + item.Id.ToString() + ",'" + item.Name.ToString() + "'";
                        if (item.Description != null)
                        {
                            cmdString = cmdString + ",'" + item.Description.ToString() + "'";
                        }
                        else
                        {
                            cmdString += ",''";
                        }
                        cmdString = cmdString + "," + item.isActive + "," + item.WorkDay + "," + item.UserID.ToString();

                        command = new SqlCommand(cmdString, connection);
                        key = command.ExecuteScalar();

                    }

                    connection.Close();
                }
            catch (Exception e)
            {
            }

            // Update the ID value in the data object since this will get returned to the calling  code
            item.Id = ID;
            return (item);
        }

        /// Declare a method to determine whether the passed in organization belongs to the
        /// specified company
        /// 
        public static Boolean ValidateCompany(int OrgID, int CompanyID)
        {
            Boolean result = false;
            Organization org;
            // Declare a collection to store the return values
            List<Organization> values;
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

            org = new Organization();

            try
            {
                // Establish a new connection. 
                using (connection = new SqlConnection(Authentication.ConnectionString))
                {
                    // Open the new connection
                    connection.Open();

                    if (connection.State == System.Data.ConnectionState.Open)
                    {
                        cmdString = "EXEC OrganizationGet " + OrgID;
                        command = new SqlCommand(cmdString, connection);

                        reader = command.ExecuteReader();
                        int recordCount = 0;
                        reader.Read();
                        org = new Organization();
                        org.Id = Convert.ToInt32(reader[recordCount++]);
                        org.CompanyID = Convert.ToInt32(reader[recordCount++]);
                        org.Name = reader[recordCount++].ToString();
                        org.Description = reader[recordCount++].ToString();
                        Double workHours = 0;
                        Double.TryParse(reader[recordCount++].ToString(), out workHours);
                        org.WorkDay = workHours;
                        org.isActive = Convert.ToBoolean(reader[recordCount++]);

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

            // check to see if the CompanyID loaded from the DB matches the one passed in
            if (org.CompanyID == CompanyID)
            {
                result = true;
            }

            return (result);
        }


        public static int InitializeOrganizationFromWizard(int OrgID, int CompanyID, String alias, int staffingModelID, int appTypeID)
        {
            // Declare a local variable for the SQL Connection object
            SqlConnection connection;
            // Declare a local variable for the SQL Command object
            SqlCommand command;
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

                    cmdString = "EXEC initializeProjectTeamFromWizard " + CompanyID + "," + OrgID + "," + appTypeID + "," + staffingModelID + ",'" + alias.ToString() + "'";

//                    EXEC initializeProjectTeamFromWizard 2,28,1,3,'brucekbenton@gmail.com'

                    command = new SqlCommand(cmdString, connection);
                    key = command.ExecuteScalar();

                }

                connection.Close();
            }
            catch (Exception e)
            {
            }

            // Update the ID value in the data object since this will get returned to the calling  code
//            item.Id = ID;
            return (1);

        }
    }


}