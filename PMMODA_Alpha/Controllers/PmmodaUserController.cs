using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
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

namespace PMMODA_Alpha.Controllers
{
    [Authorize]
    [RoutePrefix("api/PmmodaUser")]
    public class PmmodaUserController : ApiController
    {

       /// <summary>
       ///  Declare a method to return the current user ID and name
       /// </summary>
       /// <param name="role"></param>
       /// <returns></returns>
        public HttpResponseMessage GetCurrentUser()
        {
            Company company;

            HttpResponseMessage response;

            // Initialize the response to a success state
            response = new HttpResponseMessage(HttpStatusCode.OK);


            PmmodaUser newUser = new PmmodaUser();
            // Declare a local variable to store teh current requester Principal
            System.Security.Principal.IPrincipal user;
            // Get the current logged in user
            user = System.Web.HttpContext.Current.User;
            newUser.Email = user.Identity.Name;

            company = GetByUser(newUser.Email);
            newUser.CompanyID = company.CompanyID;

//            result = PmmodaUser.ValidateFormAccess(role);

            //            if (result.StatusCode == HttpStatusCode.OK)
            //            {
            //            }

//            newUser = PmmodaUser.GetByUser(user.Identity.Name);
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
            String json = oSerializer.Serialize(newUser);
            response.Content = new StringContent(json);

            return (response);
        }

        public HttpResponseMessage GetAccess(String role)
        {
            HttpResponseMessage result;
            PmmodaUser newUser = new PmmodaUser();

            result = PmmodaUser.ValidateFormAccess(role);

//            if (result.StatusCode == HttpStatusCode.OK)
//            {
            var response = this.Request.CreateResponse<PmmodaUser>(result.StatusCode, newUser);
//            }



            return (response);
        }

        public Company GetByUser(String username)
        {
            Company result;

            result = PmmodaUser.GetByUser(username);

            return (result);
        }


        public HttpResponseMessage GetByUser()
        {
            Company result;

//            Boolean status = false;
 //           Organization org;
//            Project project;
//            List<PmmodaUser> values;
            // Declare a local variable to store the current company for the requester
//            Company company;
            // Declare a variable to store the validation response
            HttpResponseMessage response;

            // Initialize the response to a success state
            response = new HttpResponseMessage(HttpStatusCode.OK);
//            values = new List<PmmodaUser>();

            // Declare a local variable to store teh current requester Principal
            System.Security.Principal.IPrincipal user;
            // Get the current logged in user
            user = System.Web.HttpContext.Current.User;
            // Get the company corresponding to the current user
//            company = PmmodaUser.GetByUser();


            result = PmmodaUser.GetByUser(user.Identity.Name);
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
            String json = oSerializer.Serialize(result);
            response.Content = new StringContent(json);

            return (response);
        }


        [Route("UserRoles")]
        public HttpResponseMessage GetUserRolesByCompany(int CompanyID)
        {
            Boolean status = false;
            Organization org;
            Project project;
            List<PmmodaUser> values;
            // Declare a local variable to store the current company for the requester
            Company company;
            // Declare a variable to store the validation response
            HttpResponseMessage response;

            // Initialize the response to a fail state
            response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
            values = new List<PmmodaUser>();

            // Declare a local variable to store teh current requester Principal
            System.Security.Principal.IPrincipal user;
            // Get the current logged in user
            user = System.Web.HttpContext.Current.User;
            // Get the company corresponding to the current user
            company = PmmodaUser.GetByUser(user.Identity.Name);

            // Ensure that the current user belongs to the same company as the passed in value
            /*
            if (company.CompanyID == CompanyID)
            {
                status = true;
            }
            else
            {
                response = new HttpResponseMessage(HttpStatusCode.PreconditionFailed);
            }
            */

            if (true)
            {
                // Make sure the current user has permissions for this operation
                response = PmmodaUser.ValidateAccess("", PmmodaUserMode.Admin);
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    values = PmmodaUser.LoadUserRoleList(CompanyID);
                    response = new HttpResponseMessage(HttpStatusCode.OK);
                    var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
                    String json = oSerializer.Serialize(values);
                    response.Content = new StringContent(json);
                }
            }

            //            var deliverables = Deliverable.LoadList(Id);
            return response;
        }

       /// <summary>
       ///  Declare a method to return the list of users assigned to the specified company
       /// </summary>
       /// <param name="CompanyID"></param>
       /// <returns></returns>
        [Authorize]
        [Route("Users")]

        public HttpResponseMessage GetUserUsersByCompany(int CompanyID)
        {
            Boolean status = false;
            Organization org;
            Project project;
            List<PmmodaUser> values;
            // Declare a local variable to store the current company for the requester
            Company company;
            // Declare a variable to store the validation response
            HttpResponseMessage response;

            // Initialize the response to a fail state
            response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
            values = new List<PmmodaUser>();

            // Declare a local variable to store teh current requester Principal
            System.Security.Principal.IPrincipal user;
            // Get the current logged in user
            user = System.Web.HttpContext.Current.User;
            // Get the company corresponding to the current user
            company = PmmodaUser.GetByUser(user.Identity.Name);

            // Ensure that the current user belongs to the same company as the passed in value
            /*
            if (company.CompanyID == CompanyID)
            {
                status = true;
            }
            else
            {
                response = new HttpResponseMessage(HttpStatusCode.PreconditionFailed);
            }
            */

            if (true)
            {
                // Make sure the current user has permissions for this operation
                response = PmmodaUser.ValidateAccess("", PmmodaUserMode.Admin);
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    values = PmmodaUser.LoadUsersByCompany(CompanyID);
                    response = new HttpResponseMessage(HttpStatusCode.OK);
                    var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
                    String json = oSerializer.Serialize(values);
                    response.Content = new StringContent(json);
                }
            }

            //            var deliverables = Deliverable.LoadList(Id);
            return response;
        }


        [Authorize]
//        [AllowAnonymous]
        public async Task<IHttpActionResult> PostRole(String role)
        {
            using (var context = new ApplicationDbContext())
            {
                var roleStore = new RoleStore<IdentityRole>(context);
                var roleManager = new RoleManager<IdentityRole>(roleStore);

                await roleManager.CreateAsync(new IdentityRole() { Name = role });
            }

            return Ok();

        }

        [Authorize]
        public HttpResponseMessage PostUserRole(String username, String role)
        {
            HttpResponseMessage response;

            response = new HttpResponseMessage(HttpStatusCode.OK);

            response = PmmodaUser.ValidateAccess("", PmmodaUserMode.Admin);
            if (response.StatusCode == HttpStatusCode.OK)
            {
                PmmodaUser.AddUserToRole(username, role);
            }

            return (response);
        }


        [Authorize]
        public HttpResponseMessage DeleteUserRole(String username, String role)
        {
            HttpResponseMessage response;

            response = new HttpResponseMessage(HttpStatusCode.OK);

            response = PmmodaUser.ValidateAccess("", PmmodaUserMode.Admin);
            if (response.StatusCode == HttpStatusCode.OK)
            {
                PmmodaUser.RemoveUserFromRole(username, role);
            }

            return (response);
        }


        [Authorize(Roles = "SuperUser")]
//        [AllowAnonymous]
        public HttpResponseMessage PostUser(PmmodaUser item,Boolean notify)
        {
            String alias;
            HttpResponseMessage response;

            int newID;
            response = new HttpResponseMessage(HttpStatusCode.OK);
            response = PmmodaUser.ValidateAccess("", PmmodaUserMode.Admin);
            if (response.StatusCode == HttpStatusCode.OK)
            {
                // Add the new deliverable
                newID = PmmodaUser.Save(item);
            }

            // Get the company for the new user
            // Get the company corresponding to the current user
            Company company = PmmodaUser.GetByUser(item.Username);


            // Notify the new user if this registration process succeeded and notification is selected
            if (response.StatusCode == HttpStatusCode.OK && notify)
            {
                MailMessage newNotification = new MailMessage();
                // Add the company contact to the alias
                newNotification.To.Add(company.ContactAlias);
                // Add the new alias to the email also
                newNotification.To.Add(item.Email);
//                newNotification.FromAddress = "support@trunbe.com";
                newNotification.Subject = "Your requested PMMODA user account has been created";
//                newNotification.Username = item.Username;
//                newNotification.Password = item.Password;

                Notification.SendNewAccountNotification(newNotification,item.Username,item.Password);
            }

            return (response);
        }


        // Declare a  service for System Admin Password Resets
        [Authorize(Roles = "SuperUser")]
        [Route("SystemPasswordReset")]
        public HttpResponseMessage PutUpdatedPassword(String username, String password)
        {
            HttpResponseMessage response;

            response = new HttpResponseMessage(HttpStatusCode.OK);

            response = PmmodaUser.SystemPasswordReset(username,password);

            return (response);
        }
    }
}
