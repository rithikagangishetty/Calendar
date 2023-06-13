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
        public async Task<List<UserDetails>>GetEvents(string _id)
        {

            var users = await _usersService.GetAsync(_id);
            return users;
        }

        [HttpPost]
        public async Task<IActionResult> Post(UserDetails newUser)
        {
            await _usersService.CreateAsync(newUser);

            return CreatedAtAction(nameof(Get), new { id = newUser._id }, newUser);

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

            return NoContent();
        }
    }
}
