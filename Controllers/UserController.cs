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
        //  [HttpGet("getallevents")]
        //  //[Route("getallevents")]
        //  public async Task<List<UserDetails>> GetEvents(string id)
        //  {

        //      var result = await _userSupervisor.GetEvents(id);
        //      return result;
        //  }
        //  [HttpGet("getconnectionevents")]
        //  //[Route("getconnectionevents")]
        //  public async Task<List<UserDetails>> GetViewEvents(string id, string connectionId)
        //  {
        //      var result = await _userSupervisor.GetViewEvents(id, connectionId);
        //      Console.WriteLine(result);
        //      return result;
        //  }
        //  [HttpGet("getevent")]
        ////  [Route("getevent")]
        //  public async Task<ActionResult<UserDetails>> GetEvent(string id)
        //  {
        //      var events = await _userSupervisor.GetEvent(id);


        //      return events;
        //  }
        //  [HttpPost("post")]
        // // [Route("post")]
        //  public async Task<string> Post(UserDetails newUser)
        //  {

        //      var id= await _userSupervisor.Post(newUser);

        //      return id;
        //  }

        //  [HttpPost("sendmail")]
        // // [Route("sendmail")]
        //  public async Task<ActionResult> SendMailAsync(EmailDetails id)
        //  {
        //      await _userSupervisor.SendMailAsync(id);
        //      return Ok();
        //  }
        //  [HttpPut]

        //  public async Task<IActionResult> Update(UserDetails updatedUser)
        //  {

        //     var user=  await _userSupervisor.Update(updatedUser);
        //      if (user is null)
        //      {
        //          return NotFound();
        //      }

        //      return NoContent();
        //  }
        //  [HttpDelete]

        //  public async Task<UserDetails> Delete(string id, string userId)
        //  {

        //   var user=   await _userSupervisor.Delete(id,userId);
        //      return user; 


        //  }

        [HttpGet("getallevents")]
        public async Task<ActionResult<List<UserDetails>>> GetEvents(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("Invalid id parameter.");
            }

            var result = await _userSupervisor.GetEvents(id);
            if (result == null || result.Count == 0)
            {
                return NotFound();
            }

            return result;
        }

        [HttpGet("getconnectionevents")]
        public async Task<ActionResult<List<UserDetails>>> GetViewEvents(string id, string connectionId)
        {
            if (string.IsNullOrEmpty(id) || string.IsNullOrEmpty(connectionId))
            {
                return BadRequest("Invalid id or connectionId parameters.");
            }

            var result = await _userSupervisor.GetViewEvents(id, connectionId);
            if (result == null || result.Count == 0)
            {
                return NotFound();
            }

            return result;
        }

        [HttpGet("getevent")]
        public async Task<ActionResult<UserDetails>> GetEvent(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("Invalid id parameter.");
            }

            var events = await _userSupervisor.GetEvent(id);
            if (events == null)
            {
                return NotFound();
            }

            return events;
        }

        [HttpPost("post")]
        public async Task<ActionResult<string>> Post(UserDetails newUser)
        {
            if (newUser == null)
            {
                return BadRequest("Invalid user data.");
            }
            // Check if the StartDate is greater than the EndDate
            if (DateTime.Parse(newUser.StartDate) >= DateTime.Parse(newUser.EndDate))
            {
                return BadRequest("Invalid End Date/Time of the event");
            }

            var id = await _userSupervisor.Post(newUser);

            return id;
        }

        [HttpPost("sendmail")]
        public async Task<ActionResult> SendMailAsync(EmailDetails emailDetails)
        {
            if (emailDetails == null)
            {
                return BadRequest("Invalid email data.");
            }

            await _userSupervisor.SendMailAsync(emailDetails);
            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> Update(UserDetails updatedUser/*,string userId*/)
        {
            if (updatedUser == null)
            {
                return BadRequest("Invalid user data.");
            }
            if (DateTime.Parse(updatedUser.StartDate) >= DateTime.Parse(updatedUser.EndDate))
            {
                return BadRequest("Invalid End Date/Time of the event");
            }
            var user = await _userSupervisor.Update(updatedUser/*,userId*/);
            if (user == null)
            {
                return NotFound();
            }
           

            return NoContent();
        }

        [HttpDelete]
        public async Task<ActionResult<UserDetails>> Delete(string id, string userId)
        {
            if (string.IsNullOrEmpty(id) || string.IsNullOrEmpty(userId))
            {
                return BadRequest("Invalid id or userId parameters.");
            }

            var user = await _userSupervisor.Delete(id, userId);
            if (user == null)
            {
                return NotFound();
            }

            return user;
        }
    }
}

 


