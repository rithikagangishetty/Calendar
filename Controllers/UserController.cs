using Calenderwebapp.Models;
using Calenderwebapp.Services;
using Microsoft.AspNetCore.Mvc;
using MailKit.Security;
using MailKit.Net.Smtp;
using MimeKit;
using MimeKit.Text;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace Calenderwebapp.Controllers
{


    [ApiController]
    [Route("[controller]")]
    public class UserController : Controller
    {
        private readonly UserServices _usersService;

        private readonly ConnectionServices _connectionServices;

        public UserController(UserServices usersService, ConnectionServices connectionService)
        {
            _connectionServices = connectionService;
            _usersService = usersService;

        }


        [HttpGet]
        [Route("getevents")]
        public async Task<List<UserDetails>> GetEvents(string _id)
        {

            var users = await _usersService.GetAsync(_id);
            var events = await _usersService.GetAsyncConnections(_id);

            List<UserDetails> result = users.Concat(events).ToList();
            return result;
        }
        [HttpGet]
        [Route("getconnectionevents")]
        public async Task<List<UserDetails>> GetViewEvents(string _id, string connectionId)
        {
            var result = new List<UserDetails>();
            var users = await _usersService.GetAsync(_id);
            foreach (var user in users)
            {
                if (user.priv == false || user.Moderator.Contains(connectionId) || user.Connections.Contains(connectionId))
                    result.Add(user);

            }


            return result;
        }

        [HttpPost]
        public async Task<IActionResult> Post(UserDetails newUser)
        {


            UserDetails user = await Filtering(newUser);

            UserDetails emailUser = await Email(user);
            await _usersService.CreateAsync(user);
            _usersService.SendEmailAsync(emailUser);

            return CreatedAtAction(nameof(GetEvents), new { id = user._id }, user);

        }
       

        [HttpPut]
       
        public async Task<IActionResult> Update(UserDetails updatedUser)
        {
           
            var user = await _usersService.GetAsync(updatedUser._id);


            if (user is null)
            {
                return NotFound();
            }
            UserDetails newUser = await Filtering(updatedUser);
            await _usersService.UpdateAsync(newUser);

            return NoContent();
        }

        [HttpDelete]
        
        public async Task<IActionResult> Delete(string _id,string userId)
        {
            
            var user = await _usersService.GetObjectAsync(_id);
            if (user is null)
            {
                return NotFound();
            }
            if (user.UserId == userId)
            {
                await _usersService.RemoveAsync(_id);
            }
            else
            {
                user.Connections.Remove(userId);
                user.Moderator.Remove(userId);
                await _usersService.UpdateAsync(user);
            }
            return NoContent();
        }
        public async Task<UserDetails> Filtering(UserDetails newUser)
        {
            var users = new List<string>();
            var res = new List<string>();
            var moderator = new List<string>();
            foreach (var email in newUser.Moderator)
            {
                var connection = await _connectionServices.GetAsyncId(email);



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
                    var connection = await _connectionServices.GetAsyncId(email);
                    if (connection != null)
                    {
                        connect.Add(connection._id);

                    }

                }
                newUser.Connections.Clear();
                newUser.Connections.AddRange(connect);

            }

            for (int i = 0; i < newUser.Connections.Count+newUser.Moderator.Count; i = i + 1)
            {

                var user = "";
                if (i < newUser.Connections.Count)
                {
                    user = newUser.Connections[i];
                }
                if (i >= newUser.Connections.Count)
                {
                    user = newUser.Moderator[i- newUser.Connections.Count];
                }


                var result = await _usersService.GetAsync(user);
                var calendarevent = await _usersService.GetAsyncConnections(user);
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


        public async Task<UserDetails> Email(UserDetails user)
        {
            
            var moderators = new List<string>();
            var connections = new List<string>();
            var userEmail = await _connectionServices.GetAsync(user.UserId);

            foreach (var connection in user.Connections)
            {
                var response = await _connectionServices.GetAsync(connection);
                connections.Add(response.EmailId);
            }
            foreach (var moderator in user.Moderator)
            {
                var response = await _connectionServices.GetAsync(moderator);
                moderators.Add(response.EmailId);
            }
            user.UserId = userEmail.EmailId;
            user.Connections.Clear();
            user.Connections.AddRange(connections);
            user.Moderator.Clear();
            user.Moderator.AddRange(moderators);

            return user;

        }
    }
}

 