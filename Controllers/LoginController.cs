using Calenderwebapp.Models;
using Calenderwebapp.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace Calenderwebapp.Controllers
    
{
    [ApiController]
    [Route("[controller]")]
    public class LoginController : Controller
    {
        private readonly LoginServices _loginServices;
        public LoginController(LoginServices loginServices) =>
            _loginServices = loginServices;

        [HttpPost]
        [Route("login")]
        public IActionResult Login(Connections userdata)
        {
            var user = _loginServices.Login(userdata.EmailId);
            if (user != null)
            { return Ok(user); }
            else
            {
                //var newuser= _loginServices.Signup(username);

                return NotFound();
            }
        }
        [HttpPost]
        [Route("signup")]
        public IActionResult Signup(Connections userdata)
        {
            var user = _loginServices.Signup(userdata);

            return Ok(user);
        }

    }
}






       

     


