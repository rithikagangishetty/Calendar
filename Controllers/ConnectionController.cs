﻿using Microsoft.AspNetCore.Mvc;
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
        /// Takes object Id and returns email Id of the user
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
        /// <summary>
        /// All the documents in the database are called
        /// </summary>
        /// <returns>List of all the email Ids</returns>
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
        /// <summary>
        /// This function obtains the document from the database based on the email Id provided.
        /// </summary>
        /// <param name="email">email Id of the user</param>
        /// <returns>The user document</returns>
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
        /// <summary>
        /// This function takes the id of the user and converts the connections from objectid to emailId 
        /// which is further used for displaying in user connections page
        /// </summary>
        /// <param name="_id">user id</param>
        /// <returns>Same document but the connections array with emailIds</returns>

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
        /// <summary>
        /// API call for the new user that needs to be added
        /// </summary>
        /// <param name="newConnection">new user</param>
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
        /// <summary>
       ///Updates the user's connections
        /// </summary>
        /// <param name="updatedConnection"></param>
        /// <returns></returns>
        public async Task<IActionResult> Update(Connections updatedConnection)
        {
            if (updatedConnection == null)
            {
                return BadRequest("Invalid user data.");
            }
            await  _connectionSupervisor.Update(updatedConnection);
            return Ok();
            
        }
        /// <summary>
        /// It deletes the selected connection in the user document
        /// </summary>
        /// <param name="emailId">The emailId of the connection user wants to remove</param>
        /// <param name="_id">Object id of the user document</param>
        /// <returns></returns>
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

