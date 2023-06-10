import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


type Connection = {
    _id: string;
    emailId: string;
    Connection: Array<string>;

};
interface RouteParams {
    id: string;

}
function Connections() {
    const [connection, setConnection] = useState<string>("");
    const [connections, setConnections] = useState<Array<string>>([]);
    const { id } = useParams<RouteParams>();

    useEffect(() => {
     
    }, [Update]);


   
    async function Get(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        axios.get('https://localhost:44373/Connection/getemail/', { params: { _id: id } }).then((response) => {
            console.log(response.data);
            setConnections(response.data);
        }).catch((error) => { alert(error) });
        return (
            <div>
                {connections.map((item) => (
                    <div>
                        <p>{item}</p>

                    </div>
                ))}
            </div>);
    }
    

    async function Update(event: React.MouseEvent<HTMLButtonElement>)
    {
        event.preventDefault();
        axios.get('https://localhost:44373/Connection/get/', { params: { _id: id } }).then((response) =>
    
               {
            console.log(response.data);
            setConnections(response.data.connection);
                       var newconnections = response.data.connection;
                       if (response.data.connection != null) {
                           newconnections = [...newconnections, connection];
                       }
                       if (response.data.connection == null) {
                           newconnections = [connection];
                       }
          
                axios.put("https://localhost:44373/Connection/update",
                       {

                           _id: response.data._id,
                           EmailId: response.data.emailId,
                           Connection: newconnections,


                       }).then((response) => {
                       
                           console.log(response.data);
                           alert("Connection Added");
                     
                       }).catch((error) => {
                           alert("error in update "+error);
                       });
            setConnections(newconnections);

               }).catch((error) => {
                   alert("error in getting the _id  "+error);
                   
              
               });
       

    }

    return (
        <div>
            <form>
              

              
                <div>
                    <label>Connections</label>
                    <input
                        type="text"
                        className="form-control"
                        id="emailid"
                        placeholder={"connections"}
                        onChange={(event) => {
                            setConnection(event.target.value);

                        }}
                    />
                </div>
               
          

             
            
        </form >

            <div>
            <button className="btn btn-primary mt-4" onClick={Update}>
                Add Connection
            </button>
            </div>
            <div>
                <button className="btn btn-primary mt-4" onClick={Get}>
                    Connections
                </button>
            </div>


                    </div >
        
        
        );
}
export default Connections;

