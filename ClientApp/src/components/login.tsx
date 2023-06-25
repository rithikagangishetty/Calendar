import React, { useState, useEffect,ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import MyModal from './Modal';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
type TaskType = 'login' | 'signup'|'valid';

function Login() {
   
    const [EmailId, setEmailId] = useState<string>('');
    const history = useHistory();
    const [_id, setId] = useState<string>("");
   

    const [showModal, setShowModal] = useState(false);
    const [currentTaskType, setCurrentTaskType] = useState<TaskType | null>(null);
    const [valid, setValid] = useState<boolean>(false);
   
    const handleCloseModal = () => {
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
    const handleEmailIdChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmailId(event.target.value);
    }; 
   
    const handleFormSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (EmailId == "") {
            setCurrentTaskType('valid');
            setShowModal(true);
            setValid(true);
            return;
            
            
        }

         axios.post('https://localhost:44373/Login/login', {

             EmailId: EmailId
        }).then((response) => {
            console.log(response.data);
            setId(response.data._id);
            setCurrentTaskType('login');
            setShowModal(true);
            
         
            
        }).catch((error) => {
            
            axios.post("https://localhost:44373/Login/signup", {

                EmailId: EmailId,
                
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
        <div>
        <form onSubmit={handleFormSubmit}>
            <div>
                <h1>Hello, Users!</h1>
                <p>Welcome to calendar web application</p>
                <p>SignUp/Login your Email to Enter</p>
                <br />
            <input
                    type="text"
                    className="form-control"
                placeholder="Enter your Email"
                value={EmailId}
                onChange={handleEmailIdChange}
            />
                    <div>
                        <button className="btn btn-primary mt-4" type="submit">Sign up / Login</button>
                        {currentTaskType && (
                            <MyModal show={showModal} onClose={handleCloseModal} taskType={currentTaskType} />
                        )}
            </div>
           
           </div>
        </form>
            <div>
               
               
            </div>
            </div>

    );
};

export default Login;

