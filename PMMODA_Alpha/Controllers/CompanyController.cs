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


namespace PMMODA_Alpha.Controllers
{
    [RoutePrefix("api/Company")]
    public class CompanyController : ApiController
    {

        [Authorize(Roles="SuperUser")]
        [Route("Company")]
        public IEnumerable<Company> GetAllCompanies()
        {

            var companies = Company.LoadList();
            return companies;
        }

        [Authorize]
        [Route("CompanyByUser")]
        // Get the company which contains the current user
        public HttpResponseMessage GetCompany()
        {
//            Boolean status = false;
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


                // Make sure the current user has permissions for this operation
                response = PmmodaUser.ValidateAccess("", PmmodaUserMode.Admin);
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    response = new HttpResponseMessage(HttpStatusCode.OK);
                    var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
                    String json = oSerializer.Serialize(company);
                    response.Content = new StringContent(json);
                }

            return response;

        }

        [Authorize(Roles = "SuperUser")]
        public HttpResponseMessage PostCompany(Company item)
        {
//            String alias;

            int newID;
            // Add the new deliverable
            newID = Company.Save(item);
            // Crate the Admin and Member roles correspoinding to the new company
            PmmodaUser.CreateRole(item.Name + "_Admin");
            PmmodaUser.CreateRole(item.Name + "_Member");
            // Get the response structure
            var response = this.Request.CreateResponse<Company>(HttpStatusCode.Created, item);

            string uri = Url.Link("DefaultApi", new { id = newID });
            response.Headers.Location = new Uri(uri);
            return (response);
        }

        [Authorize]
        public HttpResponseMessage PutCompany(Company item)
        {

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


            // Make sure the current user has permissions for this operation
            response = PmmodaUser.ValidateAccess("", PmmodaUserMode.Admin);
            if (response.StatusCode == HttpStatusCode.OK)
            {
                int newID;
                // Add the new deliverable
                newID = Company.Update(item);

                response = new HttpResponseMessage(HttpStatusCode.OK);
                var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
                String json = oSerializer.Serialize(company);
                response.Content = new StringContent(json);
            }

            return response;
            // Get the response structure
//            var response = this.Request.CreateResponse<Company>(HttpStatusCode.Created, item);

//            string uri = Url.Link("DefaultApi", new { id = newID });
//            response.Headers.Location = new Uri(uri);
//            return (response);
        }

    }
}
