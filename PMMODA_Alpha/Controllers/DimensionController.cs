using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PMMODA_Alpha.Models;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace PMMODA_Alpha.Controllers
{
    //    [Authorize]

    public class DimensionController : ApiController
    {

        Dimension[] dims = new Dimension[] 
        { 
            new Dimension { ID = 12, Name = "Application Development"}, 
            new Dimension { ID = 2, Name = "Consulting Engagements" }, 
            new Dimension { ID = 3, Name = "Training Materials" } 
        };

        public IEnumerable<Dimension> GetAllDimensions()
        {

            return dims;
        }


        // Get the dimensions defined for the current organization
        [Authorize]
        public HttpResponseMessage GetDimensionById(int Id)
        {
            Boolean status = false;
            Organization org;
            List<Dimension> values;
            // Declare a local variable to store the current company for the requester
            Company company;
            // Declare a variable to store the validation response
            HttpResponseMessage response;

            // Initialize the response to a fail state
            response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
            values = new List<Dimension>();

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
                    values = Dimension.LoadList(Id);
                    response = new HttpResponseMessage(HttpStatusCode.OK);
                    var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
                    String json = oSerializer.Serialize(values);
                    response.Content = new StringContent(json);
                }
            }

            return response;
        }

        [Authorize]
        public HttpResponseMessage PostDimension(Dimension item)
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
            response = this.Request.CreateResponse<Dimension>(HttpStatusCode.Unauthorized, item);

            // Ensure that the current org belongs to the same company as the requestor
            org = Organization.GetOrganizationByID(item.OrganizationID);
            if (org.CompanyID == company.CompanyID)
            {
                status = true;
            }
            else
            {
                response = this.Request.CreateResponse<Dimension>(HttpStatusCode.PreconditionFailed, item);
            }

            if (status)
            {
                // Make sure the current user has permissions for this operation
                response = PmmodaUser.ValidateAccess(org.Name, PmmodaUserMode.Admin);
            }
            if (response.StatusCode == HttpStatusCode.OK)
            {
                // TBD - Update currently not implemented. It is folded into Save
                newID = Dimension.Save(item);
                item.ID = newID;
                response = this.Request.CreateResponse<Dimension>(HttpStatusCode.OK, item);
            }

            return (response);

        }

        [Authorize]
        public HttpResponseMessage PutDimension(int ID,Dimension item)
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
            response = this.Request.CreateResponse<Dimension>(HttpStatusCode.Unauthorized, item);

            // Ensure that the current org belongs to the same company as the requestor
            org = Organization.GetOrganizationByID(item.OrganizationID);
            if (org.CompanyID == company.CompanyID)
            {
                status = true;
            }
            else
            {
                response = this.Request.CreateResponse<Dimension>(HttpStatusCode.PreconditionFailed, item);
            }

            if (status)
            {
                // Make sure the current user has permissions for this operation
                response = PmmodaUser.ValidateAccess(org.Name, PmmodaUserMode.Admin);
            }
            if (response.StatusCode == HttpStatusCode.OK)
            {
                // TBD - Update currently not implemented. It is folded into Save
                Dimension.Update(ID,item);
                response = this.Request.CreateResponse<Dimension>(HttpStatusCode.OK, item);
            }

            return (response);

        }


    }
}