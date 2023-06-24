using Calenderwebapp.Models;
using Calenderwebapp.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Security.AccessControl;
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
        public async Task<List<UserDetails>>GetEvents(string _id)
        {

            var users = await _usersService.GetAsync(_id);
            var events = await _usersService.GetAsyncConnections(_id);
            List<UserDetails> result = users.Concat(events).ToList();
            return result;
        }

        [HttpPost]
        public async Task<IActionResult> Post(UserDetails newUser)
        {
           
            var users = new List<string>();
            var res = new List<string>();
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

            for (int i = 0; i <newUser.Connections.Count; i = i + 1)
            {
                var user = newUser.Connections[i];
              
                
                var result = await _usersService.GetAsync(user);
                var calendarevent = await _usersService.GetAsyncConnections(user);
               List<UserDetails> events = calendarevent.Concat(result).ToList();
                var count = 0;
                if (events == null)
                {
                    users.Add(user);
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
                            count = count+1;
                            continue;
                           
                        }

                    }
                    if (count==0)
                    {
                        users.Add(user);
                    }

                }
            }

             newUser.Connections.Clear();
            newUser.Connections.AddRange(users);
            Console.WriteLine(users);
                await _usersService.CreateAsync(newUser);
                return CreatedAtAction(nameof(GetEvents), new { id = newUser._id }, newUser);

        }

      
    [HttpPut]
        [Route("update")]
        public async Task<IActionResult> Update(UserDetails updatedUser)
        {
           
            var user = await _usersService.GetAsync(updatedUser._id);

            if (user is null)
            {
                return NotFound();
            }

            await _usersService.UpdateAsync(updatedUser);

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
    }
}
