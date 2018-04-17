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
//    [Authorize]
    [RoutePrefix("api/Organization")]
    public class OrganizationController : ApiController
    {

        Organization[] orgs = new Organization[] 
        { 
//            new Organization { Id = 12, Name = "Application Development"}, 
//            new Organization { Id = 2, Name = "Consulting Engagements" }, 
//            new Organization { Id = 3, Name = "Training Materials" } 
        };

        [Authorize]
        public HttpResponseMessage GetAllOrganizations()
       {
           int newID;
           Boolean status = false;
           Organization org;
           List<Organization> values;
           // Declare a local variable to store the current company for the requester
           Company company;
           // Declare a variable to store the validation response
           HttpResponseMessage response;

           // Initialize the response to a fail state
           response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
           values = new List<Organization>();

           // Declare a local variable to store teh current requester Principal
           System.Security.Principal.IPrincipal user;
           // Get the current logged in user
           user = System.Web.HttpContext.Current.User;
           // Get the company corresponding to the current user
           company = PmmodaUser.GetByUser(user.Identity.Name);
           // Make sure the current user has permissions for this operation
           response = PmmodaUser.ValidateAccess("", PmmodaUserMode.Member);

           if (response.StatusCode == HttpStatusCode.OK)
           {
               values = Organization.LoadList(company.CompanyID);
               response = new HttpResponseMessage(HttpStatusCode.OK);
               var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
               String json = oSerializer.Serialize(values);
               response.Content = new StringContent(json);
           }
            return response;
        }

        [Authorize]
        public HttpResponseMessage GetOrganizationsByCompany(int CompanyID)
        {
            List<Organization> values;
            // Declare a local variable to store the current company for the requester
            Company company;
            // Declare a variable to store the validation response
            HttpResponseMessage response;

            // Initialize the response to a fail state
            response = new HttpResponseMessage(HttpStatusCode.OK);
            values = new List<Organization>();

            // Declare a local variable to store teh current requester Principal
            System.Security.Principal.IPrincipal user;
            // Get the current logged in user
            user = System.Web.HttpContext.Current.User;
            // Get the company corresponding to the current user
            company = PmmodaUser.GetByUser(user.Identity.Name);

            // Get the list of organizations
            values = Organization.LoadList(CompanyID);

            // Check to see if the current user has SuperUser permissions
            response = PmmodaUser.ValidateFormAccess(PmmodaUser.SuperUser);

            //If the user is not a SuperUser then you need to filter out all orgs where the user is not an admin
            if (response.StatusCode != HttpStatusCode.OK)
            {
                // Check to make sure it was an authorization issue
                if (response.StatusCode == HttpStatusCode.Unauthorized)
                {
                    // Check to see if the current user is a company admin
                    response = PmmodaUser.ValidateAccess("", PmmodaUserMode.Admin);
                    if (response.StatusCode != HttpStatusCode.OK)
                    {
                        // loop over theorganizations and delete any for which the current user is not an admin
                        int index = 0;
                        while (index < values.Count)
                        {
                            response = PmmodaUser.ValidateAccess(values[index].Name, PmmodaUserMode.Member);
                            if (response.StatusCode != HttpStatusCode.OK)
                            {
                                // Delete the current record
                                values.RemoveAt(index);
                            }
                            else
                            {
                                index++;
                            }

                        }
                    }

                }

            }

//            if (response.StatusCode == HttpStatusCode.OK)
//            {
            // Build the full response ot with the filtered results
                response = new HttpResponseMessage(HttpStatusCode.OK);
                var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
                String json = oSerializer.Serialize(values);
                response.Content = new StringContent(json);
//            }
            return response;
        }


        [Authorize]
        public HttpResponseMessage PostOrganization(Organization item)
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

            // Check to see if this request was made by a superuser
            response = PmmodaUser.ValidateFormAccess(PmmodaUser.SuperUser);

            // IF the current user is not a super user then the companies must match
            if (response.StatusCode != HttpStatusCode.OK)
            {
                // update the Company ID for teh current item
                item.CompanyID = company.CompanyID;
            }


            response = this.Request.CreateResponse<Organization>(HttpStatusCode.Unauthorized, item);

            // Make sure the current user has permissions for this operation
            response = PmmodaUser.ValidateAccess("",PmmodaUserMode.Admin);
            if (response.StatusCode == HttpStatusCode.OK)
            {
                // Add the new deliverable
                newID = Organization.Save(item);
                item.Id = newID;
                response = this.Request.CreateResponse<Organization>(HttpStatusCode.OK, item);
                //                    response = new HttpResponseMessage(HttpStatusCode.OK);
            }

            return (response);
        }

        [Authorize]
        public HttpResponseMessage PutOrganization(int id, [FromBody]Organization item)
        {
            int newID;
            Boolean status = false;
            Organization org;
            // Declare a local Organization that will be returned
            Organization returnOrg;
            List<NaturalUnit> values;
            // Declare a local variable to store the current company for the requester
            Company company;
            // Declare a variable to store the validation response
            HttpResponseMessage response;

            returnOrg = new Organization();

            // Initialize the response to a fail state
            response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
            values = new List<NaturalUnit>();

            // Declare a local variable to store teh current requester Principal
            System.Security.Principal.IPrincipal user;
            // Get the current logged in user
            user = System.Web.HttpContext.Current.User;
            // Get the company corresponding to the current user
            company = PmmodaUser.GetByUser(user.Identity.Name);
            // update the Company ID for teh current item
            item.CompanyID = company.CompanyID;

            // Crezte the default response
            response = this.Request.CreateResponse<Organization>(HttpStatusCode.Unauthorized, item);

            // Ensure that the current org belongs to the same company as the requestor
            org = Organization.GetOrganizationByID(item.Id);

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
                response = PmmodaUser.ValidateAccess(org.Name, PmmodaUserMode.Admin);
            }
            if (response.StatusCode == HttpStatusCode.OK)
            {
                // TBD - Update currently not implemented. It is folded into Save
                returnOrg = Organization.Update(item);
//                item.Id = newID;
                response = this.Request.CreateResponse<Organization>(HttpStatusCode.OK, returnOrg);
                //                    response = new HttpResponseMessage(HttpStatusCode.OK);
            }


            // Add the new deliverable
            return (response);
        }

        [Authorize]
        [Route("OrganizationFromWizard")]
        public HttpResponseMessage PostOrganizationFromWizard(Organization item, int appType, int staffModel)
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

            // Check to see if this request was made by a superuser
            response = PmmodaUser.ValidateFormAccess(PmmodaUser.SuperUser);

            // IF the current user is not a super user then the companies must match
            if (response.StatusCode != HttpStatusCode.OK)
            {
                // update the Company ID for teh current item
                item.CompanyID = company.CompanyID;
            }


            response = this.Request.CreateResponse<Organization>(HttpStatusCode.Unauthorized, item);

            // Make sure the current user has permissions for this operation
            response = PmmodaUser.ValidateAccess("", PmmodaUserMode.Admin);
            if (response.StatusCode == HttpStatusCode.OK)
            {
                // Add the new deliverable
                newID = Organization.Save(item);
                item.Id = newID;
                response = this.Request.CreateResponse<Organization>(HttpStatusCode.OK, item);
                // Add Component records for new organization
                Organization.InitializeOrganizationFromWizard(newID, company.CompanyID, user.Identity.Name , staffModel, appType);

 //                       public static int InitializeOrganizationFromWizard(int OrgID, int CompanyID, String alias, int staffingModelID, int appTypeID)

                //                    response = new HttpResponseMessage(HttpStatusCode.OK);
            }

            return (response);
        }

    }
}
