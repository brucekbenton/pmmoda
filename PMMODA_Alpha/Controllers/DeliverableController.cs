using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PMMODA_Alpha.Models;
using System.Net.Http;
using System.Web.Http;
using System.Net;


namespace PMMODA_Alpha.Controllers
{
    public class DeliverableController:ApiController
    {

        [Authorize]
        public HttpResponseMessage GetDeliverableById(int projectID)
        {
            Boolean status = false;
            Organization org;
            Project project;
            List<Deliverable> values;
            // Declare a local variable to store the current company for the requester
            Company company;
            // Declare a variable to store the validation response
            HttpResponseMessage response;

            // Initialize the response to a fail state
            response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
            values = new List<Deliverable>();

            // Declare a local variable to store teh current requester Principal
            System.Security.Principal.IPrincipal user;
            // Get the current logged in user
            user = System.Web.HttpContext.Current.User;
            // Get the company corresponding to the current user
            company = PmmodaUser.GetByUser(user.Identity.Name);

            // get the current project record
            project = Project.getProjectByID(projectID);
            // Ensure that the current org belongs to the same company as the requestor
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
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    values = Deliverable.LoadList(projectID);
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
        public HttpResponseMessage PostDeliverable(Deliverable item)
        {
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

            // Get the project associated with the current deliverable
            project = Project.getProjectByID(item.ProjectID);
            // Ensure that the current org belongs to the same company as the requestor
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
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    Deliverable.Save(item, item.UserID); // currently hardcoded to my user ID
                    response = this.Request.CreateResponse<Deliverable>(HttpStatusCode.Created, item);
                }
            }
           return (response);
        }

        [Authorize]
        public  HttpResponseMessage PutDeliverable(Deliverable item)
        {

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

            // Get the project associated with the current deliverable
            project = Project.getProjectByID(item.ProjectID);
            // Ensure that the current org belongs to the same company as the requestor
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
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    // Update the current deliverable
                    Deliverable.Update(item,user.Identity.Name);
                    //                   newID = Organization.Save(item);
                    //                    item. = newID;
                    response = this.Request.CreateResponse<Deliverable>(HttpStatusCode.OK, item);
                    //                    response = new HttpResponseMessage(HttpStatusCode.OK);
                }
            }

//            Deliverable.Update(item);
            return (response);
        }

    }
}