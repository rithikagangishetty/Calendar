using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Main.Models;
using CalendarDb;
using Microsoft.AspNetCore.Mvc;

namespace Main.Supervisor
{
    public class LoginSupervisor
    {
        private readonly ILogin _login;
        public LoginSupervisor(ILogin login) =>
           _login = login;

        public  Connections login(Connections userdata)
        {
            var user = _login.login(userdata.EmailId);
            return user;
            
        }
            public void Signup(Connections userdata)
            {
                var user = _login.signup(userdata);
            
                
            }
        
    }
}
