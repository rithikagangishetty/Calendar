using Main.Models;
using CalendarDb;
using Calenderwebapp.Services;
using Main.Supervisor;
using Microsoft.AspNetCore.Mvc;



namespace Calenderwebapp.Controllers
    
{
    [ApiController]
    [Route("[controller]")]
    public class LoginController : Controller
    {
        //private readonly LoginServices _loginServices;
        //public LoginController(LoginServices loginServices) =>
        //    _loginServices = loginServices;

        //[HttpPost]
        //[Route("login")]
        //public IActionResult Login(Connections userdata)
        //{
        //    var user = _loginServices.Login(userdata.EmailId);
        //    if (user != null)
        //    { return Ok(user); }
        //    else
        //    {


        //        return NotFound();
        //    }
        //}
        //[HttpPost]
        //[Route("signup")]
        //public IActionResult Signup(Connections userdata)
        //{
        //    var user = _loginServices.Signup(userdata);

        //    return Ok(user);
        //}
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
        public IActionResult Signup(Connections userdata)
        {
            _loginSupervisor.Signup(userdata);

            return Ok();
        }

    }
}






       

     


