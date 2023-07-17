using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System;
using Main.Supervisor;
using Main.Models;
using CalendarDb;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;


namespace Calenderwebapp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ConnectionController : Controller
    {
       
        private readonly IConnectionSupervisor _connectionSupervisor;
        public ConnectionController(IConnectionSupervisor connectionSupervisor)
        {
            _connectionSupervisor = connectionSupervisor;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="_id"></param>
        /// <returns></returns>
        [HttpGet("get")]
       
        
        public async Task<ActionResult<Connections>> GetEmailId(string id)
        {
            var connection = await _connectionSupervisor.GetEmailId(id);
            if (connection is null)
            {
                return NotFound();
            }

            return connection;
        }
        [HttpGet("getall")]
       
        public async Task<ActionResult<List<string>>> Get()
        {
            var res = await _connectionSupervisor.Get();
            if (res is null)
            {
                return NotFound();
            }

            return res;
        }

        [HttpGet("getid")]
       
        public async Task<ActionResult<Connections>> GetId(string email)
        {
            var connection = await _connectionSupervisor.GetId(email);
            if (connection is null)
            {
                return NotFound();
            }

            return connection;
        }
        [HttpGet("getemail")]
       
        public async Task<ActionResult<Connections>> GetEmail(string id)
        {
           var user=await _connectionSupervisor.GetEmail(id);
            if(user is null)
            {
                return NotFound();
            }
            return user;
        }
        [HttpPost]
        public async Task<IActionResult> Post(Connections newConnection)
        {
            await _connectionSupervisor.Post(newConnection);

            return CreatedAtAction(nameof(GetEmailId), new { id = newConnection._id }, newConnection);

        }
        [HttpPut("update")]
       
        public async Task Update(Connections updatedConnection)
        {
            await  _connectionSupervisor.Update(updatedConnection);
            
            
        }
        [HttpDelete("delete")]
       
        public async Task Delete(string emailId, string id)
        {
            await _connectionSupervisor.Delete(emailId,id);
             
        }
    }
}

