using System.Collections.Generic;

namespace Calenderwebapp.Models
{
    public class EmailDetails
    {

        public string Body { get; set; }
        public string UserEmail { get; set; }
        public string EventName { get; set; }
        public List<string> Moderator { get; set; }
        public List<string> Connections { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string Subject { get; set; }
    }
}
