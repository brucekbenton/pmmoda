using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net.Http;
using System.Web.Http;
using System.Net;
using PMMODA_Alpha.Models;
//using System.Net.Http;




namespace PMMODA_Alpha.Controllers
{
    public class NaturalUnitModelController : ApiController
    {

        NaturalUnitModel[] model = new NaturalUnitModel[]
            {
            new NaturalUnitModel { ID = 3,  NaturalUnitID = 1, RoleID=1,Role="Developer",LoEffort=2.5,MedEffort=5,HiEffort=11}, 
            new NaturalUnitModel { ID = 4,  NaturalUnitID = 1, RoleID=2,Role="SDET",LoEffort=2.5,MedEffort=5,HiEffort=11}, 
            };

        public IEnumerable<NaturalUnitModel> GetAllModels()
        {


            return model;
        }


        [HttpGet]
        [Authorize]
        public HttpResponseMessage GetNaturalUnitModelByID(int UnitID, int OrgID)
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
            org = Organization.GetOrganizationByID(OrgID);
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
                    values = NaturalUnitModel.LoadList(UnitID, OrgID);
                    response = new HttpResponseMessage(HttpStatusCode.OK);
                    var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
                    String json = oSerializer.Serialize(values);
                    response.Content = new StringContent(json);
                }
            }

            return response;
        }

        public void PutNaturalUnitModel(NaturalUnitModel sprint)
        {
            NaturalUnitModel.Update(sprint);
        }


    }
}