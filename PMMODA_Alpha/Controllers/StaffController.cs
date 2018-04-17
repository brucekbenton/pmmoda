using PMMODA_Alpha.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace PMMODA_Alpha.Controllers
{
    public class StaffController : ApiController
    {

        [Authorize]
        // Get the current staffing values for the specified project
        public HttpResponseMessage GetStaffById(int Id)
        {
            Boolean status = false;
            Organization org;
            Project project;
            List<Staff> values;
            // Declare a local variable to store the current company for the requester
            Company company;
            // Declare a variable to store the validation response
            HttpResponseMessage response;


            // Initialize the response to a fail state
            response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
            values = new List<Staff>();

            // Declare a local variable to store teh current requester Principal
            System.Security.Principal.IPrincipal user;
            // Get the current logged in user
            user = System.Web.HttpContext.Current.User;
            // Get the company corresponding to the current user
            company = PmmodaUser.GetByUser(user.Identity.Name);


            // Create the default response
            response = new HttpResponseMessage(HttpStatusCode.Unauthorized);

            // Ensure that the current org belongs to the same company as the requestor
            project = Project.getProjectByID(Id);
            org = Organization.GetOrganizationByID(project.OrganizationID);

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
                values = Staff.LoadStaff(Id);

                response = new HttpResponseMessage(HttpStatusCode.OK);
                var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
                String json = oSerializer.Serialize(values);
                response.Content = new StringContent(json);
            }


            return (response);            
        }

        [Authorize]
        // Update the staffing data for the specified project
        public HttpResponseMessage putStaff(int id, Staff item)
        {
            int newID;
            Boolean status = false;
            Organization org;
            Project project;
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
            response = this.Request.CreateResponse<Staff>(HttpStatusCode.Unauthorized, item);

            // Ensure that the current org belongs to the same company as the requestor
            project = Project.getProjectByID(id);
            org = Organization.GetOrganizationByID(project.OrganizationID);
            if (org.CompanyID == company.CompanyID)
            {
                status = true;
            }
            else
            {
                response = this.Request.CreateResponse<Staff>(HttpStatusCode.PreconditionFailed, item);
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
                Staff.Update(item);
                response = this.Request.CreateResponse<Staff>(HttpStatusCode.OK, item);
            }

            return (response);

        }

    }
}
