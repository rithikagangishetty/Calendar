using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Collections.Generic;

namespace Main.Models
{
    public class EmailDetails
    {
        [BsonId, BsonElement("_id"), BsonRepresentation(BsonType.ObjectId)]

        public string Body { get; set; }
        public string _id { get; set; }
        public string UserEmail { get; set; }
        public string EventName { get; set; }
        public List<string> Moderator { get; set; }
        public List<string> Connections { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string Subject { get; set; }
        public bool Delete { get; set; }
    }
}
