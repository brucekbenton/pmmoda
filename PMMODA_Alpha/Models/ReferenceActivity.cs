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
    public class ReferenceActivity
    {

        public int ActivityID { get; set; }
        public int ModelID { get; set; }
        public int RoleID { get; set; }
        public String Name { get; set; }
        public String RoleName { get; set; }
        public String Description { get; set; }
        public Boolean isActive { get; set; }

        public static List<ReferenceActivity> LoadList(int ModelID)
        {
            // Declare a collection to store the return values
            List<ReferenceActivity> values;
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
            ReferenceActivity activity;


            values = new List<ReferenceActivity>();

            try
            {
                // Establish a new connection. 
                using (connection = new SqlConnection(Authentication.ConnectionString))
                {
                    // Open the new connection
                    connection.Open();

                    if (connection.State == System.Data.ConnectionState.Open)
                    {
                        cmdString = "EXEC ReferenceActivityListGet " + ModelID;
                        command = new SqlCommand(cmdString, connection);

                        reader = command.ExecuteReader();

                        int recordCount = 0;
                        while (reader.Read())
                        {
                            activity = new ReferenceActivity();
                            activity.ActivityID = Convert.ToInt32(reader[recordCount++]);
                            activity.ModelID = Convert.ToInt32(reader[recordCount++]);
                            activity.RoleID = Convert.ToInt32(reader[recordCount++]);
                            activity.Name = reader[recordCount++].ToString();
                            activity.RoleName = reader[recordCount++].ToString();
                            activity.Description = reader[recordCount++].ToString();
                            activity.isActive = Convert.ToBoolean(reader[recordCount++]);
                            values.Add(activity);
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


    }
}