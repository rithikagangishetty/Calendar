using System.Collections.Generic;
using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace Calenderwebapp.Models
{
    public class UserDetails
    {


    
        [BsonId,BsonElement("_id"), BsonRepresentation(BsonType.ObjectId)]
       


        public string _id { get; set; }
        public string UserId { get; set; }
        public string EventName { get; set; }
        public List<string> Connections { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
       
}
}
