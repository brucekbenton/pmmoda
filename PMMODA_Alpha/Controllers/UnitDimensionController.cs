using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PMMODA_Alpha.Models;
using System.Net.Http;
using System.Web.Http;
using System.Net;
using System.Web.Http.ModelBinding;

namespace PMMODA_Alpha.Controllers
{
    public class UnitDimensionController : ApiController
    {

        [Authorize]
        public HttpResponseMessage GetNaturalUnitById(int Id)
        {
            Boolean status = false;
            Organization org;
            List<UnitDimension> values;
            // Declare a local variable to store the current company for the requester
            Company company;
            // Declare a variable to store the validation response
            HttpResponseMessage response;

            // Initialize the response to a fail state
            response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
            values = new List<UnitDimension>();

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
                response = PmmodaUser.ValidateAccess(org.Name,PmmodaUserMode.Member);
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    values = UnitDimension.LoadList(Id);
                    response = new HttpResponseMessage(HttpStatusCode.OK);
                    var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
                    String json = oSerializer.Serialize(values);
                    response.Content = new StringContent(json);
                }
            }


            return response;
        }

        public void PutUnitDimension(int ID, [FromBody]UnitDimension item)
        {
            UnitDimension.Update(item);
        }

//        public void PutUnitDimension([FromBody]UnitDimension[] item)
//        {
//            UnitDimension.Update(item);
//        }



    }
}