using PMMODA_Alpha.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace PMMODA_Alpha.Controllers
{

    public class ProjectSummaryController : ApiController
    {


        public ProjectSummary GetProjectSummaryById(int ProjectID,int OrgID)
        {
            var filtered_projects = ProjectSummary.LoadSummary(ProjectID,OrgID);
            return filtered_projects;
        }

    }
}
