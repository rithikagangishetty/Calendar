import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
type TaskType = 'connectionadded' | 'connectiondeleted' | 'noconnections' | 'connectionexist' | 'sameemail'; // Define the possible task types
import MyModal from './Modal';


type Connection = {
    _id: string;
    emailId: string;
    Connection: Array<string>;

};
interface RouteParams {
    id: string;


}
function Connections() {
    const [showModal, setShowModal] = useState(false);
    const [currentTaskType, setCurrentTaskType] = useState<TaskType | null>(null);
    const [connection, setConnection] = useState<string>("");
    const [emailIds, setEmailIds] = useState<Array<string>>([]);
    const [userEmail, setUserEmail] = useState<string>('');
    const { id } = useParams<RouteParams>();
    
    const history = useHistory();
   

    const handleViewCalendar = (email: string) =>
    {
        var connectionId:string;
        axios.get('https://localhost:44373/Connection/getid/', { params: { email: email } }).then((response) =>
        {
            connectionId = response.data._id;
            history.push(`/calendar/${id}/${connectionId}`);
           

        }).catch((error) => {
            alert(error)
            return;
        });
      
    };


    useEffect(() => {
        Get();
    }, [currentTaskType]);
    const handleCloseModal = () => {

        setShowModal(false);
    };

    var emails: any;

    function Get() {


        axios.get('https://localhost:44373/Connection/getemail/', { params: { _id: id } }).then((response) => {

            console.log(response.data);
            emails = response.data.connection;
            setUserEmail(response.data.emailId);
            if (emails.length > 0) {
                setEmailIds(emails)

            }

            if (emails.length == 0) {
                setCurrentTaskType('noconnections');
                setShowModal(true);
            }



        }).catch((error) => {
            alert(error)
        });

    }

    async function Delete(emailId: string) {

        axios.delete('https://localhost:44373/Connection/delete/', { params: { emailId: emailId, _id: id } }).then((response) => {
            console.log(response.data);
            setCurrentTaskType('connectiondeleted');
            setShowModal(true);
        }).catch((error) => { alert(error); })
    }
    async function Update(event: React.MouseEvent<HTMLButtonElement>) {

        event.preventDefault();
        const exists = emailIds.includes(connection);
        if (exists) {
            setCurrentTaskType('connectionexist');
            setShowModal(true);
            return;
        }
        if (connection == userEmail) {
            setCurrentTaskType("sameemail");
            setShowModal(true);
            return;
        }

        axios.get('https://localhost:44373/Connection/get/', { params: { _id: id } }).then((response) => {
            console.log(response.data);

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
                    setCurrentTaskType('connectionadded');
                    setShowModal(true);
                    setConnection('');

                }).catch((error) => {
                    alert("error in update " + error);
                });

        }).catch((error) => {
            alert("error in getting the _id  " + error);


        });
        setConnection('');

    }

    return (
        <><div>
            <form>
                <div>
                    <label>Add a New Connection</label>
                    <input
                        type="text"
                        className="form-control"
                        id="emailid"
                        placeholder={"Add Email of the required connection"}
                        onChange={(event) => {
                            setConnection(event.target.value);

                        }} />
                </div>

            </form>

            <div>
                <button className="btn btn-primary mt-4" onClick={Update}>
                    Add Connection
                </button>
            </div>
            <div>

                {<div>
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
                                                className="btn btn-success"
                                                onClick={() => handleViewCalendar(email)}
                                            >
                                                View Calendar
                                            </button>
                                            
                                          
                                          
                                            
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
           
            {currentTaskType && (<MyModal show={showModal} onClose={handleCloseModal} taskType={currentTaskType} />)}

        </div>

        </>


    );
}
export default Connections;