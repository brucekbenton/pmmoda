using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net.Mail;
using System.Net.Mime;

namespace PMMODA_Alpha.Models
{
    public enum ReportMethod {EMAIL};

    public struct ReportContent
    {
        public String content;
        public String Name;
    }

    public class Report
    {


        /// <summary>
        ///  DEclare  a function which will mail
        /// </summary>
        /// <param name="ProjectID"></param>
        /// <param name="emailAddress"></param>
        /// <returns></returns>
        public int DeliverableSummary(int OrgID, int ProjectID,String emailAddress, ReportMethod method)
        {
            // Declre an internal variable to track execution status
            int status = 0;
            List<Deliverable> deliverableContent;
            // Declare a local object to store the organization productivity model
            List<ProductivityModel> productivityModel;
            // Declare a local object to store the Natural Units for the current Organization
            List<NaturalUnit> naturalUnits;
            // Declare a local object to store the current unit name
            String unitName;

            String content = null;
            Attachment attachment;

            deliverableContent = new List<Deliverable>();
            deliverableContent = Deliverable.LoadList(ProjectID);

            productivityModel = new List<ProductivityModel>();
            productivityModel = ProductivityModel.LoadList(OrgID);

//            naturalUnits = new List<NaturalUnit>();
//            naturalUnits =  NaturalUnit.LoadList(OrgID);

            switch (method)
            {
                case ReportMethod.EMAIL:
                    // Declare a local object to store the report content
                    MailMessage message = new MailMessage();
                    message.To.Add(emailAddress);
                    message.Subject = "Deliverable Summary Report for Project " + ProjectID;
                    // Write the headers to the deliverable file
                    content = "Deliverable\tDeliverableID\tParentID\tDeliverable Description\tPercent Complete\tNatural Unit\tLow Complexity Count\tMedium Complexity Count\tHigh Complexity Count" + Environment.NewLine;
                    // loop over the deliverable set
                    foreach (Deliverable deliverable in deliverableContent)
                    {
                        content += deliverable.Name +"\t" + deliverable.ID + "\t" + deliverable.ParentID + "\t" + deliverable.Description + "\t" +
                           deliverable.PercentComplete +"\t" + deliverable.NaturalUnitName + "\t" + deliverable.LowCount + "\t" + 
                           deliverable.MedCount + "\t" + deliverable.HighCount + Environment.NewLine;
                    }


                    attachment = System.Net.Mail.Attachment.CreateAttachmentFromString(content, MediaTypeNames.Text.Plain);

                    attachment.Name = "Deliverable_Summary_Report";

                    message.Attachments.Add(attachment);

                    // Generate the Productivity Model attachment
                    content = "Natural Unit\tDescription\tDimension\tLow Complexity Effort (hours)\tMedium Complexity Effort (hours)\tHigh Complexity Effort (hours)" + Environment.NewLine;
                    // Loop over teh entries in the model
                    foreach (ProductivityModel model in productivityModel)
                    {
                        // loop over the Unit array to get the name of the current unit
  //                      unitName =
                        content += model.UnitName + "\t" + model.Description + "\t" + model.DimensionName + "\t" + model.LoNominalEffort + "\t" +
                            model.MedNominalEffort + "\t" + model.HiNominalEffort + Environment.NewLine;
                    }

                    attachment = System.Net.Mail.Attachment.CreateAttachmentFromString(content, MediaTypeNames.Text.Plain);

                    attachment.Name = "Productivity_Model_Report";

                    message.Attachments.Add(attachment);


                    status = Notification.SendReportMail(message);
                    break;
                default:
                    break;
            }


            return (status);
        }
    }
}