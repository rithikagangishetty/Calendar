using MongoDB.Driver;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Main.Models;
using Microsoft.Extensions.Configuration;

namespace CalendarDb
{
    public class Login : ILogin
    {
        private readonly IMongoCollection<Connections> _LoginCollection;
        private readonly IConfiguration _configuration;
        public Login(IConfiguration configuration)
        {
            _configuration = configuration;
            var mongoClient = new MongoClient(
                  _configuration["ConnectionDb:ConnectionString"]);

            var mongoDatabase = mongoClient.GetDatabase(
                _configuration["ConnectionDb:DatabaseName"]);

            _LoginCollection = mongoDatabase.GetCollection<Connections>(
                 _configuration["ConnectionDb:UsersCollectionName"]);

        }
        public Connections login(string EmailId)
        {
            var filter = Builders<Connections>.Filter.Eq(u => u.EmailId, EmailId);
            var user = _LoginCollection.Find(filter).FirstOrDefault();
            return user;
        }
        public Connections signup(Connections EmailId)
        {

            _LoginCollection.InsertOne(EmailId);
            return EmailId;
        }
    }
}
