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
    public class DeliverableModelController : ApiController
    {

        public IEnumerable<DeliverableModel> GetDeliverableModelById(int Id)
        {

            var deliverables = DeliverableModel.LoadList(Id);
            return deliverables;
        }


        public HttpResponseMessage PostDeliverableModel(DeliverableModel item)
        {
            // Add the new deliverable
            DeliverableModel.Save(item); 
            // Get the response structure
            var response = this.Request.CreateResponse<DeliverableModel>(HttpStatusCode.Created, item);

            string uri = Url.Link("DefaultApi", new { id = item.ID });
            response.Headers.Location = new Uri(uri);
            return (response);
        }

        public void PutSprint(DeliverableModel item)
        {
            DeliverableModel.Update(item);
        }


        public void DeleteDeliverableModel(DeliverableModel item)
        {
            DeliverableModel.Delete(item);
        }

    }
}