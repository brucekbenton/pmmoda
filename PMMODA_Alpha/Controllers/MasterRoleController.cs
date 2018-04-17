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
    public class MasterRoleController : ApiController
    {


        /// <summary>
        /// Return the set of Master roles corresponding to the company containing the current requestor
        /// </summary>
        /// <returns></returns>
        [Authorize]
        public HttpResponseMessage GetMasterRoles()
        {
            List<MasterRole> values;
            // Declare a local variable to store the current company for the requester
            Company company;
            // Declare a variable to store the validation response
            HttpResponseMessage response;

            // Initialize the response to a fail state
            response = new HttpResponseMessage(HttpStatusCode.OK);
            values = new List<MasterRole>();

            // Declare a local variable to store teh current requester Principal
            System.Security.Principal.IPrincipal user;
            // Get the current logged in user
            user = System.Web.HttpContext.Current.User;
            // Get the company corresponding to the current user
            company = PmmodaUser.GetByUser(user.Identity.Name);


            // Get the list of organizations
            values = MasterRole.LoadByCompany(company.CompanyID);


            // Build the full response ot with the filtered results
            response = new HttpResponseMessage(HttpStatusCode.OK);
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
            String json = oSerializer.Serialize(values);
            response.Content = new StringContent(json);
            //            }
            return response;
        }

        [Authorize(Roles = "SuperUser")]
        public HttpResponseMessage GetMasterRolesByCompany(int CompanyID)
        {
            List<MasterRole> values;
            // Declare a local variable to store the current company for the requester
            Company company;
            // Declare a variable to store the validation response
            HttpResponseMessage response;

            // Initialize the response to a fail state
            response = new HttpResponseMessage(HttpStatusCode.OK);
            values = new List<MasterRole>();

            // Declare a local variable to store teh current requester Principal
            System.Security.Principal.IPrincipal user;
            // Get the current logged in user
            user = System.Web.HttpContext.Current.User;
            // Get the company corresponding to the current user
            company = PmmodaUser.GetByUser(user.Identity.Name);

            // Check to see if the current user has SuperUser permissions
            response = PmmodaUser.ValidateFormAccess(PmmodaUser.SuperUser);

            //If the user is not a SuperUser then you need to filter out all orgs where the user is not an admin
            if (response.StatusCode == HttpStatusCode.OK)
            {

                // Get the list of organizations
                values = MasterRole.LoadByCompany(CompanyID);

            }

            // Build the full response ot with the filtered results
            response = new HttpResponseMessage(HttpStatusCode.OK);
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
            String json = oSerializer.Serialize(values);
            response.Content = new StringContent(json);
            //            }
            return response;
        }

        public HttpResponseMessage PostMasterRole(MasterRole newRole)
        {
            int ID;
            List<MasterRole> values;
            // Declare a local variable to store the current company for the requester
            Company company;
            // Declare a variable to store the validation response
            HttpResponseMessage response;

            // Initialize the response to a fail state
            response = new HttpResponseMessage(HttpStatusCode.OK);
            values = new List<MasterRole>();

            // Declare a local variable to store teh current requester Principal
            System.Security.Principal.IPrincipal user;
            // Get the current logged in user
            user = System.Web.HttpContext.Current.User;
            // Get the company corresponding to the current user
            company = PmmodaUser.GetByUser(user.Identity.Name);

            // Check to see if this person is a SuperUser. If they are not then pass in the companyID for their current company
            response = PmmodaUser.ValidateFormAccess("SuperUser");
            if (response.StatusCode == HttpStatusCode.OK)
            {
                ID = MasterRole.Save(newRole.CompanyID, user.Identity.Name, newRole);

            }
            else
            {
                // Set the company ID to the current users company
                ID = MasterRole.Save(company.CompanyID, user.Identity.Name, newRole);
            }

            newRole.CompanyID = ID;
            // Build the full response ot with the filtered results
            response = new HttpResponseMessage(HttpStatusCode.OK);

            //            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
            //            String json = oSerializer.Serialize(values);
            //            response.Content = new StringContent(json);
            //            }
            return response;

        }
    }

}
