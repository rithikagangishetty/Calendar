import React, { useState, useEffect,ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import MyModal from './Modal';
import './NavMenu.css';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
type TaskType = 'login' | 'signup'|'valid';
type Connections = {
    _id: string;
    emailId: string;
    Connection: Array<string>;

};
function Login() {
   
    const [EmailId, setEmailId] = useState<string>('');
    const history = useHistory();
    const [_id, setId] = useState<string>("");
    //Modal pop up for signup and login
    const [showModal, setShowModal] = useState(false);
    const [currentTaskType, setCurrentTaskType] = useState<TaskType | null>(null);
    
    const [valid, setValid] = useState<boolean>(false);
   
    const handleCloseModal = () => {
        //Valid check for the email Id 
        if (valid) {
            history.push(`/`);
           
            setShowModal(false);
            setValid(false);
        }
        else {
            history.push(`/Home/${_id}`);
            setShowModal(false);
        }
       
    };
    useEffect(() => {

    }, [currentTaskType]);
    //Whenever the EmailId is changed it sets the value of the email Id.
    const handleEmailIdChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmailId(event.target.value);
    }; 

    ///Function checks whether the entered Email Id is present in the database,
    ///Fist goes to login function if it is present then retrives the id of the document and pushes to the home page
    ///else,creates/calls signup function and retrives id and pushes to the home page
    const handleFormSubmit = (event: FormEvent) => {
        event.preventDefault();
        //Prevents the user from logging in without entering any data
        if (EmailId == "") {
            setCurrentTaskType('valid');
            setShowModal(true);
            setValid(true);
            return;
            
            
        }
       
         axios.post('https://localhost:44373/Login/login', {

             _id: "",
             EmailId: EmailId,
             Connection:[]
        }).then((response) => {
            console.log(response.data);
            setId(response.data._id);
            setCurrentTaskType('login');
            setShowModal(true);
            
         
            
        }).catch((error) => {
            
            axios.post("https://localhost:44373/Login/signup", {

                _id: "",
                EmailId: EmailId,
                Connection: []
                
            }).then((response) => {
                console.log(response.data);
                setId(response.data._id);
                setCurrentTaskType('signup');
                setShowModal(true);
               
            }).catch((error) => {
                alert(error);
            });
});
        
        
        
        
    };
    return (
        <div className="container">
            <form className="my-form" onSubmit={handleFormSubmit}>
                <div className="text-center">
                    <h1 className="my-heading">Hello, Users!</h1>
                    <h3>Welcome to the calendar web application</h3>
                    
                </div>
                <br />
                <div className="text-center">
                    <h5>Sign up/Login with your Email to Enter</h5>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your Email"
                        value={EmailId}
                        onChange={handleEmailIdChange}
                    />
                </div>
                <div className="text-center">
                    <button className="btn btn-primary mt-4" type="submit">Sign up / Login</button>
                    {currentTaskType && (
                        <MyModal show={showModal} onClose={handleCloseModal} taskType={currentTaskType} />
                    )}
                </div>
            </form>
        </div>


    );
};

export default Login;

