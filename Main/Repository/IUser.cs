using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Main.Models;
namespace CalendarDb
{
    public interface IUser
    {
        public Task<List<UserDetails>> GetAsync(string Id);

        public Task<List<UserDetails>> GetAsyncConnections(string Id);
        public Task<UserDetails> GetObjectAsync(string Id);
        public void UpdateAsync(UserDetails updatedUser);
        public void RemoveAsync(string id);
        public void SendEmailAsync(EmailDetails user);
        public void CreateAsync(UserDetails newUser);
      public Task RunReminderTask();
        public void StartReminderTimer();



    }

}
