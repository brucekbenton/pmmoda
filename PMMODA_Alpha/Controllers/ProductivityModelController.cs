using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PMMODA_Alpha.Models;
using System.Net.Http;
using System.Web.Http;
// Include for HttpStatusCode values
using System.Net;


namespace PMMODA_Alpha.Controllers
{
    public class ProductivityModelController : ApiController
    {
        ProductivityModel[] model = new ProductivityModel[]
            {
            new ProductivityModel { OrganizationID = 3,  UnitID = 1, DimensionID=1,LoNominalEffort=2.5,MedNominalEffort=5,HiNominalEffort=11}, 
            new ProductivityModel { OrganizationID = 4,  UnitID = 1, DimensionID=2,LoNominalEffort=2.5,MedNominalEffort=5,HiNominalEffort=11}, 
            };

        public IEnumerable<ProductivityModel> GetAllProjects()
        {

            return model;
        }


        [Authorize]
        public HttpResponseMessage GetNaturalUnitModelById(int Id)
        {
            Boolean status = false;
            Organization org;
            List<ProductivityModel> values;
            // Declare a local variable to store the current company for the requester
            Company company;
            // Declare a variable to store the validation response
            HttpResponseMessage response;


            // Initialize the response to a fail state
            response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
            values = new List<ProductivityModel>();

            // Declare a local variable to store teh current requester Principal
            System.Security.Principal.IPrincipal user;
            // Get the current logged in user
            user = System.Web.HttpContext.Current.User;
            // Get the company corresponding to the current user
            company = PmmodaUser.GetByUser(user.Identity.Name);


            // Create the default response
            response = new HttpResponseMessage(HttpStatusCode.Unauthorized);

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
            }
            if (response.StatusCode == HttpStatusCode.OK)
            {
                values = ProductivityModel.LoadList(Id);
//                var naturalUnitModel = ProductivityModel.LoadList(Id);

                response = new HttpResponseMessage(HttpStatusCode.OK);
                var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
                String json = oSerializer.Serialize(values);
                response.Content = new StringContent(json);
            }


            return (response);            


            
//            var naturalUnitModel = ProductivityModel.LoadList(Id);
//            return naturalUnitModel;
        }

        [Authorize]
        public HttpResponseMessage PutProductivityModel([FromBody]ProductivityModel item)
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

            // Declare a local variable to store teh current requester Principal
            System.Security.Principal.IPrincipal user;
            // Get the current logged in user
            user = System.Web.HttpContext.Current.User;
            // Get the company corresponding to the current user
            company = PmmodaUser.GetByUser(user.Identity.Name);

            // Ensure that the current org belongs to the same company as the requestor
            org = Organization.GetOrganizationByID(item.OrganizationID);
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
                    // Add the new deliverable
                    newID = ProductivityModel.Update(item);
                    response = this.Request.CreateResponse<ProductivityModel>(HttpStatusCode.OK, item);
                }
            }

            return (response);
        }

    }
}