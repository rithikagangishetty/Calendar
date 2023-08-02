import { FC, useState, useEffect } from 'react'
import { Calendar, Event, momentLocalizer, View } from 'react-big-calendar'
import moment from 'moment';
import React from 'react';
import 'moment-timezone'; 
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useHistory, useParams } from 'react-router-dom'
import axios from 'axios';
import './NavMenu.css';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components';
import MyModal, { EditEventModal, CreateEventModal, SelectEmailModal, DeleteModal } from './Modal';



type TaskType = 'eventadded' | 'eventdeleted' | 'overlap' | 'past' | 'monthpast' | "noevent"|'eventedited' | 'editpast' | 'eventclash' |"noconnections"; // Define the possible task types
interface RouteParams {
    id: string;
}
const StyledDiv = styled.div`
  text-align: center;`;

const CalendarApp: FC = () => {
    const localizer = momentLocalizer(moment);
    const [edit, setEdit] = useState<boolean>(false);
    const [isPast, setIsPast] = useState<boolean>(false);
    const [events, setEvents] = useState<Event[]>([]);
    const [creator, setCreator] = useState<boolean>(true);
    const [connections, setConnections] = useState<Array<string>>([]);
    const { id } = useParams<RouteParams>();
    const [showModal, setShowModal] = useState(false);
    const [currentTaskType, setCurrentTaskType] = useState<TaskType | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteEventId, setDeleteEventId] = useState<string>('');
    const [deleteEventUserId, setDeleteEventUserId] = useState<string>('');
    const [deleteEvent, setDeleteEvent] = useState<Event>();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [titleInput, setTitleInput] = useState<string>('');
    const [startDate, setStart] = useState<Date>(new Date());
    const [endDate, setEnd] = useState<Date>(new Date());
    const [showEmailModal, setShowEmailModal] = useState(false);
    const history = useHistory();
    const [priv, setPrivate] = useState<boolean>(false);
    const baseUrl = process.env.REACT_APP_URL;
    const [selectedModerators, setSelectedModerators] = useState<string[]>([]);
    const [deleteUserEmail, setDeleteUserEmail] = useState<string>('');
    const [selectedConnections, setSelectedConnections] = useState<string[]>([]);
    const timezones = moment.tz.names();
    const [selectedTimezone, setSelectedTimezone] = React.useState<string>('');
    const [validationError, setValidationError] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentView, setCurrentView] = useState<View>('month');

    const handleViewChange = (view: View) => {
        setCurrentView(view);
    };
    const currentDate = moment();
 

    useEffect(() => {

        getEvents();
        GetConnections();

        moment.tz.setDefault();
    }, [selectedTimezone, showModal]);

   


    moment.tz.setDefault(selectedTimezone);

    // Handles timezone selection change
    const handleTimezoneChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTimezone(event.target.value);
    };

    const onClose = () => {
        setTitleInput("");
        setStart(currentDate.toDate());
        setSelectedConnections([]);
        setSelectedModerators([]);
        setEnd(currentDate.toDate());
        setPrivate(false);
    }
    //Gets the defaultTimeZone of the client
    const defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        /// <summary>
        /// getEvents will get all the events of the user based on the User id.
        ///Once all the events are obtained using setEvents all the events will be updated and will be shown in calendar page
        ///this function will be called everytime when the variables in the useEffect block changes
        /// </summary>
       
    const getEvents = () => {
        axios.get(`${baseUrl}/User/getallevents`, { params: { id: id } }).then((response) => {
           
                const event = response.data.map((training: any) => {

                    return {
                        _id: training._id,
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
            alert(err)
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
        await axios.get('https://localhost:44373/Connection/get', { params: { id: id } }).then((response) => {

            userConnections = response.data.connection;

        }).catch((error) => { alert("error in get " + error) });
        await axios.post(`${baseUrl}/User/post`,
            {
                _id: '',
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
               eventId = response.data;
               if (eventId != "noevent") {
                   setShowCreateModal(false);
                   onClose();
                   setCurrentTaskType('eventadded');
                   setShowModal(true);
               }
               else {
                   setShowCreateModal(false);
                   onClose();
                   setCurrentTaskType('noevent');
                   setShowModal(true);
               }




            }).catch((error) => {
                alert("error in post " + error)
            });
        if (eventId != "noevent") {

            axios.post(`${baseUrl}/User/sendmail`,
                {
                    _id: eventId,
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
                    // alert("error in mail " + error)
                });
        }

    };
        /// <summary>
        /// GetConnections will get all the connections of the user based on the User id.
        ///this function will be called everytime when the variables in the useEffect block changes
        /// </summary>
    function GetConnections() {
        axios.get(`${baseUrl}/Connection/getemail`, { params: { id: id } }).then((response) => {
            
            setConnections(response.data.connection);
            var res = response.data.connection;
            if (res.length == 0) {
                setCurrentTaskType('noconnections');
                setShowModal(true);
                history.push(`/Home/Connections/${id}`);
            }
        }).catch((error) => {
            alert(error)
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
        await axios.delete(`${baseUrl}/User/`, { params: { id: deleteEventId, userId: id } }).then((response) => {


         eventName = response.data.eventName;
         moderator = response.data.moderator;
         connection = response.data.connections;
         dateStart = response.data.startDate;
         dateEnd = response.data.endDate;
         setShowDeleteModal(false);
         setCurrentTaskType('eventdeleted');
            setShowModal(true);

         
         onClose();
        }).catch((error) => { alert(error); });
        axios.post(`${baseUrl}/User/sendmail`,
            {
                _id: deleteEventId,
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
             //   alert("error in mail " + error)
               });
     

    };
         /// <summary>
        ///Takes the event and returns the moderators and connections array with emailIds instead of object Id.
        /// </summary>
    
   async function  showEmails(event: any) {
       
        await axios
            .get(`${baseUrl}/User/getevent`, { params: { id: event._id } })
            .then((response) => {
                const newEvent = {
                    title: response.data.eventName,
                    start: response.data.startDate,
                    end: response.data.endDate,
                    Moderator: response.data.moderator,
                    UserId: response.data.userId,
                    Connections: response.data.connections,
                    priv: response.data.priv,
                    _id: response.data._id,
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

                

                
            })
            .catch((error) => {
                alert(error);


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
        
       
        for (var _event of events) {
            // Check if the event overlaps with any existing event
            if (_event.start !== undefined && _event.end !== undefined) {
                
                if (_event._id != deleteEventId) {
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
 
        await axios.get(`${baseUrl}/Connection/get`, { params: { id: deleteEventUserId } }).then((response) => {

            users = response.data.connection;
            
        }).catch((error) => { alert("error in get " + error) });
       
        await axios.put(`${baseUrl}/User/`, {
            _id: deleteEventId,
            UserId: (creator)?deleteEventUserId:id,
            EventName: titleInput,
            StartDate: startDate,
            Moderator: selectedModerators,
            EndDate: endDate,
            Connections: (Priv ? selectedConnections : users),
            priv: Priv,
            TimeZone: (selectedTimezone == "") ? defaultTimeZone : selectedTimezone,
            Reminder: false,
        }).then(() => {
           
            
            setCurrentTaskType('eventedited');
            setShowModal(true);
            setShowEditModal(false);
            setShowDeleteModal(false);
            onClose();
            setEdit(false);
        }).catch((error) => { alert(error); });

        await axios.post(`${baseUrl}/User/sendmail`,
            {
                _id: deleteEventId,
                UserEmail: id,
                EventName: titleInput,
                Moderator: selectedModerators,
                Connections: (Priv ? selectedConnections : users),
                StartDate: startDate,
                EndDate: endDate,
                priv: Priv,
                Delete:false,
                Subject: "Event is Edited",
                Body: `An event titled '${titleInput}' has been created.The start time of the event is '${startDate}' and ends at '${endDate}'.`,
            }).then(() => {
             //   alert("email sent");
            }).catch((error) => {
              //  alert("error in mail " + error)
            });

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

        if (isPastEvent && !isSameDay) {
            setCurrentTaskType('past');
            setShowModal(true);
            // Event is in the past, disable edit and delete options
            return;
        }

       // const isSameDay = selectedDate.isSame(currentDate, 'day');
        

        if (isSameDay && isPastEvent && currentView == "month") {
            setCurrentTaskType('monthpast');
            setShowModal(true);
            return;
        }
       
        setValidationError('');

       
        
            if (overlap(event))
            {

                setCurrentTaskType('overlap');
                setShowModal(true);
                return;
            }
           

            else
            {


                setStart(event.start);
                setEnd(event.end);
                setShowCreateModal(true);


                if (titleInput.trim() !== '')
                {



                    const newEvent = {
                        title: titleInput,
                        start: event.start,
                        end: event.end,
                        Moderator: selectedModerators,
                        UserId: id,
                        Connections: (priv ? selectedConnections : connections),
                        priv: priv,
                        _id: "",
                        TimeZone: (selectedTimezone == "") ? defaultTimeZone : selectedTimezone,
                        Reminder: false,
                    };
                    setEvents([...events, newEvent]);

                }
              


            }
        

    };
    ///This function is for the displaying of the title, start and end times when scrolled over an event.
    const CustomEventContent = ({ event }: any) => (
        <div>
            <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{event.title}</div>
            <div style={{ fontSize: '13px' }}>{moment(event.start).format('LT')} - {moment(event.end).format('LT')}</div>
        </div>
    );
    const tooltipAccessor = (event: any) => {
        return `Title: ${event.title}\nStart: ${event.start.toLocaleString()}\nEnd: ${event.end.toLocaleString()}`;

    };
    // Override the time format to empty string which is shown in calendar
    const eventFormats = {
        eventTimeRangeFormat: () => '', 
    };
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
            
            setShowEmailModal(true);
        }
    }
        ///<summary>
        ///When the user wants to edit the function this will be called, it enables the edit modal pop up and makes edit variable true.
        ///</summary>
 function handleEditEvent(event: React.MouseEvent<HTMLButtonElement>) {
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
      
       setDeleteEventId(event._id);
       setDeleteEventUserId(event.UserId);
       showEmails(event);

        setShowDeleteModal(true);
    };
    const handleClose = () => {
        setShowCreateModal(false);
        setShowEditModal(false);
        onClose();
      
    }
   
   ///<summary>
    ///This is the checkbox for the connections in the event details
    ///To avoid adding the same user twice as connection and moderator this function is used.
    ///It checks the selectedModerators array, all the users present in the array are disabled to select in the connections pop up
    ///</summary>
    const renderEmailCheckbox = (connection: string) => {
        const isDisabled = selectedModerators.includes(connection) || (connection == deleteUserEmail && creator);

        return (
            <Form.Check
                key={connection}
                type="checkbox"
                id={connection}
                label={connection}
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
    const views = {
        month: true,
        week: true,
        day: true,
        agenda: true,
       // allEvents: { component: AllEventsView },
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




    return (
        <div >
            <StyledDiv>
            <label><strong> Select Timezone </strong></label>
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
           
            <div >
                <br />
                <strong>
                    <StyledDiv>
                    Click an event to edit/delete,In the week/day view
                    drag the mouse over the calendar
                        to select a date/time range.<br/>
                        In the month view the event will be created for the entire day.
                    </StyledDiv>
                </strong>
            </div>
            
            <br />
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
                components={{
                    event: CustomEventContent,
                  
                  
                }}
                onView={handleViewChange} 
                popup={true}
                style={{ height: '80vh' }}
                step={15}
            />
          
            {currentTaskType && (
                <MyModal show={showModal} onClose={()=>setShowModal(false)} taskType={currentTaskType} />
            )}
            
            {deleteEvent && (
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }} >
                       
                            <Modal.Title>Details of the Event</Modal.Title>
                        
                </Modal.Header>

                    <Modal.Body >
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
                                    {deleteEvent.Moderator.map((moderator: any, index: any) => (
                                        <li key={index}>{moderator}</li>
                                    ))}
                                </ul>
                            </>
                        )}

                        {deleteEvent.Connections && deleteEvent.Connections.length > 0 && (
                            <div>
                                <p><strong>Connections:</strong></p>
                                <ul>
                                    {deleteEvent.Connections.map((connection: string, index: any) => (
                                        <li key={index}>{connection}</li>
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
                        <Button variant="danger" onClick={DeleteEvent}>
                            Delete
                        </Button>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
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
                handleTimezoneChange={handleTimezoneChange}
                show={showEditModal}
                userId={deleteUserEmail}
                creator={creator }
                setPrivate={setPrivate}
                selectedTimezone={selectedTimezone}
                defaultTimeZone={defaultTimeZone}
                timezones={timezones}
                onClose={handleClose}
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
                onClose={() => setShowEmailModal(false)}
                onSaveSelectedConnections={handleSaveSelectedConnections}
                validationError={validationError}
                connections={connections}
                renderEmailCheckbox={renderEmailCheckbox}
               
               
            />
           
        </div >
    );
}; export default CalendarApp;





