using Main.Models;
using Main.Supervisor;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Console;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using Serilog;
using System.Threading.Tasks;


namespace Calenderwebapp.Controllers
{


    [ApiController]
    [Route("[controller]")]
    public class UserController : Controller
    {
       

        private readonly IUserSupervisor _userSupervisor;
        public UserController(IUserSupervisor userSupervisor)
        {

            _userSupervisor = userSupervisor;
           
           // _userSupervisor.SimulateConcurrentRequests().Wait();
        }
        [HttpGet("getallevents")]
        //[Route("getallevents")]
        public async Task<List<UserDetails>> GetEvents(string id)
        {

            var result = await _userSupervisor.GetEvents(id);
            return result;
        }
        [HttpGet("getconnectionevents")]
        //[Route("getconnectionevents")]
        public async Task<List<UserDetails>> GetViewEvents(string id, string connectionId)
        {
            var result = await _userSupervisor.GetViewEvents(id, connectionId);
            Console.WriteLine(result);
            return result;
        }
        [HttpGet("getevent")]
      //  [Route("getevent")]
        public async Task<ActionResult<UserDetails>> GetEvent(string id)
        {
            var events = await _userSupervisor.GetEvent(id);
            

            return events;
        }
        [HttpPost("post")]
       // [Route("post")]
        public async Task<string> Post(UserDetails newUser)
        {
            
            var id= await _userSupervisor.Post(newUser);
            
            return id;
        }

        [HttpPost("sendmail")]
       // [Route("sendmail")]
        public async Task<ActionResult> SendMailAsync(EmailDetails id)
        {
            await _userSupervisor.SendMailAsync(id);
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

        public async Task<UserDetails> Delete(string id, string userId)
        {

         var user=   await _userSupervisor.Delete(id,userId);
            return user; 
            
           
        }

    }
}

 