using Main.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CalendarDb
{
    public interface ILogin
    {
        Connections login(string EmailId);
        Connections signup(Connections EmailId);
    }
}
