import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
type TaskType = 'connectionadded' |"noemail"| 'connectiondeleted' |"valid"|'noconnections' | 'connectionexist' | 'sameemail'; // Define the possible task types
import MyModal from './Modal';
interface RouteParams {
    id: string;


}
function Connections() {
    const [showModal, setShowModal] = useState(false);
    const [currentTaskType, setCurrentTaskType] = useState<TaskType | null>(null);
    const [connection, setConnection] = useState<string>("");
    const [emailIds, setEmailIds] = useState<Array<string>>([]);
    const [allEmails, setAllEmailIds] = useState<Array<string>>([]);
    const [userEmail, setUserEmail] = useState<string>('');
    const { id } = useParams<RouteParams>();
    const history = useHistory();
    const baseUrl = process.env.REACT_APP_URL;
    

 
   
        /// <summary>
        /// This function takes the emailId of the connection and gets the object Id of the user
        /// After getting the object Id of the connection it shows the connectionId calendar
        /// </summary>
        /// <param name="email">Email Id</param>

    const handleViewCalendar = (email: string) =>
    {
        var connectionId: string;
        axios.get(`${baseUrl}/Connection/getid/`, { params: { email: email } }).then((response) =>
        {
            connectionId = response.data._id;
            history.push(`/Home/Connections/calendar/${id}/${connectionId}`);
           

        }).catch((error) => {
            alert(error)
            return;
        });
      
    };

    //UseEffect renders the Get() function whenever a change is occured which can be obtained by currentTaskType.
    useEffect(() => {
        Get();
        GetAll();
    }, [currentTaskType]);
    const handleCloseModal = () => {
        setConnection("");
        setShowModal(false);
    };

    
        /// <summary>
        /// This function takes the object Id of the user and gets all the connections of the user.
        /// If user has no connections the modal no connections will pop up.This function re-renders everytime currentTaskType updates.
        /// </summary>
        
    function Get() {
        var emails: any;

        axios.get(`${baseUrl}/Connection/getemail/`, { params: { id: id } }).then((response) => {

           
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
    function GetAll() {
        var emails;
        axios.get(`${baseUrl}/Connection/getall/`, ).then((response) => {

       
            emails = response.data;
            
            if (emails.length > 0) {
                setAllEmailIds(emails)

            }

            



        }).catch((error) => {
            alert(error)
        });
    }
        /// <summary>
        /// This function takes the emailId of the connection the user wants to delete.
        /// After deleting the connection modal pops up.
        /// </summary>
        /// <param name="email">Email Id of the connection</param>

    async function Delete(emailId: string) {

        await axios.delete(`${baseUrl}/Connection/delete/`, { params: { emailId: emailId, id: id } }).then((response) => {
           
            setCurrentTaskType('connectiondeleted');
            setShowModal(true);
            setConnection('');
            setEmailIds(prevEmailIds => prevEmailIds.filter(email => email !== emailId));
        }).catch((error) => { alert(error); })
    }
        /// <summary>
        /// This function is used to update the connection list of the user
        ///First few checks are done. If the user adds already existing connection again or their own emailId or nothing, a modal pops up with the appropriate message
        ///After all the checks are done the connection array is updated and post request will be sent.
        /// </summary>
       
    async function Update(event: React.MouseEvent<HTMLButtonElement>) {

        event.preventDefault();
        const exists = emailIds.includes(connection);
        if (exists) {
            setCurrentTaskType('connectionexist');
            setShowModal(true);
            setConnection('');
            return;
        }
        
        if (connection == userEmail) {
            setCurrentTaskType("sameemail");
            setShowModal(true);
            setConnection('');
            return;
        }
        if (connection == "") {
            setCurrentTaskType("valid");
            setShowModal(true);
          
            return;
        }
        if (!allEmails.includes(connection))
        {
            setCurrentTaskType("noemail");
            setShowModal(true);
            setConnection('');
            return;
        }
        var newConnections;
        var Id;
        var Emailid;
        await axios.get(`${baseUrl}/Connection/get/`, { params: { id: id } }).then((response) => {
           
            Id = response.data._id;
            Emailid = response.data.emailId;
          newConnections = response.data.connection;
            if (response.data.connection != null) {
                newConnections = [...newConnections, connection];
            }
            if (response.data.connection == null) {
                newConnections = [connection];
            }
        
           
        }).catch((error) => {
            alert("error in getting the _id  " + error);
           

        });
        await axios.put(`${baseUrl}/Connection/update`,
            {

                _id: Id,
                EmailId: Emailid,
                Connection: newConnections,


            }).then((response) => {

                setEmailIds(prevEmailIds => [...prevEmailIds, connection]);
                setCurrentTaskType('connectionadded');
                setShowModal(true);
                

            }).catch((error) => {
                alert("error in update " + error);
                
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
                        value={connection }
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

                <div>
                    {emailIds.length > 0 && (
                        <table className="table table-light">
                            <thead>
                                <tr>
                                    <th scope="col">Your Connections</th>
                                </tr>
                            </thead>
                            <tbody>
                                {emailIds.map((email: any) => (
                                    <tr key={email}>
                                        <td>{email}</td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn btn-success"
                                                onClick={() => handleViewCalendar(email)}
                                            >
                                                View Calendar
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={() => Delete(email)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    )}
                </div>


            </div>
           
            {currentTaskType && (<MyModal show={showModal} onClose={handleCloseModal} taskType={currentTaskType} />)}

        </div>

        </>


    );
}
export default Connections;