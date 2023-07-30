using Main.Models;
using Main.Supervisor;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Calenderwebapp.Controllers
    
{
    [ApiController]
    [Route("[controller]")]
    public class LoginController : Controller
    {
        private readonly ILoginSupervisor _loginSupervisor;
        public LoginController(ILoginSupervisor loginSupervisor)
        {
            _loginSupervisor = loginSupervisor;
        }
        [HttpPost("login")]
       
        public IActionResult Login(Connections userData)
        {
            var user = _loginSupervisor.login(userData);
            if (user != null)
            { return Ok(user); }
            else
            {
                return NotFound();
            }
        }
        [HttpPost("signup")]
       
        public  ActionResult<Connections> Signup(Connections userData)
        {
            if(userData == null)
            {
                return NotFound();

            }
           var user= _loginSupervisor.Signup(userData);

            return user;
        }

    }
}






       

     


