//import axios from "axios";
//import React, { useEffect, useState } from "react";


//type Connection = {
//    Id: string;
//    emailId: string;


//};

//function Login()
//{
//    const [emailId, setEmailId] = useState<string>("");
//    const [_id, setId] = useState<string>("");

//    useEffect(() => {
//        (async () => await Get())();
//    }, []);
//    async function Get() {




//    }
//    async function Post(event: React.MouseEvent<HTMLButtonElement>) {
//        event.preventDefault();
//      //  var user = await axios.get("https://localhost:44373/api/Connection/")
//        //    params:
//        //    {
//        //        EmailId: emailId
//        //        ,
//        //    }
//        //});
//        //alert("Account Exists");
//       // if (user == null) {
//            try {
//                await axios.post("https://localhost:44373/api/Connection", {

//                    _id: "",
//                    EmailId: emailId,
//                    Connection: ""

//                });
//                alert("Account has been created");

//                setEmailId("")
//                setId("")


//                Get();
//            } catch (err) {
//                alert(err);
//            }
//        }
//    }
//    return (
//        <div>
//            <form>
//                <div className="form-group">

//                    <input
//                        type="text"
//                        className="form-control"
//                        id="_id"
//                        hidden
//                        value={_id}
//                        onChange={(event) => {
//                            setId(event.target.value);


//                        }}
//                    />
//                </div>

//                <div>
//                    <label>Enter Your Email Id</label>
//                    <input
//                        type="text"
//                        className="form-control"
//                        id="emailid"
//                        value={emailId}
//                        onChange={(event) => {
//                            setEmailId(event.target.value);

//                        }}
//                    />
//                </div>



//            </form >
//            <div>
//            <button className="btn btn-primary mt-4" onClick={Post}>
//                login
//            </button>
//            </div>

//        </div >

//        );
//}export default Login;



import React, { useState, useEffect,ChangeEvent, FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Link } from "react-router-dom";
import Connections from './Connections';
import { useHistory } from 'react-router-dom';

function Login() {
   
    const [EmailId, setEmailId] = useState<string>('');
    const history = useHistory();
    useEffect(() => {
       // (async () => await handleFormSubmit)();
    }, [()=>handleEmailIdChange]);
    const handleEmailIdChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmailId(event.target.value);
    }; 

    const handleFormSubmit =  (event: FormEvent) => {
        event.preventDefault();


         axios.post('https://localhost:44373/Login/login', {

             EmailId: EmailId
        }).then((response) => {
            console.log(response.data);
            
            alert("Account Exists");
            history.push(`/Home/${response.data._id}`);
            
        }).catch((error) => {
            alert(" Creating a New Account");
            axios.post("https://localhost:44373/Login/signup", {

                EmailId: EmailId,
                
            }).then((response) => {
                console.log(response.data);

                alert("Account Created");
                history.push(`/Home/${response.data._id}`);
            }).catch((error) => {
                alert(error);
            });
});
        
        
        
        
    };

    //const handleFormSubmit = async (event: FormEvent) => {
    //    event.preventDefault();


    //    const response = await axios.post('https://localhost:44373/Login/login', {

    //        EmailId: "rithika"
    //    });
    //    console.log(response.data);
    //    if (response != null) {
    //        alert("Account Exists");
    //    }
    //    else {
    //        alert(" Created a New Account");
    //        try {
    //            await axios.post("https://localhost:44373/Login/signup", {

    //                EmailId: "rithika2"
    //            });
    //        }
    //        catch (err) {
    //            alert(err);
    //        }
    //        setEmailId("");
    //    }

    //};

    return (
        <form onSubmit={handleFormSubmit}>
            <div>
                <h1>Hello, Users!</h1>
                <p>Welcome to calendar web application</p>
                <p>SignUp/Login to Enter</p>
                <br />
            <input
                    type="text"
                    className="form-control"
                placeholder="EmailId"
                value={EmailId}
                onChange={handleEmailIdChange}
            />
            <div>
                    <button className="btn btn-primary mt-4" type="submit">Sign up / Login</button>
            </div>
            <div>

            <ul>
                {/*<li>*/}

                {/*    <Link to="/">Home</Link>*/}
                {/*</li>*/}
                {/*<li>*/}

                {/*    <Link to="/calenderweb">calenderweb</Link>*/}
                {/*</li>*/}
                {/*<li>*/}

                {/*    <Link to="/Connections">Connections</Link>*/}
             {/*   </li>*/}
               
                    </ul>
                </div>
            </div>
        </form>
    );
};

export default Login;

