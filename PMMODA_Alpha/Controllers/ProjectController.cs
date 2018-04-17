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



namespace PMMODA_Alpha.Controllers
{
    public class ProjectController : ApiController
    {
        Project[] projects = new Project[] 
        { 
            new Project { ID = 3, OrganizationID=1, Name = "Framework"}, 
            new Project { ID = 4, OrganizationID=1, Name = "Product Backlog" }, 
            new Project { ID = 7, OrganizationID=1, Name = "Sprint Backlog" }, 
            new Project { ID = 8, OrganizationID=7, Name = "MB2E" },
            new Project { ID = 9, OrganizationID=7, Name = "Needs Analysis" }, 
            new Project { ID = 14, OrganizationID=7, Name = "Domain Modeling" } 
        };

        [Authorize]
        public IEnumerable<Project> GetAllProjects()
        {
            return projects;
        }
        
        [Authorize]
        public HttpResponseMessage GetProjectById(int Id)
        {
            
            Organization org;
            HttpResponseMessage accessStatus;
            List<Project> results;

            HttpResponseMessage response;


            results = new List<Project>();

            org = Organization.GetOrganizationByID(Id);

            accessStatus = PmmodaUser.ValidateAccess(org.Name, PmmodaUserMode.Member);
            if (accessStatus.StatusCode == HttpStatusCode.OK)
            {
                results = Project.LoadList(Id);
                response = new HttpResponseMessage(HttpStatusCode.OK);
                var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
                String json = oSerializer.Serialize(results);
                response.Content = new StringContent(json);
            }
            else
            {
                response = new HttpResponseMessage(HttpStatusCode.Unauthorized);

            }

            return response;
        }
/*
        public HttpResponseMessage PostProject(Project item)
        {
            int newID;
            // Add the new deliverable
            newID = Project.Save(item);

            // Get the response structure
            var response = this.Request.CreateResponse<Project>(HttpStatusCode.Created, item);

            string uri = Url.Link("DefaultApi", new { id = newID });
            response.Headers.Location = new Uri(uri);
            return (response);
        }
*/
        [Authorize]
        public HttpResponseMessage postProject(Project item)
        {
            int newID;
            Boolean status = false;
            Organization org;
            List<NaturalUnit> values;
            // Declare a local variable to store the current company for the requester
            Company company;
            // Declare a variable to store the validation response
            HttpResponseMessage response;


            // Initialize the response to a fail state
            response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
            values = new List<NaturalUnit>();

            // Declare a local variable to store teh current requester Principal
            System.Security.Principal.IPrincipal user;
            // Get the current logged in user
            user = System.Web.HttpContext.Current.User;
            // Get the company corresponding to the current user
            company = PmmodaUser.GetByUser(user.Identity.Name);


            // Create the default response
            response = this.Request.CreateResponse<Project>(HttpStatusCode.Unauthorized, item);

            // Ensure that the current org belongs to the same company as the requestor
            org = Organization.GetOrganizationByID(item.OrganizationID);
            if (org.CompanyID == company.CompanyID)
            {
                status = true;
            }
            else
            {
                response = this.Request.CreateResponse<Project>(HttpStatusCode.PreconditionFailed, item);
            }

            if (status)
            {
                // Make sure the current user has permissions for this operation
                response = PmmodaUser.ValidateAccess(org.Name, PmmodaUserMode.Admin);
            }
            if (response.StatusCode == HttpStatusCode.OK)
            {
                // TBD - Update currently not implemented. It is folded into Save
                newID = Project.Save(item);
                item.ID = newID;
                //                item.Id = newID;
                response = this.Request.CreateResponse<Project>(HttpStatusCode.OK, item);
                //                    response = new HttpResponseMessage(HttpStatusCode.OK);
            }

            return (response);
        }

        
        [Authorize]
        public HttpResponseMessage putProject(int id, Project item)
        {
            Boolean status = false;
            Organization org;
            List<NaturalUnit> values;
            // Declare a local variable to store the current company for the requester
            Company company;
            // Declare a variable to store the validation response
            HttpResponseMessage response;

            // Initialize the response to a fail state
            response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
            values = new List<NaturalUnit>();

            // Declare a local variable to store teh current requester Principal
            System.Security.Principal.IPrincipal user;
            // Get the current logged in user
            user = System.Web.HttpContext.Current.User;
            // Get the company corresponding to the current user
            company = PmmodaUser.GetByUser(user.Identity.Name);


            // Create the default response
            response = this.Request.CreateResponse<Project>(HttpStatusCode.Unauthorized, item);

            // Ensure that the current org belongs to the same company as the requestor
            org = Organization.GetOrganizationByID(item.OrganizationID);
            if (org.CompanyID == company.CompanyID)
            {
                status = true;
            }
            else
            {
                response = this.Request.CreateResponse<Project>(HttpStatusCode.PreconditionFailed, item);
            }

            if (status)
            {
                // Make sure the current user has permissions for this operation
                response = PmmodaUser.ValidateAccess(org.Name, PmmodaUserMode.Admin);
            }
            if (response.StatusCode == HttpStatusCode.OK)
            {
                // TBD - Update currently not implemented. It is folded into Save
                Project.Update(item);
                //                item.Id = newID;
                response = this.Request.CreateResponse<Project>(HttpStatusCode.OK, item);
                //                    response = new HttpResponseMessage(HttpStatusCode.OK);
            }

            return (response);

            
            
        }

    }
}
