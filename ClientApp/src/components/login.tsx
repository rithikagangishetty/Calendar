import React, { useState, useEffect,ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import MyModal from './Modal';
import './NavMenu.css';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './loginStyles.css';
import styled from 'styled-components';
type TaskType = 'login' | 'signup' | 'valid';
const ResetDefaults = styled.div`
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
  }
`;

const BodyContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #D3D3D3;
`;

const CustomTableCell = styled.div`
  word-break: break-all;
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #D3D3D3;
`;

const LoginForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 600px;
  width: 120%;
  height: 500px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: floralwhite;
`;

const MyHeading1 = styled.h1`
  font-weight: bold;
  font-size: 40px;
  color: #0056b3;
  font-family: Calibri;
`;

const MyHeading2 = styled.h2`
  font-weight: bold;
  font-size: 30px;
  color: #333;
  font-family: Calibri;
`;

const TextCenter = styled.div`
  text-align: center;
  font-family: Arial;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const FormControl = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  color: #333;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const PrimaryButton = styled.button`
  width: 150px;
  padding: 5px;
  font-size: 18px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
`;

const ConnectionsContainer = styled.div`
  text-align: center;
  padding-top: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;

  /* Increase the length of the buttons */
  button {
    margin: 0 10px;
    padding: 10px 20px;
  }
`;
function Login() {
    const [EmailId, setEmailId] = useState<string>('');
    const history = useHistory();
    const [_id, setId] = useState<string>("");
    const [showModal, setShowModal] = useState(false);
    const [currentTaskType, setCurrentTaskType] = useState<TaskType | null>(null);
    const [valid, setValid] = useState<boolean>(true);
    const baseUrl = process.env.REACT_APP_URL;
    /// <summary>
    /// This function handles the close of the modal and pushes the page into home page when valid email is entered.
    /// </summary>
    const handleCloseModal = () => {
        if (valid) {
            history.push(`/Home/${_id}`);
            setShowModal(false);
        } else {
            history.push(`/`);
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
        
        if (/*validateEmail(EmailId)*/ true) {
            axios.post(`${baseUrl}/Login/login`, {
                _id: "",
                EmailId: EmailId,
                Connection: []
            }).then((response) => {

                setId(response.data._id);
                setCurrentTaskType('login');
                setShowModal(true);
            }).catch((error) => {
                axios.post(`${baseUrl}/Login/signup`, {
                    _id: "",
                    EmailId: EmailId,
                    Connection: []
                }).then((response) => {

                    setId(response.data._id);
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
