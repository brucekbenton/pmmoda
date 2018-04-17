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
    public class ReferenceComponent
    {
        public int ComponentID { get; set; }
        public int TypeID { get; set; }
        public String Name { get; set; }
        public String Description { get; set; }
        public Boolean isActive { get; set; }
        /// <summary>
        /// Load the set of reference components defined for the specified ApplicationType
        /// </summary>
        /// <returns></returns>
        public static List<ReferenceComponent> LoadList(int TypeID)
        {
            // Declare a collection to store the return values
            List<ReferenceComponent> values;
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
            ReferenceComponent component;


            values = new List<ReferenceComponent>();

            try
            {
                // Establish a new connection. 
                using (connection = new SqlConnection(Authentication.ConnectionString))
                {
                    // Open the new connection
                    connection.Open();

                    if (connection.State == System.Data.ConnectionState.Open)
                    {
                        cmdString = "EXEC ReferenceComponentListGet " + TypeID;
                        command = new SqlCommand(cmdString, connection);

                        reader = command.ExecuteReader();

                        int recordCount = 0;
                        while (reader.Read())
                        {
                            component = new ReferenceComponent();
                            component.ComponentID = Convert.ToInt32(reader[recordCount++]);
                            component.TypeID = Convert.ToInt32(reader[recordCount++]);
                            component.Name = reader[recordCount++].ToString();
                            component.Description = reader[recordCount++].ToString();
                            component.isActive = Convert.ToBoolean(reader[recordCount++]);
                            values.Add(component);
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