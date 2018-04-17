using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
// Included for Sql interactions
using System.Data.SqlClient;
// Included to support Configuration Manager operations
using System.Configuration;
using System.Threading;

namespace PMMODA_Alpha.Models
{
    public class Authentication
    {

        public static String ConnectionString {
            get { return (ConfigurationManager.ConnectionStrings["Production"].ConnectionString); }
            }



        public static SqlConnection c_connection;

        //        String connectionString="Data Source=BRUCE-MAC\\SQL;Initial Catalog=WorkPlan;Integrated Security=True";
        //        String connectionString = "Data Source=BRUCE-MAC\\v11.0;Database=WorkPlan;Integrated Security=True";




        public static SqlConnection Connect(bool reuseConection)
        {
            String connectionString;

            #region reuseConnection
            if (reuseConection)
            {
                if (c_connection != null)
                {
                    if (c_connection.State != System.Data.ConnectionState.Open)
                    {
                        try
                        {
                            c_connection.Open();
                        }
                        catch (Exception e)
                        {
                        }
                    }
                }
                else
                {
                    if (ConnectionString == null)
                    {
                        connectionString = ConfigurationManager.ConnectionStrings["AzureConnection"].ConnectionString;

                    }
                    else
                    {
                        connectionString = ConnectionString;
                    }

                    c_connection = new SqlConnection(connectionString);//



                    try
                    {
                        c_connection.Open();
                    }
                    catch (Exception e)
                    {
                    }
                }
            #endregion reuseConnection
            }
            else
            {
                #region uniqueConnection
                // Get the connection string from the Configuration Manager
                connectionString = ConfigurationManager.ConnectionStrings["AzureConnection"].ConnectionString;
                // Establish a new connection. Need a separate connection because the connections are single threaded and the service calls can overlap
                c_connection = new SqlConnection(connectionString);//
                // Open the new connection
                c_connection.Open();

                #endregion uniqueConnection
            }

            // pause briefly to make sure the connection is open and timeout if it hangs
            int timeoutCounter = 0;
            while (c_connection.State != System.Data.ConnectionState.Open && timeoutCounter < 5000)
            {
                timeoutCounter++;
                Thread.Sleep(1);
            }

            return (c_connection);
        }

    }
}