﻿import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
type TaskType = 'connectionadded' | "noemail" | 'connectiondeleted' | "valid" | 'noconnections' | 'connectionexist' | 'sameemail'; // Define the possible task types
import MyModal, { Logout } from './Modal';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'react-datepicker/dist/react-datepicker.css';


function Connections() {
    const [showModal, setShowModal] = useState(false);
    const [expandedEmail, setExpandedEmail] = useState<number | null>(null);
    const [currentTaskType, setCurrentTaskType] = useState<TaskType | null>(null);
    const [connection, setConnection] = useState<string>("");
    const [emailIds, setEmailIds] = useState<Array<string>>([]);
    const [email, setEmail] = useState<string>("");
    const [allEmails, setAllEmailIds] = useState<Array<string>>([]);
    const [userEmail, setUserEmail] = useState<string>('');
    const params = useParams();
    const id = params.id;
    const [confirmationModal, setConfirmationModal] = useState(false);
    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_URL;
   
    const toggleExpand = (index: number) => {
        if (expandedEmail === index) {
            setExpandedEmail(null);
        } else {
            setExpandedEmail(index);
        }
    };
  
    function goBack() {
        navigate(`/Home/${id}`);
    }
   
        /// <summary>
        /// This function takes the emailId of the connection and gets the object Id of the user
        /// After getting the object Id of the connection it shows the connectionId calendar
        /// </summary>
        /// <param name="email">Email Id</param>

    const handleViewCalendar = (email: string) =>
    {
        var connectionId: string;
        axios.get(`${baseUrl}/Connection/GetId/`, { params: { email: email } }).then((response) =>
        {
            connectionId = response.data.id;
            navigate(`/Home/Connections/calendar/${id}/${connectionId}`);
           

        }).catch((error) => {
            alert(error)
            return;
        });
      
    };
    const DeleteEventConfirm = (email: any) => {
        setConfirmationModal(true);
        setEmail(email);
        
    }

    //UseEffect renders the Get() and GetAll() function whenever a change is occured which can be obtained by currentTaskType.
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
        axios.get(`${baseUrl}/Connection/GetEmail/`, { params: { id: id } }).then((response) => {

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
        /// <summary>
        /// Checks whether the entered email Id is valid or not and returns true if it is valid.
        /// </summary>
    const validateEmail = (email: string) => {
        const pattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
        return pattern.test(email);
    };
         /// <summary>
        /// This function will get all the email Ids that are present in the database
        /// </summary>
    function GetAll() {
        var emails;
        axios.get(`${baseUrl}/Connection/Get/`, ).then((response) => {
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
        setConfirmationModal(false)
        await axios.delete(`${baseUrl}/Connection/Delete/`, { params: { emailId: emailId, id: id } }).then((response) => {
           
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
        if (connection == "" || !validateEmail(connection)) {
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

        await axios.get(`${baseUrl}/Connection/GetUser/`, { params: { id: id } }).then((response) => {
           
            Id = response.data.id;
            Emailid = response.data.emailId;
          newConnections = response.data.connection;
            if (response.data.connection != null) {
                newConnections = [...newConnections, connection];
            }
            if (response.data.connection == null) {
                newConnections = [connection];
            }
        }).catch((error) => {
            alert("error in getting the Id  " + error);
           

        });
        await axios.put(`${baseUrl}/Connection/Update`,
            {

                Id: Id,
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


    const styles = {
        main: {padding:"30px"},
        header: {
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            minHeight: "500vh",
           // background: "white",
            marginBottom: "20px",
        },
        content: {
         //  background: "white",
            padding: "20px",
            borderRadius: "0px",
           
            
        },
        heading: {
            textAlign: "center",
            marginBottom: "20px",
        },
        form: {
            marginBottom: "20px",
            
        },
        table: {
            width: "100%",
            backgroundColor: 'transparent',
            
             
            
        },

    };
  
    // Merge responsive styles into main styles
   
    return (
       
        <>
            <Logout />
            <div style={styles.main }>
            <div>
               
                    <button className="back-button" onClick={goBack}>
                        Back
                    </button>

            </div>

            <div >

                <div style={styles.content}>


                        <form style={styles.form}>
                            <div className="style">
                                <label style={{ fontSize: '28px', fontWeight: 'bold', paddingBottom: "10px" }}> Welcome To Your Connections Page,  {userEmail}! </label>
                                <br/>
                            
                            </div>
                            <div className="style">
                                <label style={{ fontSize: '20px', fontWeight: 'bold', paddingBottom: "10px", textAlign: "center" }}>Add a New Connection</label>
                               

                            </div>
                            
                       
                       
                            <div  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    className="formControl"
                                    id="emailid"
                                    value={connection}
                                    placeholder="Add Email of the required connection"
                                    onChange={(event) => {
                                        setConnection(event.target.value);
                                    }}
                                />
                            </div>

                            <div style={{ textAlign: "center" }}>
                        <button className="btn btnPrimary mt-4" onClick={Update}>
                            Add Connection
                            </button>
                        </div>
                        </form>
                        {emailIds.length > 0 && (
                       <><hr style={{ borderTop: "1px solid black", margin: "20px 0" }} /><div style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px" }}> {/* Centered container for the label */}
                                <label style={{ fontSize: "20px", fontWeight: "bold", textAlign: "center" }}>Your Connections</label>
                            </div><table className="CustomTable" style={{ ...styles.table, tableLayout: 'fixed' /*, borderCollapse: 'collapse' */ }}>
                                    <colgroup>
                                        <col style={{ width: '60%' }} /> {/* Adjust the column widths as needed */}
                                        <col style={{ width: '20%' }} />
                                        <col style={{ width: '20%' }} />
                                    </colgroup>
                                    <tbody>
                                        {emailIds.map((email, index) => (
                                            <tr key={email}>
                                                <td
                                                    className={`customTableCell ${expandedEmail === index ? 'expanded' : ''}`}
                                                    onClick={() => toggleExpand(index)}
                                                >
                                                    {email}
                                                </td>
                                                <td className="customTableCell" style={{ textAlign: "center" }}>
                                                    <button
                                                        type="button"
                                                        className="btn btn-success"
                                                        onClick={() => handleViewCalendar(email)}
                                                    >
                                                        View Calendar
                                                    </button>
                                                </td>
                                                <td className="customTableCell" style={{ textAlign: "center" }}>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger"
                                                        onClick={() => DeleteEventConfirm(email)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table></>
                        )}
                    

                   </div>
                </div>
                {currentTaskType && (
                    <MyModal show={showModal} onClose={handleCloseModal} taskType={currentTaskType} />
                )}
                <Modal show={confirmationModal} onHide={() => setConfirmationModal(false)}>
                    <Modal.Header style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <Modal.Title> <strong>Delete Confirmation </strong></Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <p>          <strong> Are you sure you want to delete?</strong></p>   </Modal.Body>
                    <Modal.Footer style={{ display: 'flex', justifyContent: 'center' }}>

                        <Button variant="danger" onClick={()=>Delete(email)}>
                            Yes
                        </Button>
                        <Button variant="secondary" onClick={() => setConfirmationModal(false)}>
                            No
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div></>
             
    );
       
}
export default Connections;




                                            
