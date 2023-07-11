using Main.Models;
using CalendarDb;
using Main.Supervisor;
using Microsoft.AspNetCore.Mvc;



namespace Calenderwebapp.Controllers
    
{
    [ApiController]
    [Route("[controller]")]
    public class LoginController : Controller
    {
        private readonly LoginSupervisor _loginSupervisor;
        public LoginController(LoginSupervisor loginSupervisor)
        {
            _loginSupervisor = loginSupervisor;
        }
        [HttpPost]
        [Route("login")]
        public IActionResult Login(Connections userdata)
        {
            var user = _loginSupervisor.login(userdata);
            if (user != null)
            { return Ok(user); }
            else
            {
                return NotFound();
            }
        }
        [HttpPost]
        [Route("signup")]
        public Connections Signup(Connections userdata)
        {
           var user= _loginSupervisor.Signup(userdata);

            return user;
        }

    }
}






       

     


