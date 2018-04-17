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
    [RoutePrefix("api/StaffingModel")]
    public class StaffingModelController : ApiController
    {
        /// <summary>
        /// Get the defined set of Staffing Models
        /// </summary>
        /// <returns></returns>
        public HttpResponseMessage GetAllStaffingModels()
        {
            List<StaffingModel> values;
            // Declare a variable to store the validation response
            HttpResponseMessage response;

            // Initialize the response to a fail state
            response = new HttpResponseMessage(HttpStatusCode.OK);
            values = new List<StaffingModel>();


            if (response.StatusCode == HttpStatusCode.OK)
            {
                values = StaffingModel.LoadList();
                response = new HttpResponseMessage(HttpStatusCode.OK);
                var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
                String json = oSerializer.Serialize(values);
                response.Content = new StringContent(json);
            }
            return response;
        }


        [Route("Activities")]
        public HttpResponseMessage GetModelMap(int ModelID)
        {
            List<ReferenceActivity> values;
            // Declare a variable to store the validation response
            HttpResponseMessage response;

            // Initialize the response to a fail state
            response = new HttpResponseMessage(HttpStatusCode.OK);
            values = new List<ReferenceActivity>();


            if (response.StatusCode == HttpStatusCode.OK)
            {
                values = ReferenceActivity.LoadList(ModelID);
                response = new HttpResponseMessage(HttpStatusCode.OK);
                var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
                String json = oSerializer.Serialize(values);
                response.Content = new StringContent(json);
            }
            return response;
        }
    }
}
