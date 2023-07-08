using CalendarDb;
using System.Text;
using Main.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace Main.Supervisor
{
    public class UserSupervisor
    {
        private readonly IUser _users;
        private readonly IConnections _connections;
        public UserSupervisor(IUser Users, IConnections connections)
        {
            _users = Users;
            _connections = connections;


        }
        
        public async Task<List<UserDetails>> GetEvents(string _id)
        {

            var users = await _users.GetAsync(_id);
            var events = await _users.GetAsyncConnections(_id);

            List<UserDetails> result = users.Concat(events).ToList();
            return result;
        }
        public async Task<List<UserDetails>> GetViewEvents(string _id, string connectionId)
        {
            var result = new List<UserDetails>();
            var users = await _users.GetAsync(_id);
            var response = await _users.GetAsync(connectionId);
            foreach (var user in users)
            {
                if (user.priv == false || user.Moderator.Contains(connectionId) || user.Connections.Contains(connectionId))
                    result.Add(user);

            }
            foreach (var user in response)
            {
                if (user.priv == false || user.Moderator.Contains(_id) || user.Connections.Contains(_id))
                    result.Add(user);

            }


            return result;
        }
        public async Task<UserDetails> GetEvent(string _id)
        {
            var events = await _users.GetObjectAsync(_id);
            var moderators = new List<string>();
            var connections = new List<string>();


            foreach (var moderator in events.Moderator)
            {
                var _moderator = await _connections.GetAsync(moderator);
                if (_moderator != null)
                {
                    moderators.Add(_moderator.EmailId);
                }
            }

            foreach (var connect in events.Connections)
            {
                if (await _connections.GetAsync(connect) != null)
                {
                    connections.Add((await _connections.GetAsync(connect)).EmailId);
                }
            }

            events.Connections.Clear();
            events.Connections.AddRange(connections);
            events.Moderator.Clear();
            events.Moderator.AddRange(moderators);

            return events;
        }
        private static readonly object createEventLock = new object();
        public async Task<string> Post(UserDetails newUser)
        {
            UserDetails user = await Filtering(newUser);

           
            lock (createEventLock)
            {



                _users.CreateAsync(newUser);

            }

            return newUser._id;

           
        }
        public async Task SendMailAsync(EmailDetails _id)
        {
            var userEmail = await _connections.GetAsync(_id.UserEmail);

            _id.UserEmail = userEmail.EmailId;
            if (_id.Delete)
            {

                var moderators = new List<string>();
                var connections = new List<string>();
              
                foreach (var connection in _id.Connections)
                {
                    var response = await _connections.GetAsync(connection);
                    if (response != null)
                    {
                        connections.Add(response.EmailId);
                    }
                }
                foreach (var moderator in _id.Moderator)
                {
                    var response = await _connections.GetAsync(moderator);
                    if (response != null)
                    {
                        moderators.Add(response.EmailId);
                    }
                }
                
                    _id.Connections.Clear();
                    _id.Connections.AddRange(connections);
                    _id.Moderator.Clear();
                    _id.Moderator.AddRange(moderators);
                

            }
            _users.SendEmailAsync(_id);

        }
     
        public async Task<UserDetails> Update(UserDetails updatedUser)
        {

            var user = await _users.GetAsync(updatedUser._id);

          
           UserDetails newUser = await Filtering(updatedUser);

            lock (createEventLock)
            {

                _users.UpdateAsync(newUser);
            }
            return newUser;

           
        }
        public async Task <UserDetails>Delete(string _id, string userId)
        {

            var user = await _users.GetObjectAsync(_id);
           

            if (user.UserId == userId || user.Moderator.Contains(userId))
            {
                lock (createEventLock)
                {
                    _users.RemoveAsync(_id);
                }
            }
            else
            {
                user.Connections.Remove(userId);
                user.Moderator.Remove(userId);
                lock (createEventLock)
                {
                    
                    _users.UpdateAsync(user);
                }
            }
            return user;
           
        }
        public async Task<UserDetails> Filtering(UserDetails newUser)
        {
            var users = new List<string>();
            var res = new List<string>();
            var moderator = new List<string>();
            foreach (var email in newUser.Moderator)
            {
                var connection = await _connections.GetAsyncId(email);



                if (connection != null)
                {
                    res.Add(connection._id);

                }

            }
            newUser.Moderator.Clear();
            newUser.Moderator.AddRange(res);
            if (!newUser.priv)
            {
                HashSet<string> moderators = new HashSet<string>(newUser.Moderator);
                List<string> updatedList = new List<string>();

                foreach (string str in newUser.Connections)
                {
                    if (!moderators.Contains(str))
                    {
                        updatedList.Add(str);
                    }
                }
                newUser.Connections.Clear();
                newUser.Connections.AddRange(updatedList);
            }

            if (newUser.priv)
            {
                var connect = new List<string>();
                foreach (var email in newUser.Connections)
                {
                    var connection = await _connections.GetAsyncId(email);
                    if (connection != null)
                    {
                        connect.Add(connection._id);

                    }

                }
                newUser.Connections.Clear();
                newUser.Connections.AddRange(connect);

            }

            for (int i = 0; i < newUser.Connections.Count + newUser.Moderator.Count; i = i + 1)
            {

                var user = "";
                if (i < newUser.Connections.Count)
                {
                    user = newUser.Connections[i];
                }
                if (i >= newUser.Connections.Count)
                {
                    user = newUser.Moderator[i - newUser.Connections.Count];
                }


                var result = await _users.GetAsync(user);
                var calendarevent = await _users.GetAsyncConnections(user);
                List<UserDetails> events = calendarevent.Concat(result).ToList();
                var count = 0;
                if (events == null)
                {
                    if (i < newUser.Connections.Count)
                    {
                        users.Add(user);
                    }
                    else
                    {
                        moderator.Add(user);
                    }
                }


                else
                {

                    foreach (var j in events)
                    {
                        if
                        (
                            (DateTime.Parse(newUser.StartDate) >= DateTime.Parse(j.StartDate) && DateTime.Parse(newUser.StartDate) < DateTime.Parse(j.EndDate)) ||
                            (DateTime.Parse(newUser.EndDate) > DateTime.Parse(j.StartDate) && DateTime.Parse(newUser.EndDate) <= DateTime.Parse(j.EndDate)) ||
                            (DateTime.Parse(newUser.StartDate) <= DateTime.Parse(j.StartDate) && DateTime.Parse(newUser.EndDate) >= DateTime.Parse(j.EndDate))
                        )
                        {
                            count = count + 1;
                            continue;

                        }

                    }
                    if (count == 0)
                    {
                        if (i < newUser.Connections.Count)
                        {
                            users.Add(user);
                        }
                        else
                        {
                            moderator.Add(user);
                        }
                    }

                }
            }




            newUser.Connections.Clear();
            newUser.Moderator.Clear();
            newUser.Moderator.AddRange(moderator);
            newUser.Connections.AddRange(users);
            return newUser;
        }


       



       
        }
}
