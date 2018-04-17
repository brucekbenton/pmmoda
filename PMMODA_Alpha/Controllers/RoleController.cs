using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PMMODA_Alpha.Models;
using System.Net.Http;
using System.Web.Http;
using System.Net;
//using PMMODA_utils;

namespace PMMODA_Alpha.Controllers
{
    [RoutePrefix("api/Role")]
    public class RoleController : ApiController
    {



        [Authorize]
        [Route("ActiveRoles")]
        public HttpResponseMessage GetActiveRoles(int OrganizationID)
        {

            Boolean status = false;
            Organization org;
            Project project;
            List<Role> values;
            // Declare a local variable to store the current company for the requester
            Company company;
            // Declare a variable to store the validation response
            HttpResponseMessage response;


            // Initialize the response to a fail state
            response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
            values = new List<Role>();

            // Declare a local variable to store teh current requester Principal
            System.Security.Principal.IPrincipal user;
            // Get the current logged in user
            user = System.Web.HttpContext.Current.User;
            // Get the company corresponding to the current user
            company = PmmodaUser.GetByUser(user.Identity.Name);


            // Create the default response
            response = new HttpResponseMessage(HttpStatusCode.Unauthorized);

            // Ensure that the current org belongs to the same company as the requestor
//            project = Project.getProjectByID(ProjectID);
            org = Organization.GetOrganizationByID(OrganizationID);

            if (org.CompanyID == company.CompanyID)
            {
                status = true;
            }
            else
            {
                response = new HttpResponseMessage(HttpStatusCode.PreconditionFailed);
            }

            if (status)
            {
                // Make sure the current user has permissions for this operation
                response = PmmodaUser.ValidateAccess(org.Name, PmmodaUserMode.Member);
            }
            if (response.StatusCode == HttpStatusCode.OK)
            {
                values = Role.LoadActiveRoles(OrganizationID);

                response = new HttpResponseMessage(HttpStatusCode.OK);
                var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
                String json = oSerializer.Serialize(values);
                response.Content = new StringContent(json);
            }


            return (response);

//            var roles = Role.LoadActiveRoles(ProjectID);

//            return roles;
        }

        [Authorize]
        [Route("AllRoles")]
        public HttpResponseMessage GetRoleByOrg(int Id)
        {

            Boolean status = false;
            Organization org;
            List<Role> values;
            // Declare a local variable to store the current company for the requester
            Company company;
            // Declare a variable to store the validation response
            HttpResponseMessage response;


            // Initialize the response to a fail state
            response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
            values = new List<Role>();

            // Declare a local variable to store teh current requester Principal
            System.Security.Principal.IPrincipal user;
            // Get the current logged in user
            user = System.Web.HttpContext.Current.User;
            // Get the company corresponding to the current user
            company = PmmodaUser.GetByUser(user.Identity.Name);


            // Create the default response
            response = new HttpResponseMessage(HttpStatusCode.Unauthorized);

            // Ensure that the current org belongs to the same company as the requestor
            org = Organization.GetOrganizationByID(Id);

            // Check to see if the current user is a super user
            response = PmmodaUser.ValidateFormAccess(PmmodaUser.SuperUser);
            if (response.StatusCode != HttpStatusCode.OK)
            {
                if (org.CompanyID == company.CompanyID)
                {
                    status = true;
                }
                else
                {
                    response = new HttpResponseMessage(HttpStatusCode.PreconditionFailed);
                }
            }
            else
            {
                status = true;
            }

            if (status)
            {
                // Make sure the current user has permissions for this operation
                response = PmmodaUser.ValidateAccess(org.Name, PmmodaUserMode.Member);
            }
            if (response.StatusCode == HttpStatusCode.OK)
            {
                values = Role.LoadList(Id);

                response = new HttpResponseMessage(HttpStatusCode.OK);
                var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
                String json = oSerializer.Serialize(values);
                response.Content = new StringContent(json);
            }


            return (response);
        }



        [Authorize]
        public HttpResponseMessage PutRole(Role item)
        {
            int newID;
            Boolean status = false;
            Organization org;
            // Declare a local variable to store the current company for the requester
            Company company;
            // Declare a variable to store the validation response
            HttpResponseMessage response;


            // Initialize the response to a fail state
            response = new HttpResponseMessage(HttpStatusCode.Unauthorized);

            // Declare a local variable to store teh current requester Principal
            System.Security.Principal.IPrincipal user;
            // Get the current logged in user
            user = System.Web.HttpContext.Current.User;
            // Get the company corresponding to the current user
            company = PmmodaUser.GetByUser(user.Identity.Name);


            // Create the default response
            response = this.Request.CreateResponse<Role>(HttpStatusCode.Unauthorized, item);

            // Ensure that the current org belongs to the same company as the requestor
            org = Organization.GetOrganizationByID(item.OrganizationID);

            
            // Check to see if the current use has super user rights
            response = PmmodaUser.ValidateFormAccess(PmmodaUser.SuperUser);
            // IF the current user is not a super user then the companies must match
            if (response.StatusCode != HttpStatusCode.OK)
            {
                if (org.CompanyID == company.CompanyID)
                {
                    status = true;
                }
                else
                {
                    response = this.Request.CreateResponse<Role>(HttpStatusCode.PreconditionFailed, item);
                }
            }
            else
            {
                status = true;
            }

            if (status)
            {
                // Make sure the current user has permissions for this operation
                response = PmmodaUser.ValidateAccess(org.Name, PmmodaUserMode.Member);
            }
            if (response.StatusCode == HttpStatusCode.OK)
            {
                // TBD - Update currently not implemented. It is folded into Save
                // Add the new deliverable
                newID = Role.Update(item);
                item.ID = newID;
                response = this.Request.CreateResponse<Role>(HttpStatusCode.OK, item);
            }

            return (response);
        }

    }
}