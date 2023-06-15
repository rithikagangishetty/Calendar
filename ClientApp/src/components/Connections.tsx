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
    const [emailIds, setEmailIds] = useState<Array<string>>([]);
    const { id } = useParams<RouteParams>();
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {

    }, [Update, Delete]);


    var events: any;

    function Get(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        setShowContent(true);
        axios.get('https://localhost:44373/Connection/getemail/', { params: { _id: id } }).then((response) => {

            console.log(response.data);
            events = response.data;
            if (events.length > 0) {
                setEmailIds(events)

            }

            if (events.length == 0) {
                alert("No Connections");

            }



        }).catch((error) => {
            alert(error)
        });

    }

    async function Delete(emailId: string) {

        axios.delete('https://localhost:44373/Connection/delete/', { params: { emailId: emailId, _id: id } }).then((response) => {
            console.log(response.data);
            alert("Connection Deleted");
            setShowContent(false);
        }).catch((error) => { alert(error); })
    }
    async function Update(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        axios.get('https://localhost:44373/Connection/get/', { params: { _id: id } }).then((response) => {
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
                    setShowContent(false);

                }).catch((error) => {
                    alert("error in update " + error);
                });
            setConnections(newconnections);

            console.log(connections);
        }).catch((error) => {
            alert("error in getting the _id  " + error);


        });


    }

    return (
        <><div>
            <form>



                <div>

                    <div>
                        <label>Add a New Connection</label>
                        <input
                            type="text"
                            className="form-control"
                            id="emailid"
                            placeholder={"Add EmailId of the required connection"}
                            onChange={(event) => {
                                setConnection(event.target.value);

                            }} />
                    </div>


                </div>





            </form>

            <div>
                <button className="btn btn-primary mt-4" onClick={Update}>
                    Add Connection
                </button>
            </div>
            <div>
                <button className="btn btn-primary mt-4" onClick={Get}>
                    View Connections
                </button>
                {showContent && <div>
                    {emailIds.length > 0 && (
                        <table className="table table-light">
                            <thead>
                                <tr>

                                    <th scope="col">Your Connections</th>
                                </tr>
                            </thead>
                            {emailIds.map(function fn(email: any) {
                                return (
                                    <tbody>
                                        <tr>

                                            <td>{email}</td>

                                            <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={() => Delete(email)}
                                            >
                                                Delete
                                            </button>

                                        </tr>
                                    </tbody>
                                );
                            })}
                        </table>
                    )}
                </div>}

            </div>



        </div>

        </>


    );
}
export default Connections;
