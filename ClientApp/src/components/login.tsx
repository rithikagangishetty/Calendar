﻿import React, { useState, useEffect,ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import MyModal from './Modal';
import './NavMenu.css';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './loginStyles.css';
import styled from 'styled-components';
type TaskType = 'login' | 'signup' | 'valid' | "newaccount" | "exists";

function Login() {
    const [EmailId, setEmailId] = useState<string>('');
    const navigate = useNavigate();
    const [Id, setId] = useState<string>("");
    const [showModal, setShowModal] = useState(false);
    const [currentTaskType, setCurrentTaskType] = useState<TaskType | null>(null);
    const [valid, setValid] = useState<boolean>(true);
    const baseUrl = process.env.REACT_APP_URL;
    const [allEmails, setAllEmailIds] = useState<Array<string>>([]);
    const [signUp, setSignUp] = useState<boolean>(false);
    useEffect(() => {
       
        GetAll();
    }, [currentTaskType]);
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
    /// This function will get all the email Ids that are present in the database
    /// </summary>
    function GetAll() {
        var emails;
        axios.get(`${baseUrl}/Connection/Get/`,).then((response) => {
            emails = response.data;
            if (emails.length > 0) {
                setAllEmailIds(emails)

            }
        }).catch((error) => {
            alert(error)
        });
    }
    /// <summary>
    /// This function handles the submission of the Email Id after all the checks are done
    ///If the email is valid and present already it wont store again, else it creates a new document in the collection.
    /// </summary>
    const handleFormSubmit = (event: FormEvent) => {
        event.preventDefault();
      
        var contain = allEmails.includes(EmailId);
        if (!contain && validateEmail(EmailId) && !signUp) {
            setCurrentTaskType('newaccount');
            setShowModal(true);
            setSignUp(true);
            setValid(false);
            setEmailId("");
            return;
        }
        if (contain && validateEmail(EmailId) && signUp) {
            setCurrentTaskType('exists');
            setShowModal(true);
            setSignUp(false);
            setValid(false);
            setEmailId("");
            return;
        }
        if (validateEmail(EmailId)) {
            axios.post(`${baseUrl}/Login/Login`, {
                Id: "",
                EmailId: EmailId,
                Connection: []
            }).then((response) => {

                setId(response.data.id);
                if (contain) {
                    setCurrentTaskType('login');
                }
                else {
                    setCurrentTaskType("signup");
                }
                setShowModal(true);
            }).catch((error) => {
                alert(error)
              
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
                {!signUp &&
                    <div className="text-center">
                        <h5>Enter Your Email to Login</h5>

                    </div>
                }
                {signUp &&
                    <div className="text-center">
                        <h5>Enter Your Email to Sign Up</h5>

                    </div>
                }
                <br />
              
                <div className="form-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter EmailId"
                        value={EmailId}                 
                        onChange={(event) => setEmailId(event.target.value)}
                    />
                </div>
                <div className="text-center">
                    <button className="btn btn-primary mt-4" type="submit">{signUp ? "SignUp" : "Login"}</button>
                </div>
                <br/>
                {!signUp&&
                    <div>
                        Don't have an account? <span className="signup-button" onClick={() => setSignUp(true)}>SignUp</span>
                    </div>
                }
                {signUp &&
                    <div>
                        Go Back to Login! <span className="signup-button" onClick={() => setSignUp(false)}>Login</span>
                    </div>}
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
