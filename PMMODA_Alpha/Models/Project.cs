using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
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
    public enum ProjectStatus : int
    {
        Planning = 1,
        Released = 2,
        OnHold = 3,
        Completed = 4,
        All = 5
    }


    public class Project
    {
        public int ID { get; set; }
        public int OrganizationID { get; set; }
        public string Name { get; set; }
        public String Purpose { get; set; }
        public String Description {get;set;}
        public ProjectStatus Status { get; set; }
        public Double BaselineEffort { get; set; }
        public DateTime StartDate { get; set; }
        public int StatusID { get; set; }
        public Boolean isActive { get; set; }
        public int UserID { get; set; }


        public static List<Project> LoadList(int OrganizationID)
        {
            SqlConnection connection;
            SqlCommand command;
            SqlDataReader reader;
            Project project;

            String cmdString;
            List<Project> values;

            values = new List<Project>();


            try
            {
                // Establish a new connection. 
                using (connection = new SqlConnection(Authentication.ConnectionString))
                {
                    connection.Open();

                    // Construct the query to get the current sprint data
                    cmdString = "EXEC ProjectListGet " + OrganizationID;

                    command = new SqlCommand(cmdString, connection);

                    reader = command.ExecuteReader();
                    int recordCount = 0;
                    while (reader.Read())
                    {
                        project = new Project();
                        project.ID = Convert.ToInt32(reader[recordCount++].ToString());
                        project.Name = reader[recordCount++].ToString();
                        project.Description = reader[recordCount++].ToString();
                        project.Purpose = reader[recordCount++].ToString();
                        int status;
                        Int32.TryParse(reader[recordCount++].ToString(), out status);

                        project.Status = (ProjectStatus)(status);
                        Double effort = 0;
                        Double.TryParse(reader[recordCount++].ToString(), out effort);
                        project.BaselineEffort = effort;
                        DateTime startDate;
                        DateTime.TryParse(reader[recordCount++].ToString(), out startDate);
                        project.StartDate = startDate;
                        project.isActive = Convert.ToBoolean(reader[recordCount++]);
                        // Initialize the Organizaiotn ID
                        project.OrganizationID = OrganizationID;
                        values.Add(project);
                        recordCount = 0;
                    }
                    reader.Close();
                }
            }

            catch (Exception e)
            {

            }

            return (values);
        }

        
        public static int Save(Project item)
        {

//            string connectionString;
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
                    item.Purpose = Utility.CleanInput(item.Purpose);

                    // Consruct the insert command
                    cmdString = "EXEC ProjectInsert " + item.OrganizationID.ToString() + ",'" + item.Name.ToString() +"'";
                    if (item.Description != null)
                    {
                        cmdString = cmdString + ",'" + item.Description.ToString() +"'"; 
                    }
                    else
                    {
                        cmdString += ",''";
                    }

                    if (item.Purpose != null)
                    {
                        cmdString = cmdString + ",'" + item.Purpose.ToString() +"'";
                    }
                    else
                    {
                        cmdString += ",''";
                    }
                    cmdString = cmdString + "," + item.StatusID.ToString() + "," + item.UserID.ToString();

                    command = new SqlCommand(cmdString, connection);
                    key = command.ExecuteScalar();


                    Int32.TryParse(key.ToString(), out ID);
                }
            }

            catch (Exception e)
            {

            }

            return (ID);
        }




        public static int Update(Project item)
        {
            // Declare a local variable for the SQL Connection object
            SqlConnection connection;
            // Declare a local variable for the SQL Command object
            SqlCommand command;
            // Declare a local variable to store the DB command string
            String cmdString;
            // Declare a local variable to store the string for the logging call to the DB
            String logStr;
            

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
                    item.Purpose = Utility.CleanInput(item.Purpose);

                    // Construct the command string 
                    cmdString = "EXEC ProjectUpdate " + item.ID + ",'" + item.Name + "','" + item.Description + "','" + item.Purpose + "'," + item.isActive + "," +
                            item.UserID;

                    command = new SqlCommand(cmdString, connection);

                    command.ExecuteScalar();

                    ID = item.ID;


                    }

                    connection.Close();
            }

            catch (Exception e)
            {
                String message = e.Message;
            }

            return (ID);

        }

        public static Project getProjectByID(int ProjectID)
        {
            SqlConnection connection;
            SqlCommand command;
            SqlDataReader reader;
            Project project;

            String cmdString;

            project = new Project();


            try
            {
                // Establish a new connection. 
                using (connection = new SqlConnection(Authentication.ConnectionString))
                {
                    connection.Open();

                    // Construct the query to get the current sprint data
                    cmdString = "EXEC ProjectGet " + ProjectID;

                    command = new SqlCommand(cmdString, connection);

                    reader = command.ExecuteReader();
                    int recordCount = 0;
                    while (reader.Read())
                    {
                        project = new Project();
                        project.ID = Convert.ToInt32(reader[recordCount++].ToString());
                        project.OrganizationID = Convert.ToInt32(reader[recordCount++].ToString());
                        project.Name = reader[recordCount++].ToString();
                        project.Description = reader[recordCount++].ToString();
                        project.Purpose = reader[recordCount++].ToString();
                        Double effort = 0;
                        Double.TryParse(reader[recordCount++].ToString(), out effort);
                        project.BaselineEffort = effort;
                        project.isActive = Convert.ToBoolean(reader[recordCount++]);
                        recordCount = 0;
                    }
                    reader.Close();
                }
            }

            catch (Exception e)
            {

            }

            return (project);
        }

    }
}