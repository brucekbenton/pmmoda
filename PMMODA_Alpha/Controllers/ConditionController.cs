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
    public class ConditionController : ApiController
    {

        [Authorize]
        public HttpResponseMessage GetConditions(int ProjectID)
        {
            List<Condition> values;
            // Declare a local variable to store the current company for the requester
            Company company;
            // Declare a variable to store the validation response
            HttpResponseMessage response;

            // Initialize the response to a fail state
            response = new HttpResponseMessage(HttpStatusCode.OK);

            // Declare a local variable to store teh current requester Principal
            System.Security.Principal.IPrincipal user;
            // Get the current logged in user
            user = System.Web.HttpContext.Current.User;
            // Get the company corresponding to the current user
            company = PmmodaUser.GetByUser(user.Identity.Name);

            values = new List<Condition>();

            // Check to see if the current user has SuperUser permissions
            response = PmmodaUser.ValidateFormAccess(PmmodaUser.SuperUser);

            //If the user is not a SuperUser then you need to verify access permissions
            if (response.StatusCode != HttpStatusCode.OK)
            {
                // Check to make sure it was an authorization issue
                if (response.StatusCode == HttpStatusCode.Unauthorized)
                {
                    // Check to see if the current user is a member of the current company
                    response = PmmodaUser.ValidateAccess("", PmmodaUserMode.Member);
                    if(response.StatusCode == HttpStatusCode.OK)
                    {
                        // load the requested data
                        values = Condition.LoadList(ProjectID);
                        var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
                        String json = oSerializer.Serialize(values);
                        response.Content = new StringContent(json);
                    }
                }

            }

            return response;
        }

        [Authorize]
        public HttpResponseMessage PostCondition(Condition item)
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
            response = this.Request.CreateResponse<Condition>(HttpStatusCode.OK, item);

            // Ensure that the current org belongs to the same company as the requestor
//            org = Organization.GetOrganizationByID(item.OrganizationID);
//            if (org.CompanyID == company.CompanyID)
//            {
//                status = true;
//            }
//            else
//            {
//                response = this.Request.CreateResponse<Condition>(HttpStatusCode.PreconditionFailed, item);
//            }

//            if (status)
//            {
                // Make sure the current user has permissions for this operation
//                response = PmmodaUser.ValidateAccess(org.Name, PmmodaUserMode.Member);
//            }
            if (response.StatusCode == HttpStatusCode.OK)
            {
                // TBD - Update currently not implemented. It is folded into Save
                newID = Condition.Save(item);
                item.ID = newID;
                response = this.Request.CreateResponse<Condition>(HttpStatusCode.OK, item);
            }

            return (response);

        }


        [Authorize]
        public HttpResponseMessage PutCondition(int projectID,Condition item)
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
            response = this.Request.CreateResponse<Condition>(HttpStatusCode.OK, item);

            if (response.StatusCode == HttpStatusCode.OK)
            {
                // TBD - Update currently not implemented. It is folded into Save
                Condition.Update(item);
//                item.ID = newID;
                response = this.Request.CreateResponse<Condition>(HttpStatusCode.OK, item);
            }

            return (response);

        }


        [Authorize]
        public HttpResponseMessage DeleteCondition(int projectID, Condition item)
        {
            // Declare a variable to store the validation response
            HttpResponseMessage response;


            Condition.Delete(projectID, item);

            response = this.Request.CreateResponse<Condition>(HttpStatusCode.OK, item);

            return (response);
        }
 
    }
}