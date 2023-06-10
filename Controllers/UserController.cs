using Calenderwebapp.Models;
using Calenderwebapp.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
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
       
       
        public UserController(UserServices usersService)=>    
            _usersService = usersService;


        [HttpGet]
        public async Task<List<UserDetails>> Get() =>
            await _usersService.Get();

        [HttpGet]
        [Route("getevents")]
        public async Task<List<LoginClass>>Get(string id)
        {
           
           
            var users = await _usersService.GetAsync(id);

            //if (users is null)
            //{
            //    return NotFound();
            //}
            var formattedEvents = users.Select(e => new
            {
                Title = e.EventName,
                Start = e.StartDate,
                End = e.EndDate,
            });

            return (List<LoginClass>)formattedEvents;
        }

        [HttpPost]
        public async Task<IActionResult> Post(UserDetails newUser)
        {
            await _usersService.CreateAsync(newUser);

            return CreatedAtAction(nameof(Get), new { id = newUser._id }, newUser);

        }
        //[HttpPost]
        //public async Task<IActionResult> Edit(UserDetails newUser)
        //{
        //    await _usersService.CreateAsync(newUser);

        //    return CreatedAtAction(nameof(Get), new { id = newUser._id }, newUser);

        //}

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

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id)
        {
            var Id = new ObjectId(id);
            var user = await _usersService.GetAsync(id);

            if (user is null)
            {
                return NotFound();
            }

            await _usersService.RemoveAsync(id);

            return NoContent();
        }
    }
}
