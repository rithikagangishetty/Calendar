using Calenderwebapp.Models;
using Calenderwebapp.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System;
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
        private readonly ConnectionServices _connectionServices;
        public ConnectionController(ConnectionServices connectionService) =>
            _connectionServices = connectionService;



        [HttpGet]
        [Route("get")]
        public async Task<ActionResult<Connections>> GetEmailId(string _id)
        {
            var _connection = await _connectionServices.GetAsync(_id);
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
            var _connection = await _connectionServices.GetAsyncId(email);
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
            var connections = await _connectionServices.GetAsync(_id);
            var NewConnections = new List<string>();
            var newUser = new Connections();
            newUser._id = _id;
            if (connections.Connection != null)
            {
                foreach (var connection in connections.Connection)
                {
                    var user = await _connectionServices.GetAsync(connection);
                    if (user != null)
                    {
                        NewConnections.Add(user.EmailId);
                    }
                }
            }
            newUser.EmailId = connections.EmailId;
            newUser.Connection = NewConnections;
            return newUser;
        }

        [HttpPost]
        public async Task<IActionResult> Post(Connections newConnection)
        {
            await _connectionServices.CreateAsync(newConnection);

            return CreatedAtAction(nameof(GetEmailId), new { id = newConnection._id }, newConnection);

        }
     
        [HttpPut]
        [Route("update")]
        public async Task<IActionResult> Update(Connections updatedConnection)
        {
            var connection = new List<string>();
            var connect = new List<string>();
            var count = updatedConnection.Connection.Count;
            var response = await _connectionServices.GetAsyncId(updatedConnection.Connection[count - 1]);
            var exists=   updatedConnection.Connection.Contains(response._id);
            if(exists)
            { return Ok("Connection already exists"); 
            }
            if (response != null)
            {
                if (response.Connection != null)
                {
                    for (int k = 0; k < response.Connection.Count; k = k + 1)
                    {
                        connect.Add(response.Connection[k]);
                    }
                }
                connect.Add(updatedConnection._id);
            }
            for (int j = 0; j < count - 1; j = j + 1)
            {
                connection.Add(updatedConnection.Connection[j]);
            }

            if (response != null)
            {
                connection.Add(response._id);

            }

            await _connectionServices.UpdateAsync(updatedConnection, connection);
            await _connectionServices.UpdateAsync(response, connect);


            return NoContent();
        }



        [HttpDelete]
        [Route("delete")]
        public async Task<IActionResult> Delete(string emailId,string _id)
        {
            var user =await  _connectionServices.GetAsync(_id); 
            var connection= await _connectionServices.GetAsyncId(emailId);
            user.Connection.Remove(connection._id);
            Console.WriteLine(user.Connection);
            await _connectionServices.UpdateAsync(user, user.Connection);
            return NoContent();
        }
    }
}