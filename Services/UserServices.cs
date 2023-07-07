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
using Microsoft.Extensions.Configuration;
using System.Threading;


namespace Calenderwebapp.Services
{
    public class UserServices
  
    {
        private readonly IMongoCollection<UserDetails> _UsersCollection;
        private readonly IConfiguration _configuration;
        private Timer _reminderTimer;
        private readonly ConnectionServices _connectionServices;
        public UserServices(
            IOptions<UserSettings> UserSettings, IConfiguration configuration, ConnectionServices connectionService)

       
        {
            _configuration = configuration;
            var mongoClient = new MongoClient(
                UserSettings.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                UserSettings.Value.DatabaseName);

            _UsersCollection = mongoDatabase.GetCollection<UserDetails>(
                UserSettings.Value.UsersCollectionName);
            _connectionServices = connectionService;
            StartReminderTimer();
        }
        private void StartReminderTimer()
        {
            // Set up the reminder timer to run the reminder task every 10 minutes
            _reminderTimer = new Timer(async state => await RunReminderTask(), null, TimeSpan.Zero, TimeSpan.FromMinutes(1));
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
        public void UpdateAsync(UserDetails updatedUser) =>
           _UsersCollection.ReplaceOneAsync(x => x._id == updatedUser._id, updatedUser);

        public void RemoveAsync(string id) =>
             _UsersCollection.DeleteOneAsync(x => x._id == id);
        public  void  CreateAsync(UserDetails newUser) 
        {
            
               _UsersCollection.InsertOneAsync(newUser);
            
          
        }
        public void SendEmailAsync(EmailDetails user)
        {
            string senderEmail = _configuration["EmailSettings:SenderEmail"];
            string smtpServer = _configuration["EmailSettings:SmtpServer"];
            int port = int.Parse(_configuration["EmailSettings:Port"]);
            string password = _configuration["EmailSettings:Password"];

            var email = new MimeMessage();
            var body = user.Body;
            email.From.Add(MailboxAddress.Parse(senderEmail));
            email.To.Add(MailboxAddress.Parse(user.UserEmail));
            foreach (var moderator in user.Moderator)
            {
                email.Bcc.Add(MailboxAddress.Parse(moderator));
            }
            foreach (var connection in user.Connections)
            {
                email.Cc.Add(MailboxAddress.Parse(connection));
            }
            email.Subject = user.Subject;
            email.Body = new TextPart(TextFormat.Text) { Text = body };
            using var Smtp = new SmtpClient();
            Smtp.Connect(smtpServer, port, SecureSocketOptions.StartTls);
            Smtp.Authenticate(senderEmail, password);
            Smtp.Send(email);
            Smtp.Disconnect(true);
          

        }
        public async Task RunReminderTask()
        {
            var currentDateTimeUtc = DateTime.UtcNow;
            var reminderThreshold = currentDateTimeUtc.AddMinutes(10);
            var upcomingEvents = await _UsersCollection
                   .Find(e => DateTime.Parse(e.StartDate) >= currentDateTimeUtc && DateTime.Parse(e.StartDate) < reminderThreshold && !e.Reminder)
                   .ToListAsync();

            foreach (var ev in upcomingEvents)
            {
                var timeDifference = DateTime.Parse(ev.StartDate) - currentDateTimeUtc;
                
                    var moderators = new List<string>();
                    var connections = new List<string>();
                    EmailDetails details = new EmailDetails();
                    var userEmail= await _connectionServices.GetAsync(ev._id);
                    details.UserEmail = userEmail.EmailId;
                    details.Subject = "Reminder For the Event";
                    details.Body = $"The event named {ev.EventName} will start in 10 minutes.";
                    details.StartDate = ev.StartDate;
                    details.EndDate = ev.EndDate;
                    details.EventName = ev.EventName;
                    details._id = ev._id;
                    foreach (var connection in ev.Connections)
                    {
                        var response = await _connectionServices.GetAsync(connection);
                        connections.Add(response.EmailId);
                    }
                    foreach (var moderator in ev.Moderator)
                    {
                        var response = await _connectionServices.GetAsync(moderator);
                        moderators.Add(response.EmailId);
                    }
                    details.Connections = connections;
                    details.Moderator = (moderators);

                    SendEmailAsync(details);
                    ev.Reminder = true;
                    await _UsersCollection.ReplaceOneAsync(e => e._id == ev._id, ev);

                
            }
        }


    }
}

