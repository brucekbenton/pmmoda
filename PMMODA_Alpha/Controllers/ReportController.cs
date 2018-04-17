using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using PMMODA_Alpha.Models;

namespace PMMODA_Alpha.Controllers
{
    [RoutePrefix("api/Report")]
    public class ReportController : ApiController
    {

        [Route("DeliverableSummary")]
        public HttpResponseMessage GetDeliverableSummaryReport(int OrgID, int ProjectID,String emailAddress, ReportMethod method)
        {
            HttpResponseMessage response;
            int status;
            // Declre a local object to store the requested report
            Report newReport = new Report();

            response = new HttpResponseMessage(HttpStatusCode.OK);


            status = newReport.DeliverableSummary(OrgID, ProjectID, emailAddress, method);
            if (status != 0)
            {
                response = new HttpResponseMessage(HttpStatusCode.ServiceUnavailable);
            }

            return (response);
        }

    }
}
