using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;

namespace PMMODA_Alpha.Models
{
    public class Notification
    {
        public String ToAddress { get; set; }
        public String FromAddress { get; set; }
        public String Subject { get; set; }
        public String Body { get; set; }
        public String Username { get; set; }
        public String Password { get; set; }
        public String Attachment1 { get; set; }
        public String Attachment2 { get; set; }

        public Notification()
        {
            ToAddress = "";
            FromAddress = "";
            Subject = "";
        }

        public static int SendNewAccountNotification(MailMessage message, String username, String password)
        {
            int status = 0;
//            SmtpClient client = new SmtpClient();

            // Instantiate a mail message to store the content
//            MailMessage newMessage = new MailMessage();
//            if (ToAddress != "")
//            {
//                newMessage.To.Add(new MailAddress(this.ToAddress));
//            }
//            else
//            {
//                status = -1;
//            }


//            if (status == 0)
//            {
                // check to make sure the from address is valied
//                if (this.Subject != "")
//                {
//                    newMessage.Subject = this.Subject;

//                }
//                else
//                {
//                    status = -1;
//                }
//            }

            message.Body = "The requested username and password are specified below. Please ensure this is the appropriae individual. " +
    "Also, please let them know that they may change their password at any time using the self-service feature in PMMODA." +
    " This feature can be found at [Administration=>Change Password]. \n\n Username: " + username + "\n Password: " + password +
    "\n http://pmmoda.com/  \n\nWe are currently conducting our Beta testing and we appreciate" +
    " your participation in this effort. We have put a lot of work into this product and believe that you will find a lot " +
    " of value in the functionality we have provided. However, we understand that the product is not finished yet and we" +
    " appreciate any and all feedback you can provide. We are interested in any bugs you encounter as well as any thoughts" +
    " you may have on missing features. Obviously there are only so many features we can get into the initial release of this" +
    " product but we do have a little time left for any key missing pieces and we need your help to identify those. \n\n" +
    "Please send all questions and comments to Support@Trunbe.com and we will respond within 24 hours (usually much less) with initial feedback. \n\n" +
    "Sincerely, \nBruce Benton \nPresident \nTruNBE LLC";

            // Add the support alias to the distribution line also
            message.To.Add("bbenton@trunbe.com");

            status = Notification.SendMail(message);

            return (status);
        }

        public static int SendReportMail(MailMessage message)
        {
            int status = 0;
//            System.Net.Mail.Attachment attachment;
//            MailMessage message = new MailMessage();

//            message.To.Add(this.ToAddress);
//            message.Subject = this.Subject;
//            message.Body = this.Body;

            // Convert the srtring to an attachment and attach to the current mail message
//            attachment = System.Net.Mail.Attachment.CreateAttachmentFromString(this.Attachment, MediaTypeNames.Text.Plain);

//            attachment.Name = "Deliverable_Summary_Report";

//            message.Attachments.Add(attachment);


            status = Notification.SendMail(message);
            return (status);
        }

        public static int SendMail(MailMessage message)
        {
            int status = 0;

            SmtpClient client = new SmtpClient();



//            newMessage.Body = "sample message";


//            SmtpClient client = new SmtpClient("smtp.gmail.com", 587);
 //           SmtpClient client = new SmtpClient("smtp.secureserver.net");
//            client.Port = 465;

            // GMAIL host name
//           client.Host = "smtp.gmail.com";

            // Go Daddy hostname
//           client.Host = "smtpout.secureserver.net";

            // gmail SSL port
//           client.Port = 587;

            // Go Daddy SSL port
//            client.Port = 80;

//            client.EnableSsl = true;
//            client.DeliveryMethod = SmtpDeliveryMethod.Network;
//            client.UseDefaultCredentials = false;

            // Gmail credentials
//            client.Credentials = new NetworkCredential("brucekbenton@gmail.com", "Ellie11!");

            // Go Daddy credentials
//            client.Credentials = new NetworkCredential("support@trunbe.com", "TruNBE1!");

//            MailMessage test = new MailMessage("support@trunbe.com", "bbenton@trunbe.com", "test subject", "test body");

            try
            {
                client.Send(message);
            }
            catch (Exception e)
            {
                // check the exception and log it
            }

            return (status);
        }

        
    }
}