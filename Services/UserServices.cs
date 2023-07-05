﻿using Calenderwebapp.Models;
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
using Org.BouncyCastle.Tls;

namespace Calenderwebapp.Services
{
    public class UserServices
  
    {
        private readonly IMongoCollection<UserDetails> _UsersCollection;
        private readonly IConfiguration _configuration;
        public UserServices(
            IOptions<UserSettings> UserSettings, IConfiguration configuration)

       
        {
            _configuration = configuration;
            var mongoClient = new MongoClient(
                UserSettings.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                UserSettings.Value.DatabaseName);

            _UsersCollection = mongoDatabase.GetCollection<UserDetails>(
                UserSettings.Value.UsersCollectionName);
           
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
            DateTime scheduledTime = new DateTime(2023, 6, 30, 9, 0, 0); // Replace with your desired scheduled time




            ScheduleEmailAsync(user);

        }
        public void ScheduleEmailAsync(EmailDetails user)
        {
            var currentTime = DateTime.Now;
            DateTime startDate = DateTime.Parse(user.StartDate);
            DateTime scheduledTime = startDate.AddMinutes(-10);

            var timeUntilScheduled = scheduledTime - currentTime;

            if (timeUntilScheduled.TotalMilliseconds < 0)
            {
                Console.WriteLine("Scheduled time has already passed.");
                return;
            }

            var timer = new Timer(state =>
            {
                SendEmailAsync(user);
                Console.WriteLine("Email sent!");
            }, null, (int)timeUntilScheduled.TotalMilliseconds, Timeout.Infinite);
        }

    }
}

