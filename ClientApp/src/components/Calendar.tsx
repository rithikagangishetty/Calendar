import { FC, useState, useEffect, useRef } from 'react'
import { Calendar, Event, momentLocalizer, View } from 'react-big-calendar'
import moment from 'moment';
import React from 'react';
import { useParams, useNavigate } from "react-router-dom";
import 'moment-timezone'; 
import 'react-big-calendar/lib/css/react-big-calendar.css'
import styled from 'styled-components';
import axios from 'axios';
import './NavMenu.css';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import MyModal, { EditEventModal, CreateEventModal, SelectEmailModal, EventModal, DeleteConfirmModal } from './Modal';



type TaskType = 'eventadded' | 'eventdeleted' | 'overlap' | 'past' | 'monthpast' | "noevent"|'eventedited' | 'editpast' | 'eventclash' |"noconnections"; // Define the possible task types

const StyledDiv = styled.div`

  text-align: center;`; 


const CalendarApp: FC = () => {
    const localizer = momentLocalizer(moment);
    const [edit, setEdit] = useState<boolean>(false);
    const [isPast, setIsPast] = useState<boolean>(false);
    const [events, setEvents] = useState<Event[]>([]);
    const [creator, setCreator] = useState<boolean>(true);
    const [connections, setConnections] = useState<Array<string>>([]);
    const params = useParams();
    const id = params.id;
    const [showModal, setShowModal] = useState(false);
    const [prevSelectedTimezone, setPrevSelectedTimezone] = useState(defaultTimeZone);
    const [currentTaskType, setCurrentTaskType] = useState<TaskType | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteEventId, setDeleteEventId] = useState<string>('');
    const [deleteEventUserId, setDeleteEventUserId] = useState<string>('');
    const [deleteEvent, setDeleteEvent] = useState<Event>();
    const [userEmail, setUserEmail] = useState<string>('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState(false);
    const [titleInput, setTitleInput] = useState<string>('');
    const [startDate, setStart] = useState<Date>(new Date());
    const [endDate, setEnd] = useState<Date>(new Date());
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);
    const navigate = useNavigate();
    const [priv, setPrivate] = useState<boolean>(false);
    const baseUrl = process.env.REACT_APP_URL;
    const [selectedModerators, setSelectedModerators] = useState<string[]>([]);
    const [deleteUserEmail, setDeleteUserEmail] = useState<string>('');
    const [selectedConnections, setSelectedConnections] = useState<string[]>([]);
    const [connect, setConnect] = useState<string[]>([]);
    const [moder, setModer] = useState<string[]>([]);
    const timezones = moment.tz.names();
    const [selectedTimezone, setSelectedTimezone] = React.useState<string>('');
    const [deleteTimezone, setDeleteTimezone] = React.useState<string>('');
    const [initialTimezone, setInitialTimezone] = React.useState<string>('');
    const [validationError, setValidationError] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentView, setCurrentView] = useState<View>('month');

   const currentDate = moment();
    function goBack() {
        navigate(-1);
    }
    
    useEffect(() => {

        getEvents();
        GetConnections();
        if (selectedTimezone) {
            moment.tz.setDefault(selectedTimezone);
            setCurrentView(currentView); 
        }
       
        
    }, [selectedTimezone, showModal, currentView]);
    

   


    moment.tz.setDefault(selectedTimezone);

    // Handles timezone selection change
    const handleTimezoneChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setDeleteTimezone(event.target.value);
    }
   
    //onClose function sets all the form variables to empty so that the past information will not be shown.
    const onClose = () => {
        setTitleInput("");
        setSelectedConnections([]);
        setSelectedModerators([]);
        setPrevSelectedTimezone(defaultTimeZone);
        setPrivate(false);
    }

    //This function is to handle the state of Delete and Delete Confirmation Modal.
    const DeleteEventConfirm = () => {
        setConfirmationModal(true);
        setShowDeleteModal(false);
    }
   
    //Gets the defaultTimeZone of the client
    const defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
        /// <summary>
        /// getEvents will get all the events of the user based on the User id.
        ///Once all the events are obtained using setEvents all the events will be updated and will be shown in calendar page
        ///this function will be called everytime when the variables in the useEffect block changes
        /// </summary>
       
    const getEvents = () => {
        axios.get(`${baseUrl}/User/GetEvents`, { params: { id: id } }).then((response) => {
           
                const event = response.data.map((training: any) => {

                    return {
                        Id: training.id,
                        title: training.eventName,
                        start: new Date(training.startDate),
                        end: new Date(training.endDate),
                        allDay: false,
                        UserId: training.userId,
                        Moderator: training.moderator,
                        Connections: training.connections,
                        priv: training.priv,
                        TimeZone: training.timeZone,
                        Reminder: training.reminder,
                    }
                })
                setEvents(event);
            
            
          
        }).catch((err) => {
            alert(err+"get Events based on userId")
        });


    }
    /// <summary>
        ///Post function is used to add new events in the database
        ///Firstly, it obtains the data of the user who created the event using get request
        ///After that with all the proper information the post request will be sent
        ///Post request returns the event id which is used for sending emails
        ///After the post request is done, with the obtained event id ,subject and body , sendemail function will be called.
        ///Once all the events are obtained using setEvents all the events will be updated and will be shown in calendar page
        ///this function will be called everytime when the variables in the useEffect block changes
        /// </summary>
   


    async function Post() {

        
        var userConnections;
        var eventId;
        await axios.get(`${baseUrl}/Connection/GetUser`, { params: { id: id } }).then((response) => {

            userConnections = response.data.connection;

        }).catch((error) => { alert("error in get " + error) });
        await axios.post(`${baseUrl}/User/Post`,
            {
                Id: '',
                UserId: id,
                EventName: titleInput,
                StartDate: startDate,
                Moderator: selectedModerators,
                EndDate: endDate,
                Connections: (priv ? selectedConnections : userConnections),
                priv: priv,
                TimeZone: (selectedTimezone == "") ? defaultTimeZone : selectedTimezone,
                Reminder: false,
           }).then((response) => {
               eventId = response.data.id;
               setModer(response.data.moderator);
               setConnect(response.data.connections);
               
               if (eventId != "noevent" && eventId != "eventclash" && eventId != 'someevent') {
                   setShowCreateModal(false);
                   onClose();
                   setCurrentTaskType('eventadded');
                   setShowModal(true);
               }
               else if (eventId == "noevent") {
                   setShowCreateModal(false);
                   onClose();
                   setCurrentTaskType('noevent');
                   setShowModal(true);
               }
               else {
                   setShowCreateModal(false);
                   onClose();
                   setShowEventModal(true);

               }




            }).catch((error) => {
                alert("error in post " + error)
            });
        if (eventId != "noevent" && eventId != "eventclash" && eventId != "someevent") {

            axios.post(`${baseUrl}/User/SendMail`,
                {
                    Id: eventId,
                    UserEmail: id,
                    EventName: titleInput,
                    Moderator: selectedModerators,
                    Connections: (priv ? selectedConnections : userConnections),
                    StartDate: startDate,
                    EndDate: endDate,
                    Delete: false,
                    priv: priv,
                    Subject: "Event is Created",
                    Body: `An event titled '${titleInput}' has been created.
                The start time of the event is '${startDate}' and ends at '${endDate}'.`,
                }).then(() => {
                    // alert("email sent");
                }).catch((error) => {
                     alert("error in mail " + error)
                });
        }

    };

        /// <summary>
        /// GetConnections will get all the connections of the user based on the User id.
        ///this function will be called everytime when the variables in the useEffect block changes
        /// </summary>
    function GetConnections() {
        axios.get(`${baseUrl}/Connection/GetEmail`, { params: { id: id } }).then((response) => {
            setUserEmail(response.data.emailId);
            setConnections(response.data.connection);
            var res = response.data.connection;
            if (res.length == 0) {
                setCurrentTaskType('noconnections');
                setShowModal(true);
                navigate(`/Home/Connections/${id}`);
            }
        }).catch((error) => {
            alert(error+"to get all connections")
        });

    }
   
         /// <summary>
        /// DeleteEvent will delete the event based on the userId and event Id
        ///after axios delete api call the response is the details of the events
        ///Which are then used to send email after the deletion.
        ///this function will be called everytime when the variables in the useEffect block changes
        /// </summary>
    async function DeleteEvent(event: React.MouseEvent<HTMLButtonElement>) {
       event.preventDefault();
       
      
      var eventName;
      var moderator;
      var connection;
      var dateStart;
      var dateEnd;
        await axios.delete(`${baseUrl}/User/Delete`, { params: { id: deleteEventId, userId: id } }).then((response) => {


         eventName = response.data.eventName;
         moderator = response.data.moderator;
         connection = response.data.connections;
         dateStart = response.data.startDate;
         dateEnd = response.data.endDate;
            setShowDeleteModal(false);
            setConfirmationModal(false);
         setCurrentTaskType('eventdeleted');
            setShowModal(true);

         
         onClose();
        }).catch((error) => { alert(error+"deleting"); });
        axios.post(`${baseUrl}/User/SendMail`,
            {
                Id: deleteEventId,
                UserEmail: id,
                EventName: eventName,
                Moderator: moderator,
                Connections: connection,
                StartDate: dateStart,
                Delete: true,
                priv: priv,
                EndDate: dateEnd,
                Subject: "Event is Deleted",
                Body: `An event titled '${eventName}' has been deleted.`,
            }).then(() => {
              //  alert("email sent");
            }).catch((error) => {
                alert("error in mail " + error)
               });
     

    };
         /// <summary>
        ///Takes the event and returns the moderators and connections array with emailIds instead of object Id.
        /// </summary>
    
   async function  showEmails(event: any) {
       
        await axios
            .get(`${baseUrl}/User/GetEvent`, { params: { id: event.Id } })
            .then((response) => {
                const newEvent = {
                    title: response.data.eventName,
                    start: response.data.startDate,
                    end: response.data.endDate,
                    Moderator: response.data.moderator,
                    UserId: response.data.userId,
                    Connections: response.data.connections,
                    priv: response.data.priv,
                    Id: response.data.id,
                    TimeZone: response.data.timeZone,
                    Reminder: response.data.reminder,
                };
                
                setDeleteEvent(newEvent);
                setTitleInput(newEvent.title);
                setStart(new Date(newEvent.start));
                setEnd(new Date(newEvent.end));
                
                setSelectedModerators(newEvent.Moderator);
                setSelectedConnections(newEvent.Connections);
                setPrivate(newEvent.priv);
                setDeleteUserEmail(newEvent.UserId);
                setDeleteTimezone(newEvent.TimeZone);
                setInitialTimezone(newEvent.TimeZone);
                

                
            })
            .catch((error) => {
                alert(error+"show email error");


            });
        

     
    }

        /// <summary>
        /// EditEvent will edit the event after few checks
        ///After the user enters the start and end time it checks whether any existing event overlaps with the entered data
        ///If yes, a modal pops up with the suitable message
        ///Else, using the event id the document gets updated 
        ///After updating a email will be sent 
        ///this function will be called everytime when the variables in the useEffect block changes
        /// </summary>
    async function EditEvent(Priv:boolean) {
       
        var users;
        var eventId;
       
        for (var _event of events) {
            // Check if the event overlaps with any existing event
            if (_event.start !== undefined && _event.end !== undefined) {
                
                if (_event.Id != deleteEventId) {
                    if (
                        (startDate >= _event.start && startDate < _event.end) ||
                        (endDate > _event.start && endDate <= _event.end) ||
                        (startDate <= _event.start && endDate >= _event.end)
                    ) {
                        setCurrentTaskType('eventclash');
                        setShowModal(true);
                        return; // Clash found

                    }
                }
            }
        }
 
        await axios.get(`${baseUrl}/Connection/GetUser`, { params: { id: deleteEventUserId } }).then((response) => {

            users = response.data.connection;
            
        }).catch((error) => { alert("error in get " + error) });
       
        await axios.put(`${baseUrl}/User/Update`, {
            Id: deleteEventId,
            UserId: (creator)?deleteEventUserId:id,
            EventName: titleInput,
            StartDate: startDate,
            Moderator: selectedModerators,
            EndDate: endDate,
            Connections: (Priv ? selectedConnections : users),
            priv: Priv,
            TimeZone: (deleteTimezone == "") ? defaultTimeZone : deleteTimezone,
            Reminder: false,
        }).then((response) => {
           
            
            
            eventId = response.data.id;
            setModer(response.data.moderator);
            setConnect(response.data.connections);

            if (eventId != "noevent" && eventId != "eventclash" && eventId != 'someevent') {
                setShowEditModal(false);
                setShowDeleteModal(false);
                onClose();
                setEdit(false);
                setCurrentTaskType('eventedited');
                setShowModal(true);
            }  
            else if (eventId == "noevent") {
                setShowEditModal(false);
                setShowDeleteModal(false);
                onClose();
                setCurrentTaskType('noevent');
                setShowModal(true);
                setEdit(false);
            }
            else {
                setShowEditModal(false);
                setShowDeleteModal(false);
                onClose();
                setShowEventModal(true);
                setEdit(false);

            }
        }).catch((error) => { alert(error+"in edit"); });
        if (eventId != "noevent" && eventId != "eventclash" && eventId != "someevent") {
            await axios.post(`${baseUrl}/User/SendMail`,
                {
                    Id: deleteEventId,
                    UserEmail: id,
                    EventName: titleInput,
                    Moderator: selectedModerators,
                    Connections: (Priv ? selectedConnections : users),
                    StartDate: startDate,
                    EndDate: endDate,
                    priv: Priv,
                    Delete: false,
                    Subject: "Event is Edited",
                    Body: `An event titled '${titleInput}' has been created.The start time of the event is '${startDate}' and ends at '${endDate}'.`,
                }).then(() => {
                    //   alert("email sent");
                }).catch((error) => {
                      alert("error in mail " + error)
                });
        }
    };
        /// <summary>
        ///This function checks if there are any overlaps with the provided start and end times with all the events.
        ///If there are events which overlap they add into eventsInSlot, so when the length of eventsInSlot is zero, no overlap occurs
        /// </summary>
    const overlap = (slotInfo: any) => {
        // Check if there are any events within the selected slot
        const eventsInSlot = events.filter
            (
                event =>
                (
                    event.start && event.end &&
                    (
                        (slotInfo.start >= event.start && slotInfo.start < event.end) ||
                        (slotInfo.end > event.start && slotInfo.end <= event.end) ||
                        (slotInfo.start <= event.start && slotInfo.end >= event.end)
                    )
                )
            )


        // Prevent selection if events are present
        if (eventsInSlot.length > 0) {
            return true;
        }



    };
    ///<summary>
    ///handleSelectSlot when the user drags the time for event creation this function gets called
    ///All the basic checks are taken care of , like creation of event in the past,overlapping event creation
    ///Once all the checks are passed a new event will be added to the setEvents function which will help show in the calendar 
    ///</summary>
    const handleSelectSlot = (event: any) => {
        const selectedDate = moment(event.start);
       
        const isSameDay = selectedDate.isSame(currentDate, 'day');
       
        const isPastEvent = selectedDate.isBefore(currentDate);
        
        if (isSameDay && isPastEvent && currentView == "month") {
            setCurrentTaskType('monthpast');
            setShowModal(true);
            return;
        }
        if (!isSameDay && isPastEvent && currentView == "month") {
            setCurrentTaskType('past');
            setShowModal(true);
            return;
        }
        else if (isPastEvent && currentView!="month") {
            setCurrentTaskType('past');
            setShowModal(true);
            // Event is in the past, disable edit and delete options
            return;
        }
      


        else if (!isPastEvent) {

            setValidationError('');
            if (overlap(event)) {

                setCurrentTaskType('overlap');
                setShowModal(true);
                return;
            }

            else {
                setStart(event.start);
                setEnd(event.end);
                setShowCreateModal(true);


                if (titleInput.trim() !== '') {



                    const newEvent = {
                        title: titleInput,
                        start: event.start,
                        end: event.end,
                        Moderator: selectedModerators,
                        UserId: id,
                        Connections: (priv ? selectedConnections : connections),
                        priv: priv,
                        Id: "",
                        TimeZone: (selectedTimezone == "") ? defaultTimeZone : selectedTimezone,
                        Reminder: false,
                    };
                    setEvents([...events, newEvent]);

                }



            }
        }
      

    };
    ///This function is for the displaying of the title, start and end times when scrolled over an event.
    const CustomEventContent = ({ event }: any) => (
        <div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', textAlign: 'center' }}>{event.title}</div>
            <div style={{ fontSize: '13px' }}>{moment(event.start).format('LT')} - {moment(event.end).format('LT')}</div>
        </div>
    );
    const tooltipAccessor = (event: any) => {
        return `Title: ${event.title}\nStart: ${event.start.toLocaleString()}\nEnd: ${event.end.toLocaleString()}`;

    }

    // Override the time format to empty string which is shown in calendar
    const eventFormats = {
        eventTimeRangeFormat: () => '', 
    }

     ///<summary>
    ///handlePost when the user creates a public post this function is called
    ///All the basic checks like empty title is taken care of,
    ///With the help of Edit boolean variable the function seperates it from an edit/post request.
    ///If it is a edit, EditEvent() is called else Post() is called.
    
    ///</summary>
    function handlePost(event: React.MouseEvent<HTMLButtonElement>):void {
        event.preventDefault();
        
        if (titleInput.trim() == '') {
            setValidationError('Please enter a valid title.');
            return;
        }
       
        else {
            setValidationError('');
            setPrivate(false);
          
            if (edit) {
                
               
                    EditEvent(false);
                
            }
            else {
                Post();
            }
        }
    }

    ///<summary>
    ///The functioning is same as handlePost but this is called when the user creates a private post
    ///In the private post the user is allowed to choose the connections, so new modal will pop up where all the connections will be displayed
    ///That is done by the modal setShowEmailModal
    ///</summary>
    function handlePrivatePost(event: React.MouseEvent<HTMLButtonElement>):void {
        event.preventDefault();
       
        if (titleInput.trim() == '') {
            setValidationError('Please enter a valid title.');
            return;

        }
       
        else {
            setValidationError('');
            setPrivate(true);
            if (edit) {
                setShowEditModal(false);
            } else {
                setShowCreateModal(false);
            }
            setShowEmailModal(true);
        }
    }
        ///<summary>
        ///When the user wants to edit the function this will be called, it enables the edit modal pop up and makes edit variable true.
        ///</summary>
 function handleEditEvent(event: React.MouseEvent<HTMLButtonElement>) {
     //check this
     setShowDeleteModal(false);
     setEdit(true);
     setShowEditModal(true);
       }
        ///<summary>
        ///When the user clicks on any event this function is called.
        ///All the basic checks are done if the event is past ispast is set to true which disables the edit option.
        ///And the delete modal becomes true
        ///</summary>
   async function handleDelete(event: any) {
       setPrivate(event.priv);
       const eventStart = moment(event.start);
       
        const isPastEvent = eventStart.isBefore(currentDate);
       setIsPast(isPastEvent);
       if (!event.Moderator.includes(id) && event.UserId != id) {

           setIsPast(true);
       }
      
       setDeleteEventId(event.Id);
       setDeleteEventUserId(event.UserId);
       showEmails(event);

        setShowDeleteModal(true);
    };

    //This handleClose function is used to handle the state of create modal and sets all the form variables to empty; 
    const handleClose = () => {
        setShowCreateModal(false);
        onClose();
      
    }

    //This function is used to handle the state of create modal when the user else it will show the
    // private connections modal when it is not an edit action and sets all the form variables to empty it is to remove the
    //consective modal pop ups

    const onCloseEdit = () => {
        setShowEmailModal(false);
        if (!edit) {
            
            setShowCreateModal(true);
}
       // onClose();

    }

    //This handleClose function is used to handle the state of create modal and sets all the form variables to empty; 
    const onCloseConfirm = () => {
        setConfirmationModal(false);
        setShowDeleteModal(true);

    }

     //This function is to handle the state of Delete and Delete Confirmation modal and makes the form variables empty.
    const onCloseDelete = () => {
        setShowEditModal(false);
          onClose();
       
        

    }

     //This function is to handle the state of Delete modal and also makes the form variables empty.
    const onDelete = () => {
        onClose();
        setShowDeleteModal(false);
    }

    ///This is used for ellipses when the emailId is more than the width of the container it and ellipses are used
    ///It sets the expanded email if it is equal to index then the email is already expanded so it changes to null and viceversa.
    const [expandedEmail, setExpandedEmail] = useState<number | null>(null);
    const toggleExpand = (index: number) => {
        if (expandedEmail === index) {
            setExpandedEmail(null);
        } else {
            setExpandedEmail(index);
        }
    };

   ///<summary>
    ///This is the checkbox for the connections in the event details
    ///To avoid adding the same user twice as connection and moderator this function is used.
    ///It checks the selectedModerators array, all the users present in the array are disabled to select in the connections pop up
    ///</summary>
    const renderEmailCheckbox = (connection: string,index:number) => {
        const isDisabled = selectedModerators.includes(connection) || (connection == deleteUserEmail && creator);

        return (
            <Form.Check
                key={connection}
                type="checkbox"
                id={connection}
                className="expand"
                label={
                   
                    <span
                        className={`truncated ${expandedEmail === index ? 'expanded' : ''}`}
                        onClick={() => toggleExpand(index)}

                    >
                        {connection}
                    </span>
                }
                checked={selectedConnections.includes(connection)}
                onChange={() => handleUserSelection(connection,true)}
                disabled={isDisabled}
            />
        );
    };
    

        ///<summary>
       ///For the private post the user needs to select connection/moderator which is done using this function
       ///The user selected connection/moderators is the input,it checks if the connection is already present, if yes it will not update the array of selected
       ///else the new connection is added to the selected array
        ///</summary>
    const handleUserSelection = (user: string, connect: boolean) => {
        if (!connect) {
            if (selectedModerators.includes(user)) {
                setSelectedModerators(selectedModerators.filter((selectedModerator) => selectedModerator !== user));
            } else {
                setSelectedModerators([...selectedModerators, user]);
            }
        }
        else {
            const selected = [...selectedConnections];

            if (selected.includes(user)) {
                const index = selected.indexOf(user);
                selected.splice(index, 1);
            } else {
                selected.push(user);
            }

            setSelectedConnections(selected);

        }
    };

    ///This is the range of all the events in the database the earliest start date to the last end date.
    const allEventsRange = {
        start: moment.min(events.map(event => moment(event.start))).toDate(),
        end: moment.max(events.map(event => moment(event.end))).toDate(),
    };



    const handleNavigate = (date: Date) => {
        // Prevent navigation to a date outside the allEventsRange
      
        if (date < allEventsRange.start) {
            date = allEventsRange.start;
        } else if (date > allEventsRange.end) {
            date = allEventsRange.end;
        }

       
        
    };
   
    
        ///<summary>
        ///This is for the private post to make sure the user selects alteast one other user as connection/moderator.
        ///If the edit is true editevent is called else post is called
    ///</summary>
   
    const handleSaveSelectedConnections = () => {
        if (selectedModerators.length === 0 && selectedConnections.length === 0) {
            setValidationError('Please select at least one moderator or connection.');
        }
        else {
            setValidationError('');
            setSelectedConnections([]);
            setShowEmailModal(false);
            
            if (edit) {
                
                EditEvent(true);
                
            }
            else {
           
                Post();
            }
        }
    };

  //stylesheet of the calendar container

    const calendarContainerStyle = {
        height: "80vh",
        background: "white",
        width: "90%",
        padding:"10px"
       
    };

    return (
         
        <div style={{ paddingTop: '20px', height: '80%', overflow: 'hidden', paddingBottom: '20px'}} >

            <br />
            <StyledDiv>
                <label style={{ fontSize: '28px', fontWeight: 'bold', paddingBottom: "10px" }}> Welcome To Your Calendar Page,{userEmail}! </label>
                <br/>
                <label style={{ fontSize: '20px', fontWeight: 'bold', paddingBottom: "10px" }}> Select Timezone </label>
               
            <br/>
                <select value={selectedTimezone} onChange={(event)=>setSelectedTimezone(event.target.value)}>
                <option value=""> {defaultTimeZone}</option>
                {timezones.map((timezone) => (

                    <option key={timezone} value={timezone}>
                        {timezone}
                    </option>
                ))}
                </select>
            </StyledDiv>
            <div>
                <button className="back-button" onClick={goBack}>
                    Back
                </button>

            </div>
            <div >
                <br />
                <strong>
                    <StyledDiv>
                        {currentView != 'agenda' && (
                            <span>
                                Click an event to edit or delete
                            </span>
                        )}
                        {currentView === 'agenda' && (
                            <span>
                                All events spanning the month are displayed here.
                            </span>
                        )}
                  
                        <br />
                        {currentView === 'month' && (
                            <span>
                              The event will be created for the entire day i.e., 24 hours.
                            </span>
                        )}
                        {(currentView === 'week' || currentView=== "day") && (
                            <span>
                                To create an event, drag the mouse over the preferred time range on the calendar.
                            </span>
                        )}
                    </StyledDiv>
                </strong>
            </div>
            
            <br />
            <div className="calendarContainerStyle">
            <Calendar
                selectable
                defaultView='month'
                events={events}
                localizer={localizer}
                startAccessor="start"
                endAccessor="end"
               formats={eventFormats}
               titleAccessor="title"
              
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleDelete}
                tooltipAccessor={tooltipAccessor}
                onNavigate={handleNavigate}   
                onView={newView => setCurrentView(newView)}

                  
                components={{
                    event: CustomEventContent,
                  
                  
                }}
                
                    popup={true}
                    style={calendarContainerStyle}
                step={15}
                />
            </div>
          
            {currentTaskType && (
                <MyModal show={showModal} onClose={()=>setShowModal(false)} taskType={currentTaskType} />
            )}
          
            {deleteEvent && (
                <Modal show={showDeleteModal} onHide={onDelete} className="expand" >
                    <Modal.Header style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }} >
                       
                            <Modal.Title>Details of the Event</Modal.Title>
                        
                </Modal.Header>

                    <Modal.Body className="expand" >
                        <p><strong>Title:</strong> {deleteEvent.title}</p>
                        <p><strong>Event Created by:</strong> {deleteEvent.UserId}</p>
                        <p><strong>Event Type:</strong> {deleteEvent.priv ? 'Private' : 'Public'}</p>
                        <p><strong>TimeZone:</strong> {deleteEvent.TimeZone}</p>
                        {deleteEvent.start && (
                            <p><strong>Start:</strong> {new Date(deleteEvent.start).toLocaleString('en-US', {
                                timeZone: deleteEvent.TimeZone,
                                dateStyle: 'medium',
                                timeStyle: 'medium'
                            })}</p>
                        )}
                        {deleteEvent.end && (
                            <p><strong>End:</strong> {new Date(deleteEvent.end).toLocaleString('en-US', {
                                timeZone: deleteEvent.TimeZone,
                                dateStyle: 'medium',
                                timeStyle: 'medium'
                            })}</p>
                        )}
                        
                     
                        
                        {deleteEvent.Moderator && deleteEvent.Moderator.length > 0 && (
                            <>
                                <p><strong>Moderators:</strong></p>
                                <ul>
                                    {deleteEvent.Moderator.map((moderator: string, index: number) => (
                                        <li key={index} className="expand" >
                                           
                                            <span
                                                className={`truncated ${expandedEmail === index ? 'expanded' : ''}`}
                                                onClick={() => toggleExpand(index)}

                                            >
                                                {moderator}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}


                        {deleteEvent.Connections && deleteEvent.Connections.length > 0 && (
                            <div>
                                <p><strong>Connections:</strong></p>
                                <ul>
                                    {deleteEvent.Connections.map((connection: string, index: any) => (
                                        <li key={index}> <span
                        className={`truncated ${expandedEmail === index ? 'expanded' : ''}`}
                        onClick={() => toggleExpand(index)}

                    >
                        {connection}
                    </span></li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }} >
                           
                        </div>
                    </Modal.Body>


            <Modal.Footer style={{ display: "flex", justifyContent: "center" }}>
                <div>
                    <p><strong>{isPast ? "Do you want to delete this event?" : "Do you want to delete/edit this event"}</strong></p>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        {!isPast && (
                            <Button variant="success" onClick={handleEditEvent} disabled={isPast}>
                                Edit
                            </Button>
                        )}
                        <Button variant="danger" onClick={DeleteEventConfirm}>
                            Delete
                        </Button>
                                <Button variant="secondary" onClick={onDelete}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal.Footer>

                </Modal>)}
           
           
            <CreateEventModal
                show={showCreateModal}
                
                onClose={handleClose}
                onPost={handlePost}
                onPrivatePost={handlePrivatePost}
                validationError={validationError}
                titleInput={titleInput}
                onTitleInputChange={setTitleInput}
                connections={connections}
                selectedModerators={selectedModerators}
                handleUserSelection={handleUserSelection}
                start={startDate}
                end={endDate}
                defaultTimeZone={defaultTimeZone}
                Timezone={selectedTimezone}

            />
            <EditEventModal
                initialTimezone={initialTimezone}
                handleTimezoneChange={handleTimezoneChange}
                show={showEditModal}
                userId={deleteUserEmail}
                creator={creator}
                selectedTimezone={deleteTimezone}
                defaultTimeZone={defaultTimeZone}
                timezones={timezones}
                onClose={onCloseDelete}
                onPost={handlePost}
                setCreator={setCreator}
                onPrivatePost={handlePrivatePost}
                validationError={validationError}
                titleInput={titleInput}
                onTitleInputChange={setTitleInput}
                setEnd={setEnd}
                setStart={setStart}
                start={startDate}
                end={endDate}
                connections={connections}
                setSelectedModerators={setSelectedModerators}
                selectedModerators={selectedModerators}
                handleUserSelection={handleUserSelection}
                priv={priv}
               
                />

            <SelectEmailModal
                
                show={showEmailModal}
                onClose={onCloseEdit}
                onSaveSelectedConnections={handleSaveSelectedConnections}
                validationError={validationError}
                connections={connections}
                renderEmailCheckbox={renderEmailCheckbox}
               
               
            />
            <EventModal
                show={showEventModal}
                onHide={() => setShowEventModal(false)}
                moderators={moder}
                connections={connect}
            />
            <DeleteConfirmModal
                show={confirmationModal}
                onClose={onCloseConfirm}
                onDelete={DeleteEvent}
            />
           
           
        </div >
    );
}; export default CalendarApp;





