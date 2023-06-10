import axios from "axios";
import React , { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";

import DatePicker from 'react-datepicker';
import DateTimePicker from 'react-datetime-picker';
import "react-datepicker/dist/react-datepicker.css";
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import FullCalendar from '@fullcalendar/react'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import { useParams, useHistory } from "react-router-dom";

<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
type Event = {
      Id: string;
    UserId: string;
    EventName: string;
    Connections: Array<string>;
    StartDate: Date;
    EndDate: Date;

};

type Connection = {
    Id: string;
    emailId: string;
    Connection: Array<string>;

};
interface RouteParams {
    id: string;
}
function calenderweb()
{
    const [Id, setId] = useState<string>("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [UserName, setUserName] = useState<string>("");
    const [emailId, setEmailId] = useState<string>("");
    const [User, setUser] = useState<Connection>();
    const { id } = useParams<RouteParams>();
    const [Connection, setConnections] = useState<Array<string>>([""]);


    React.useEffect(() => {
       
    }, []);

    function set(user: Connection) {
        
        setConnections(user.Connection);
    }

    
     
    async function Post(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        
       
           
            axios.get('https://localhost:44373/Connection/get/', { params: { _id: id } }).then((response) => {
                console.log(response.data);
               
        
            axios.post("https://localhost:44373/User", {
                _id: "",
                UserId: id,
                EventName: UserName,
                StartDate: startDate,
                EndDate: endDate,
                Connections: response.data.connection,
               
            }).then((response) => {
                console.log(response.data);
                setId(response.data._id);
               
                alert("Event Created Succesfully");
             
                setUserName("");
                setStartDate(new Date());
                setEndDate(new Date());
                setEmailId("");
                setConnections([]);
            }).catch((error) => {alert("error in post "+error) });
            


           
        
            
                
            
        
            }).catch((error) => { alert("error in get " + error) });
    }
    




    async function Update(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
       
        console.log(Id);
        axios.put("https://localhost:44373/User/update",
       

            {
                _id: Id,
                UserId: id,
                EventName: UserName,
                EmailId: emailId,
                StartDate: startDate,
                EndDate: endDate,
                Connections:""


            }
        ).then((response) => {
            console.log(response.data);
            alert("Event Updated");
            setId('');
            setUserName('');
            setEmailId('');
            setStartDate(new Date());
            setEndDate(new Date());
        }).catch((error) => {alert("error with update "+ error) });
            
           }

  
    function startdatefn(date: Date) {
        if (date) {
            setStartDate(date)
            console.log(date)
            
        }
    }
    function enddatefn(date: Date) {
        if (date >= startDate) {
            setEndDate(date)
            console.log(date)

        }
    }
    const endTime = (date: Date) => {
        const isPastTime = startDate.getTime() > date.getTime();
        return !isPastTime;
    };
    const startTime = (date: Date) => {
        const isPastTime =  new Date().getTime() > date.getTime();
        return !isPastTime;
    };

    return (
        
        <div>
          <h1>User Details</h1>
            <div className="container mt-4">
                <div>
                    
                <label>Start Date-Time of your event : </label >
                    
                    <DatePicker
                        showTimeSelect
                        selected={startDate}
                        onChange={startdatefn}
                        dateFormat="MM/dd/yyyy h:mm aa"
                        filterTime={startTime}
                        timeIntervals={10}
                        timeInputLabel="Time:"
                       
                    />
                </div>
                <div>
                    <label>End Date-Time of your event: </label >
                   
                    <DatePicker
                   
                        selected={endDate}
                        onChange={enddatefn}
                        minDate={new Date()}
                        timeInputLabel="Time:"
                        dateFormat="MM/dd/yyyy h:mm aa"
                        showTimeSelect
                        timeIntervals={10}
                        filterTime={endTime}
                    />

                </div>
               
                <form>
                    <div className="form-group">

                       

                        <label>Event Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            value={UserName}
                            onChange={(event) => {
                                setUserName(event.target.value);
                               
                            }}
                        />
                      
                       

                     </div>
                </form >
            </div>
       
                        <button className="btn btn-primary mt-4" onClick={Post}>
                            Create Event
            </button>
            <button className="btn btn-primary mt-4" onClick={Update}>
                Edit an Event
            </button>
                    </div>
        
        
    );

} export default calenderweb;

