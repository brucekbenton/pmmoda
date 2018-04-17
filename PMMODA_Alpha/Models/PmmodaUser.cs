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
// Included to support Configuration Manager operations
using System.Configuration;
using System.Web.Security;


namespace PMMODA_Alpha.Models
{

    public enum PmmodaUserMode {Member,Admin};
    public class PmmodaUser
    {
        public int UserID { get; set; }
        public String Username { get; set; }
        public String Password { get; set; }
        public String Email { get; set; }
        public int CompanyID { get; set; }
        public Guid RoleID { get; set; }
        public int PmmodaRoleID {get;set;}
        public String Role { get; set; }
        public Boolean isActive { get; set; }
        // Declare a variable to store the SuperUSer string
        public const String SuperUser = "SuperUser";


        public static HttpResponseMessage ValidateAccess(String org,PmmodaUserMode mode)
        {
            HttpResponseMessage response;
            Company currentCompany;
            String userMode;
//            Boolean result = false;
            System.Security.Principal.IPrincipal user;

            String role;

            // Initialie the user mode
            if (mode == PmmodaUserMode.Member)
            {
                userMode = "Member";
            }
            else
            {
                userMode = "Admin";
            }


            using (var context = new ApplicationDbContext())
            {
                user = System.Web.HttpContext.Current.User;

                currentCompany = GetByUser(user.Identity.Name);

                // Check for null org to indicate a company wide request
                if (org != "")
                {
                    if (currentCompany.OrganizationRestricted)
                    {
                        role = currentCompany.Name + "_" + org + "_" + userMode;
                    }
                    else
                    {
                        role = currentCompany.Name + "_" + userMode;
                    }
                }
                else
                {
                    role = currentCompany.Name + "_" + userMode;
                }

                if (user.IsInRole(role) || user.IsInRole("SuperUser") || user.IsInRole(currentCompany.Name + "_" + "Admin"))
                {
                    response = new HttpResponseMessage(HttpStatusCode.OK);
                }
                else
                {
                    response = new HttpResponseMessage(HttpStatusCode.Unauthorized);

                }
            }

            return (response);
        }


        // Validate whether the current user has access to the role provided
        public static HttpResponseMessage ValidateFormAccess(String role)
        {
            HttpResponseMessage response;
            //            Boolean result = false;
            System.Security.Principal.IPrincipal user;


            using (var context = new ApplicationDbContext())
            {
                user = System.Web.HttpContext.Current.User;


                if (user.IsInRole(role))
                {
//                    var response = this.Request.CreateResponse<Company>(HttpStatusCode.Created, role);
                    response = new HttpResponseMessage(HttpStatusCode.OK);
                }
                else
                {
                    response = new HttpResponseMessage(HttpStatusCode.Unauthorized);

                }
            }

            return (response);
        }

        // Get the company record corresonding to the supplied username/alias
        public static Company GetByUser(String username)
        {
            Company item = null;

            item = new Company();

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
//            Company item;

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
                        cmdString = "EXEC CompanyGetByUser '" + username + "'";
                        command = new SqlCommand(cmdString, connection);

                        reader = command.ExecuteReader();

                        int recordCount = 0;
                        while (reader.Read())
                        {
//                            item = new Company();
                            item.CompanyID = Convert.ToInt32(reader[recordCount++]);
                            item.Name = reader[recordCount++].ToString();
                            item.ContactName = reader[recordCount++].ToString();
                            item.ContactAlias = reader[recordCount++].ToString();
                            item.DomainName = reader[recordCount++].ToString();
                            item.OrganizationRestricted = Convert.ToBoolean(reader[recordCount++]);
                            item.ProjectRestricted = Convert.ToBoolean(reader[recordCount++]);
                            item.isActive = Convert.ToBoolean(reader[recordCount++]);
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

        public static async Task<HttpResponseMessage> CreateRole(String role)
        {
            HttpResponseMessage response;

            response = new HttpResponseMessage(HttpStatusCode.Unauthorized);

            using (var context = new ApplicationDbContext())
            {
                var roleStore = new RoleStore<IdentityRole>(context);
                var roleManager = new RoleManager<IdentityRole>(roleStore);

                await roleManager.CreateAsync(new IdentityRole() { Name = role });


            }

            //        }
//            return Ok();
            return (response);
        }

        public static List<PmmodaUser> LoadUserRoleList(int CompanyID)
        {
            List<PmmodaUser> values;
            PmmodaUser user;

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
            //            Company item;

            values = new List<PmmodaUser>();

            try
            {
                // Establish a new connection. 
                using (connection = new SqlConnection(Authentication.ConnectionString))
                {
                    // Open the new connection
                    connection.Open();

                    if (connection.State == System.Data.ConnectionState.Open)
                    {
                        cmdString = "EXEC UserRolesGetByCompany " + CompanyID;
                        command = new SqlCommand(cmdString, connection);

                        reader = command.ExecuteReader();

                        int recordCount = 0;
                        while (reader.Read())
                        {
                            user = new PmmodaUser();
                            //                            item = new Company();
                            user.UserID = Convert.ToInt32(reader[recordCount++]);
                            user.Username = reader[recordCount++].ToString();
                            Guid guid;
                            Guid.TryParse(reader[recordCount++].ToString(), out guid);
//                            Int32.TryParse(key.ToString(), out ID);

                            user.RoleID = guid;
                            user.Role = reader[recordCount++].ToString();
                            values.Add(user);
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

        public static List<PmmodaUser> LoadUsersByCompany(int CompanyID)
        {
            List<PmmodaUser> values;
            PmmodaUser user;

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
            //            Company item;

            values = new List<PmmodaUser>();

            try
            {
                // Establish a new connection. 
                using (connection = new SqlConnection(Authentication.ConnectionString))
                {
                    // Open the new connection
                    connection.Open();

                    if (connection.State == System.Data.ConnectionState.Open)
                    {
                        cmdString = "EXEC UserGetListByCompany " + CompanyID;
                        command = new SqlCommand(cmdString, connection);

                        reader = command.ExecuteReader();

                        int recordCount = 0;
                        while (reader.Read())
                        {
                            user = new PmmodaUser();
                            //                            item = new Company();
                            user.UserID = Convert.ToInt32(reader[recordCount++]);
                            user.CompanyID = Convert.ToInt32(reader[recordCount++]);
                            user.Username = reader[recordCount++].ToString();
                            user.Email = reader[recordCount++].ToString();
                            user.Role = reader[recordCount++].ToString();
                            user.PmmodaRoleID = Convert.ToInt32(reader[recordCount++]);
                            values.Add(user);
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

        public static int Save(PmmodaUser item)
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
                    // Consruct the insert command
                    cmdString = "EXEC UserInsert '" + item.Username.ToString() + "','" + item.Email.ToString() + "'," +
                        item.CompanyID + ",null," + item.isActive + "," + UserID;


                    command = new SqlCommand(cmdString, connection);
                    key = command.ExecuteScalar();
                    Int32.TryParse(key.ToString(), out ID);


                    logStr = "EXEC CommandLogInsert Organization" + "," + item.CompanyID + "," + UserID + ",\"" + cmdString + "\",0";
                    command = new SqlCommand(logStr, connection);
                    command.ExecuteScalar();

                    connection.Close();

                    InitializeUser(item);
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

        public async static Task<HttpResponseMessage> InitializeUser(PmmodaUser item)
        {
            Company company;
            ApplicationUser refUser;

            HttpResponseMessage response;

            response = new HttpResponseMessage(HttpStatusCode.OK);

            
            using (var context = new ApplicationDbContext())
            {
                var userStore = new UserStore<ApplicationUser>(context);
                var userManager = new UserManager<ApplicationUser>(userStore);
                var roleStore = new RoleStore<IdentityRole>(context);
                var roleManager = new RoleManager<IdentityRole>(roleStore);

                refUser = userManager.FindByEmail(item.Email);

                company = PmmodaUser.GetByUser(item.Email);

                await userManager.AddToRoleAsync(refUser.Id, company.Name + "_Member");

            }
            
            return (response);
        }


        public async static Task<HttpResponseMessage> AddUserToRole(String username, String role)
        {
            ApplicationUser refUser;
            HttpResponseMessage response;

            response = new HttpResponseMessage(HttpStatusCode.OK);


            using (var context = new ApplicationDbContext())
            {
                var userStore = new UserStore<ApplicationUser>(context);
                var userManager = new UserManager<ApplicationUser>(userStore);
                var roleStore = new RoleStore<IdentityRole>(context);
                var roleManager = new RoleManager<IdentityRole>(roleStore);

                //                var user = System.Web.HttpContext.Current.User;
                refUser = userManager.FindByEmail(username);

                await userManager.AddToRoleAsync(refUser.Id, role);

            }
            return (response);

        }


        public async static Task<HttpResponseMessage> RemoveUserFromRole(String username, String role)
        {
            ApplicationUser refUser;
            IdentityResult result;
            HttpResponseMessage response;

            response = new HttpResponseMessage(HttpStatusCode.OK);

            using (var context = new ApplicationDbContext())
            {
                var userStore = new UserStore<ApplicationUser>(context);
                var userManager = new UserManager<ApplicationUser>(userStore);
                var roleStore = new RoleStore<IdentityRole>(context);
                var roleManager = new RoleManager<IdentityRole>(roleStore);

                //                var user = System.Web.HttpContext.Current.User;
                refUser = userManager.FindByEmail(username);

                result = await userManager.RemoveFromRoleAsync(refUser.Id, role);
//                await userManager.AddToRoleAsync(refUser.Id, role);

            }
            return (response);

        }

        //  Declare a method to enable teh system administraor to reset a user password. Thsi is intended
        //  to be used then the user has forgotten their password
        public static HttpResponseMessage SystemPasswordReset(String username, String password)
        {
            HttpResponseMessage response;
            ApplicationUser user;

            response = new HttpResponseMessage(HttpStatusCode.PreconditionFailed);




             using (var context = new ApplicationDbContext())
            {
                var userStore = new UserStore<ApplicationUser>(context);
                var userManager = new UserManager<ApplicationUser>(userStore);

                user = userManager.FindByEmail(username);

                userManager.RemovePassword(user.Id);
                IdentityResult passwordChangeResult = userManager.AddPassword(user.Id, password);
                
                if (passwordChangeResult.Succeeded)
                {

                    response = new HttpResponseMessage(HttpStatusCode.OK);
                }
                else
                {
                    response.Content = new StringContent(passwordChangeResult.Errors.First());
                }

             }
            return (response);

        }
    }
}