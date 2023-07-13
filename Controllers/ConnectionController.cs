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
       
        private readonly ConnectionSupervisor _connectionSupervisor;
        public ConnectionController(ConnectionSupervisor connectionSupervisor)
        {
            _connectionSupervisor = connectionSupervisor;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="_id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get")]
        
        public async Task<ActionResult<Connections>> GetEmailId(string _id)
        {
            var _connection = await _connectionSupervisor.GetEmailId(_id);
            if (_connection is null)
            {
                return NotFound();
            }

            return _connection;
        }
        [HttpGet]
        [Route("getid")]
        public async Task<ActionResult<Connections>> GetId(string email)
        {
            var _connection = await _connectionSupervisor.GetId(email);
            if (_connection is null)
            {
                return NotFound();
            }

            return _connection;
        }
        [HttpGet]
        [Route("getemail")]
        public async Task<ActionResult<Connections>> GetEmail(string _id)
        {
           var user=await _connectionSupervisor.GetEmail(_id);
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
        [HttpPut]
        [Route("update")]
        public async Task Update(Connections updatedConnection)
        {
            await  _connectionSupervisor.Update(updatedConnection);
            
            
        }
        [HttpDelete]
        [Route("delete")]
        public async Task Delete(string emailId, string _id)
        {
            await _connectionSupervisor.Delete(emailId,_id);
             
        }
    }
}

