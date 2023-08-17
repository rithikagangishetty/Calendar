import React, { useState, useEffect,ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import MyModal from './Modal';
import './NavMenu.css';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './loginStyles.css';
import styled from 'styled-components';
type TaskType = 'login' | 'signup' | 'valid';

function Login() {
    const [EmailId, setEmailId] = useState<string>('');
    const navigate = useNavigate();
    const [Id, setId] = useState<string>("");
    const [showModal, setShowModal] = useState(false);
    const [currentTaskType, setCurrentTaskType] = useState<TaskType | null>(null);
    const [valid, setValid] = useState<boolean>(true);
    const baseUrl = process.env.REACT_APP_URL;
    /// <summary>
    /// This function handles the close of the modal and pushes the page into home page when valid email is entered.
    /// </summary>
    const handleCloseModal = () => {
        if (valid) {
            navigate(`/Home/${Id}`);
            setShowModal(false);
        } else {
            navigate(`/`);
            setShowModal(false);
            setValid(true);
        }
    };
    const validateEmail = (email:string) => {
        const pattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
        return pattern.test(email);
    };
    /// <summary>
    /// This function handles the submission of the Email Id after all the checks are done
    ///If the email is valid and present already it wont store again, else it creates a new document in the collection.
    /// </summary>
    const handleFormSubmit = (event: FormEvent) => {
        event.preventDefault();
        
        if (validateEmail(EmailId)) {
            axios.post(`${baseUrl}/Login/Login`, {
                Id: "",
                EmailId: EmailId,
                Connection: []
            }).then((response) => {

                setId(response.data.id);
                setCurrentTaskType('login');
                setShowModal(true);
            }).catch(() => {
                
                axios.post(`${baseUrl}/Login/Signup`, {
                    Id: "",
                    EmailId: EmailId,
                    Connection: []
                }).then((response) => {

                    setId(response.data.id);
                    setCurrentTaskType('signup');
                    setShowModal(true);
                }).catch((error) => {
                    alert(error);
                });
            });
        }
        else {
            setCurrentTaskType('valid');
            setShowModal(true);
            setValid(false);
            return;
        }
    };

    return (
        <div className="login-container">
            <form className="my-form" onSubmit={handleFormSubmit}>
                <div className="text-center">
                    <h1 className="my-heading-1">Hello, Users!</h1>
                    <h3 className="my-heading-2">Welcome To The Calendar Web Application</h3>
                </div>
                <br />
                <div className="text-center">
                    <h5>Sign up/Login With Your EmailId to Enter</h5>
                </div>
                <br/>
                <div className="form-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your Email"
                        value={EmailId}
                       
                        onChange={(event) => setEmailId(event.target.value)}
                    />
                </div>
                <div className="text-center">
                    <button className="btn btn-primary mt-4" type="submit">Sign up / Login</button>
                </div>
            </form>
            {currentTaskType && (
                <div className={`modal-container ${showModal ? 'show' : 'hide'}`}>
                    <MyModal show={showModal} onClose={handleCloseModal} taskType={currentTaskType} />
                </div>
            )}
        </div>

    );

};

export default Login;
