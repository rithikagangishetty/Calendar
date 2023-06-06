
using System.Collections.Generic;
using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace Calenderwebapp.Models
{
    public class Connections
    {
        [BsonId, BsonElement("_id"), BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public string EmailId { get; set; }
        public List<string> Connection { get; set; }
    }
    
}
