using CalendarDb;
using Main.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace Main.Supervisor
{
    public class ConnectionSupervisor
    {
        private IConnections _connection;
         public ConnectionSupervisor(IConnections connection)
        {
            _connection = connection;
        }
        public async Task<Connections?> GetId(string email)
        {
            var _connections= await _connection.GetAsyncId(email);
            if (_connections is null)
            {
                return null ;
            }

            return _connections;
        }
        public async Task<Connections?> GetEmailId(string _id)
        {
            var connection = await _connection.GetAsync(_id);
            if (connection is null)
            {
                return null;
            }

            return connection;
        }
        public async Task<Connections> GetEmail(string _id)
        {
            var connections = await _connection.GetAsync(_id);
            var NewConnections = new List<string>();
            var newUser = new Connections();
            newUser._id = _id;
            if (connections.Connection != null)
            {
                foreach (var connection in connections.Connection)
                {
                    var user = await _connection.GetAsync(connection);
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
        public async Task Post(Connections newConnection)
        {
            await _connection.CreateAsync(newConnection);

        }

        public async Task Update(Connections updatedConnection)
        {
            var connection = new List<string>();
            var connect = new List<string>();
            var count = updatedConnection.Connection.Count();
            var response = await _connection.GetAsyncId(updatedConnection.Connection[count - 1]);
            
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

            await _connection.UpdateAsync(updatedConnection, connection);
           
            await _connection.UpdateAsync(response, connect);


           
        }

        public async Task Delete(string emailId, string _id)
        {
            var user = await _connection.GetAsync(_id);
            var connection = await _connection.GetAsyncId(emailId);
            user.Connection.Remove(connection._id);
            Console.WriteLine(user.Connection);
            await _connection.UpdateAsync(user, user.Connection);
            
        }
    }
}
