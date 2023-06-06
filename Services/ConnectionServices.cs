using Calenderwebapp.Models;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Core.Connections;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace Calenderwebapp.Services
{
    public class ConnectionServices
    {
        

            private readonly IMongoCollection<Connections> _ConnectionCollection;

            public ConnectionServices(
                IOptions<ConnectionSettings> ConnectionSettings)
            {
                var mongoClient = new MongoClient(
                    ConnectionSettings.Value.ConnectionString);

                var mongoDatabase = mongoClient.GetDatabase(
                    ConnectionSettings.Value.DatabaseName);

                _ConnectionCollection = mongoDatabase.GetCollection<Connections>(
                    ConnectionSettings.Value.UsersCollectionName);
            }


        public async Task<List<Connections>> Getasync() =>
    await _ConnectionCollection.Find(_ => true).ToListAsync();
        public async Task<Connections> GetAsync(string id) =>
                await _ConnectionCollection.Find(x => x._id == id).FirstOrDefaultAsync();
        public async Task<Connections> GetAsyncId(string EmailId) =>
           await _ConnectionCollection.Find(x => x.EmailId == EmailId).FirstOrDefaultAsync();
        public async Task CreateAsync(Connections newUser) =>
                await _ConnectionCollection.InsertOneAsync(newUser);
        public Connections Login(string EmailId)
        {
            var filter = Builders<Connections>.Filter.Eq(u => u.EmailId, EmailId);
            var user = _ConnectionCollection.Find(filter).FirstOrDefault();
            return user;
        }
        public async Task UpdateAsync(Connections connection, List<string> updatedConnection)
        {
            var filter = Builders<Connections>.Filter.Eq(u => u._id, connection._id);
           
            Connections newconnections = new Connections {
                _id = connection._id,
                EmailId=connection.EmailId,
                Connection=updatedConnection
                };
          
            await _ConnectionCollection.ReplaceOneAsync(filter,newconnections);
            

        }
        

        public async Task RemoveAsync(string id) =>
                await _ConnectionCollection.DeleteOneAsync(x => x._id == id);
        }
    }



