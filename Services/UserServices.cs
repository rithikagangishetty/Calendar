using Calenderwebapp.Models;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace Calenderwebapp.Services
{
    public class UserServices
  
    {
        private readonly IMongoCollection<UserDetails> _UsersCollection;

        public UserServices(
            IOptions<UserSettings> UserSettings)
        {
            var mongoClient = new MongoClient(
                UserSettings.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                UserSettings.Value.DatabaseName);

            _UsersCollection = mongoDatabase.GetCollection<UserDetails>(
                UserSettings.Value.UsersCollectionName);
        }

        public async Task<List<UserDetails>> Get() =>
            await _UsersCollection.Find(_ => true).ToListAsync();

        public async Task<List<UserDetails>> GetAsync(string Id) =>
            await _UsersCollection.Find(x => x.UserId == Id).ToListAsync();
        public async Task<UserDetails> GetObjectAsync(string Id) =>
           await _UsersCollection.Find(x => x._id == Id).FirstOrDefaultAsync();

        public async Task CreateAsync(UserDetails newUser) =>
            await _UsersCollection.InsertOneAsync(newUser);


        public async Task UpdateAsync( UserDetails updatedUser) =>
            await _UsersCollection.ReplaceOneAsync(x => x._id == updatedUser._id, updatedUser);

        public async Task RemoveAsync(  string id) =>
            await _UsersCollection.DeleteOneAsync(x => x._id == id);
    }
}

