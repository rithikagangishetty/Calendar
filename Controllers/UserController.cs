using Calenderwebapp.Models;
using Calenderwebapp.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Calenderwebapp.Controllers
{


    [ApiController]
    [Route("[controller]")]
    public class UserController : Controller
    {
        private readonly UserServices _usersService;
       
       
        public UserController(UserServices usersService)=>    
            _usersService = usersService;


        [HttpGet]
        public async Task<List<UserDetails>> Get() =>
            await _usersService.Get();

        [HttpGet]
        [Route("getevents")]
        public async Task<List<UserDetails>>GetEvents(string _id)
        {

            var users = await _usersService.GetAsync(_id);
            return users;
        }

        [HttpPost]
        public async Task<IActionResult> Post(UserDetails newUser)
        {
            var users = new List<UserDetails>();
            for (int i = 0; i < newUser.Connections.Count; i = i + 1)
            {
                var user = new UserDetails();
                user.UserId = newUser.Connections[i];
                user.EndDate = newUser.EndDate;
                user.StartDate = newUser.StartDate;
                user.EventName = newUser.EventName;
               
                var events = await _usersService.GetAsync(user.UserId);
                if (events == null)
                {
                    users.Add(user);
                }


                else
                {
                    bool count = true;
                    foreach (var j in events)
                    {
                        if
                        (
                            (DateTime.Parse(user.StartDate) >= DateTime.Parse(j.StartDate) && DateTime.Parse(user.StartDate) < DateTime.Parse(j.EndDate)) ||
                            (DateTime.Parse(user.EndDate) > DateTime.Parse(j.StartDate) && DateTime.Parse(user.EndDate) <= DateTime.Parse(j.EndDate)) ||
                            (DateTime.Parse(user.StartDate) <= DateTime.Parse(j.StartDate) && DateTime.Parse(user.EndDate) >= DateTime.Parse(j.EndDate))
                        )
                        {
                            count = false;
                           
                            break;
                        }
                      
                    }
                    if(count)
                    {
                        users.Add(user);
                    }

                }

            }
            users.Add(newUser);
                await _usersService.CreateAsync(users);
                return CreatedAtAction(nameof(Get), new { id = newUser._id }, newUser);

        }

        [HttpPost]
        [Route("email")]
        public IActionResult SendEmail(UserDetails eventData)
        {
            
            SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", 587);
          
            var myemail = "batmanandriddler@gmail.com";
            var mypass = "batmanandriddler1008";
            smtpClient.Credentials = new NetworkCredential(myemail, mypass);
            smtpClient.EnableSsl = true;

            MailMessage mailMessage = new MailMessage
            {
                From = new MailAddress(myemail)
            };
            mailMessage.To.Add(myemail);
            mailMessage.Subject = "Event Created";
            mailMessage.Body = $"Your event  has been created.";

            try
            {
                smtpClient.Send(mailMessage);
                // Email sent successfully
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                // Email sending failed, handle the error
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }
    
    [HttpPut]
        [Route("update")]
        public async Task<IActionResult> Update(UserDetails updatedUser)
        {
            var Id = new ObjectId(updatedUser._id);
            var user = await _usersService.GetAsync(updatedUser._id);

            if (user is null)
            {
                return NotFound();
            }

            await _usersService.UpdateAsync(updatedUser);

            return NoContent();
        }

        [HttpDelete]
        
        public async Task<IActionResult> Delete(string _id)
        {
            var Id = new ObjectId(_id);
            var user = await _usersService.GetObjectAsync(_id);
            if (user is null)
            {
                return NotFound();
            }
            
            await _usersService.RemoveAsync(_id);
            //foreach ( var id in user.Connections)
            //{
            //    await _usersService.RemoveAsync(id);
            //}
          

           

            return NoContent();
        }
    }
}
