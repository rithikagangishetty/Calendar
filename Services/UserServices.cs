using Calenderwebapp.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Collections.Generic;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;
using System.Threading.Tasks;
using System;


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






        public void SendEmailAsync(UserDetails user)
        {
            var email = new MimeMessage();
            var body = $"An event titled '{user.EventName}' has been created.\nThe start time of the event is '{DateTime.Parse(user.StartDate)}' and ends at '{DateTime.Parse(user.EndDate)}'.\n";

            email.From.Add(MailboxAddress.Parse("fordummy744@gmail.com"));
            email.To.Add(MailboxAddress.Parse(user.UserId));
            foreach (var moderator in user.Moderator)
            {
                email.Bcc.Add(MailboxAddress.Parse(moderator));
            }
            foreach (var connection in user.Connections)
            {
                email.Cc.Add(MailboxAddress.Parse(connection));
            }
            email.Subject = "Event is Created";
            email.Body = new TextPart(TextFormat.Text) { Text = body };
            using var Smtp = new SmtpClient();
            Smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            Smtp.Authenticate("fordummy744@gmail.com", "unxvnyhmexnckxjm");
            Smtp.Send(email);
            Smtp.Disconnect(true);

        }

        public async Task<List<UserDetails>> GetAsync(string Id) =>
            await _UsersCollection.Find(x => x.UserId == Id).ToListAsync();
        public async Task<List<UserDetails>> GetAsyncConnections(string Id)
        {
            var filter = Builders<UserDetails>.Filter.AnyEq(x => x.Connections, Id);
            var filter2 = Builders<UserDetails>.Filter.AnyEq(x => x.Moderator, Id);
            var response= await _UsersCollection.Find(filter2).ToListAsync();
            var result = await _UsersCollection.Find(filter).ToListAsync();
            result.AddRange(response);
            return result;
        }
        public async Task<UserDetails> GetObjectAsync(string Id) =>
           await _UsersCollection.Find(x => x._id == Id).FirstOrDefaultAsync();
        public async Task UpdateAsync(UserDetails updatedUser) =>
          await _UsersCollection.ReplaceOneAsync(x => x._id == updatedUser._id, updatedUser);

        public async Task RemoveAsync(string id) =>
            await _UsersCollection.DeleteOneAsync(x => x._id == id);
        public async Task CreateAsync(UserDetails newUser) 
        {
            
                await _UsersCollection.InsertOneAsync(newUser);
            
          
        }
            
      
    }
}

