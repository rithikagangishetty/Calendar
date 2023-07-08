using Main.Models;
using Main.Supervisor;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Console;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;


namespace Calenderwebapp.Controllers
{


    [ApiController]
    [Route("[controller]")]
    public class UserController : Controller
    {
        
        private readonly UserSupervisor _userSupervisor;
        public UserController(UserSupervisor userSupervisor)
        {
           
            _userSupervisor = userSupervisor;
        }
        [HttpGet]
        [Route("getallevents")]
        public async Task<List<UserDetails>> GetEvents(string _id)
        {

            var result = await _userSupervisor.GetEvents(_id);
            return result;
        }
        [HttpGet]
        [Route("getconnectionevents")]
        public async Task<List<UserDetails>> GetViewEvents(string _id, string connectionId)
        {
            var result = await _userSupervisor.GetViewEvents(_id, connectionId);
            Console.WriteLine(result);
            return result;
        }
        [HttpGet]
        [Route("getevent")]
        public async Task<ActionResult<UserDetails>> GetEvent(string _id)
        {
            var events = await _userSupervisor.GetEvent(_id);
            

            return events;
        }
        [HttpPost]
        [Route("post")]
        public async Task<string> Post(UserDetails newUser)
        {
            var id= await _userSupervisor.Post(newUser);
            Console.WriteLine(id);
            return id;
        }

        [HttpPost]
        [Route("sendmail")]
        public async Task<ActionResult> SendMailAsync(EmailDetails _id)
        {
            await _userSupervisor.SendMailAsync(_id);
            return Ok();
        }
        [HttpPut]

        public async Task<IActionResult> Update(UserDetails updatedUser)
        {

           var user=  await _userSupervisor.Update(updatedUser);
            if (user is null)
            {
                return NotFound();
            }
            
            return NoContent();
        }
        [HttpDelete]

        public async Task<UserDetails> Delete(string _id, string userId)
        {

         var user=   await _userSupervisor.Delete(_id,userId);
            return user; 
            
           
        }

    }
}

 