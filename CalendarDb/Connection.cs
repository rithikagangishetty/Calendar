using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Main.Models;
using Microsoft.Extensions.Configuration;


namespace CalendarDb
{
    public class Connection :IConnections
    {
       
        private IConfiguration _configuration;
        private readonly IMongoCollection<Connections> _ConnectionCollection;
        public Connection(IConfiguration configuration)
        {
            _configuration = configuration;
            var mongoClient = new MongoClient(
                  _configuration["ConnectionDb:ConnectionString"]);

            var mongoDatabase = mongoClient.GetDatabase(
                _configuration["ConnectionDb:DatabaseName"]);

            _ConnectionCollection = mongoDatabase.GetCollection<Connections>(
                 _configuration["ConnectionDb:UsersCollectionName"]);
        }
        public async Task<Connections> GetAsync(string id) =>
               await _ConnectionCollection.Find(x => x._id == id).FirstOrDefaultAsync();
        public async Task<Connections> GetAsyncId(string EmailId) =>
           await _ConnectionCollection.Find(x => x.EmailId == EmailId).FirstOrDefaultAsync();
        public async Task CreateAsync(Connections newUser) =>
                await _ConnectionCollection.InsertOneAsync(newUser);

        public async Task UpdateAsync(Connections connection, List<string> updatedConnection)
        {
            var filter = Builders<Connections>.Filter.Eq(u => u._id, connection._id);

            Connections newconnections = new Connections
            {
                _id = connection._id,
                EmailId = connection.EmailId,
                Connection = updatedConnection
            };

            await _ConnectionCollection.ReplaceOneAsync(filter, newconnections);


        }


        public async Task RemoveAsync(string id) =>
                await _ConnectionCollection.DeleteOneAsync(x => x._id == id);
    
}
}