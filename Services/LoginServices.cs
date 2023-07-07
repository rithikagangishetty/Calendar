using Calenderwebapp.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Calenderwebapp.Services
{
    public class LoginServices
    {
        private readonly IMongoCollection<Connections> _LoginCollection;

        public LoginServices(
            IOptions<ConnectionSettings> ConnectionSettings)
        {
            var mongoClient = new MongoClient(
                ConnectionSettings.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                ConnectionSettings.Value.DatabaseName);

            _LoginCollection = mongoDatabase.GetCollection<Connections>(
                ConnectionSettings.Value.UsersCollectionName);
        }
        public Connections Login(string EmailId)
        {
            var filter = Builders<Connections>.Filter.Eq(u => u.EmailId, EmailId);
            var user = _LoginCollection.Find(filter).FirstOrDefault();
            return user;
        }
        public Connections Signup(Connections EmailId)
        {

            _LoginCollection.InsertOne(EmailId);
            return EmailId;
        }
    }
}





