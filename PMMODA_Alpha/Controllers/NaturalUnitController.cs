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
    public class NaturalUnitController : ApiController
    {
        NaturalUnit[] tasks = new NaturalUnit[] 
        { 
            new NaturalUnit { ID = 3,  Name = "task 1", Description="sample"}, 
            new NaturalUnit { ID = 4, Name = "task 2" , Description="sample"}, 
            new NaturalUnit { ID = 7, Name = "task 3" , Description="sample"}, 
            new NaturalUnit { ID = 8, Name = "task 4" , Description="sample"},
            new NaturalUnit { ID = 9, Name = "task 5" , Description="sample"}, 
            new NaturalUnit { ID = 14, Name = "task 6" , Description="sample"} 
        };

        public IEnumerable<NaturalUnit> GetAllProjects()
        {
            return tasks;
        }


//                public IEnumerable<Task> GetTaskByID(int Id)

        [Authorize]
        public HttpResponseMessage GetNaturalUnitById(int Id)
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

            // Ensure that the current org belongs to the same company as the requestor
            org = Organization.GetOrganizationByID(Id);
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
                    values = NaturalUnit.LoadList(Id);
                    response = new HttpResponseMessage(HttpStatusCode.OK);
                    var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
                    String json = oSerializer.Serialize(values);
                    response.Content = new StringContent(json);
                }
            }

            return response;
        }

        public HttpResponseMessage PostNaturalUnit(NaturalUnit item)
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
            response = this.Request.CreateResponse<NaturalUnit>(HttpStatusCode.Unauthorized, item);

            // Ensure that the current org belongs to the same company as the requestor
            org = Organization.GetOrganizationByID(item.OrganizationID);
            if (org.CompanyID == company.CompanyID)
            {
                status = true;
            }
            else
            {
                response = this.Request.CreateResponse<NaturalUnit>(HttpStatusCode.PreconditionFailed, item);
            }

            if (status)
            {
                // Make sure the current user has permissions for this operation
                response = PmmodaUser.ValidateAccess(org.Name, PmmodaUserMode.Admin);
            }
            if (response.StatusCode == HttpStatusCode.OK)
            {
                // TBD - Update currently not implemented. It is folded into Save
                newID = NaturalUnit.Save(item);
                item.ID = newID;
                response = this.Request.CreateResponse<NaturalUnit>(HttpStatusCode.OK, item);
            }

            return (response);

        }

        [Authorize]
        public HttpResponseMessage PutNaturalUnit(NaturalUnit item)
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
            response = this.Request.CreateResponse<NaturalUnit>(HttpStatusCode.Unauthorized, item);

            // Ensure that the current org belongs to the same company as the requestor
            org = Organization.GetOrganizationByID(item.OrganizationID);
            if (org.CompanyID == company.CompanyID)
            {
                status = true;
            }
            else
            {
                response = this.Request.CreateResponse<NaturalUnit>(HttpStatusCode.PreconditionFailed, item);
            }

            if (status)
            {
                // Make sure the current user has permissions for this operation
                response = PmmodaUser.ValidateAccess(org.Name, PmmodaUserMode.Admin);
            }
            if (response.StatusCode == HttpStatusCode.OK)
            {
                // TBD - Update currently not implemented. It is folded into Save
                NaturalUnit.Update(item);
                response = this.Request.CreateResponse<NaturalUnit>(HttpStatusCode.OK, item);
            }

            return (response);
        }


    }
}