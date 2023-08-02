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
        /// <summary>
        /// This API call is to check whether the entered emailId is present in the Database or not
        /// </summary>
        /// <param name="userData"></param>
        /// <returns></returns>
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
        /// <summary>
        /// If the email is not present it will create a new document with the given user data.
        /// </summary>
        /// <param name="userData"></param>
        /// <returns></returns>
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






       

     


