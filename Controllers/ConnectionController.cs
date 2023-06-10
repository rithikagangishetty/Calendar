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
        public async Task<List<Connections>> Get() =>
            await _connectionServices.Getasync();

        [HttpGet]
        [Route("get")]
        public async Task<ActionResult<Connections>> GetEmailId(string _id)
        {
            var Id = new ObjectId(_id);
            var _connection = await _connectionServices.GetAsync(_id);

            if (_connection is null)
            {
                return NotFound();
            }

            return _connection;
        }

        [HttpGet]
        [Route("getemail")]
        public async Task<ActionResult<List<string>>> GetEmail(string _id)
        {
            var connections = await _connectionServices.GetAsync(_id);
            var NewConnections = new List<string>();
            foreach (var connection in connections.Connection)
            {
                var user = await _connectionServices.GetAsync(connection);
                if (user!= null)
                {
                    NewConnections.Add(user.EmailId);
                }
            }

            return NewConnections;
        }

        [HttpPost]
        public async Task<IActionResult> Post(Connections newConnection)
        {
            await _connectionServices.CreateAsync(newConnection);

            return CreatedAtAction(nameof(Get), new { id = newConnection._id }, newConnection);

        }
        [HttpPost]
        [Route("login")]
        public IActionResult Login(Connections userdata)
        {
            var user = _connectionServices.Login(userdata.EmailId);
            if (user != null)
            { return Ok(user); }
            else
            {


                return NotFound();
            }
        }
        [HttpPut]

        [Route("update")]
        public async Task<IActionResult> Update(Connections updatedConnection)
        {


            var connection = new List<string>();
            var connect = new List<string>();
            var count = updatedConnection.Connection.Count;
            var response = _connectionServices.Login(updatedConnection.Connection[count - 1]);
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
        public async Task<IActionResult> Delete(string id)
        {
            var Id = new ObjectId(id);
            var _connection = await _connectionServices.GetAsync(id);

            if (_connection is null)
            {
                return NotFound();
            }

            await _connectionServices.RemoveAsync(id);

            return NoContent();
        }
    }
}