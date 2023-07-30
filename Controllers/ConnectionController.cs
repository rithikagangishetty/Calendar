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
using MongoDB.Driver;

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
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("Invalid id parameter.");
            }
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
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Invalid email parameter.");
            }
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
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("Invalid id parameter.");
            }
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
            if (newConnection == null)
            {
                return BadRequest("Invalid user data.");
            }
            await _connectionSupervisor.Post(newConnection);

            return CreatedAtAction(nameof(GetEmailId), new { id = newConnection._id }, newConnection);

        }
        [HttpPut("update")]
       
        public async Task<IActionResult> Update(Connections updatedConnection)
        {
            if (updatedConnection == null)
            {
                return BadRequest("Invalid user data.");
            }
            await  _connectionSupervisor.Update(updatedConnection);
            return Ok();
            
        }
        [HttpDelete("delete")]
       
        public async Task<IActionResult> Delete(string emailId, string id)
        {
            if (string.IsNullOrEmpty(id) || string.IsNullOrEmpty(emailId))
            {
                return BadRequest("Invalid id or emailId parameters.");
            }
            
            await _connectionSupervisor.Delete(emailId,id);
        return Ok();
             
        }
    }
}

