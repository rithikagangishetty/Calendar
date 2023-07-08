using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Main.Models;
namespace CalendarDb
{
    public  interface IConnections
    {
        Task<Connections> GetAsync(string id);
        Task<Connections>GetAsyncId(string EmailId);

        Task CreateAsync(Connections newUser);

        Task UpdateAsync(Connections connection,List<string>updatedConnection);

        Task RemoveAsync(string id);
    }
}
