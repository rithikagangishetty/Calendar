
import { FC, useState, useEffect } from 'react'
import { Calendar, Event, momentLocalizer } from 'react-big-calendar'
import moment from 'moment';
import { useParams } from 'react-router-dom';
import React from 'react';
import 'moment-timezone'; `1`
import 'react-big-calendar/lib/css/react-big-calendar.css'
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import MyModal, { DeleteModal, EditEventModal, SelectEmailModal } from './Modal';
import styled from 'styled-components';



interface RouteParams {
    id: string;
    connectionId:string,
}

const StyledDiv = styled.div`
  text-align: center;`;
type TaskType = 'eventadded' | 'eventdeleted' | 'overlap' | 'past' | 'eventedited' | 'editpast' | 'eventclash'|'noedit'; // Define the possible task types
const CalendarPage: React.FC = () => {
    const localizer = momentLocalizer(moment);
    const { id, connectionId } = useParams<RouteParams>();
    const [Edit, setEdit] = useState<boolean>(false);
    const [events, setEvents] = useState<Event[]>([]);
    const [connections, setConnections] = useState<Array<string>>([]);
    const [showModal, setShowModal] = useState(false);
    const [currentTaskType, setCurrentTaskType] = useState<TaskType | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteEventId, setDeleteEventId] = useState<string>('');
    const [UserId, setUserId] = useState<string>('');
    const [deleteEvent, setDeleteEvent] = useState<Event>();
    const [titleInput, setTitleInput] = useState<string>('');
    const [startdate, setStart] = useState<Date>(new Date());
    const [enddate, setEnd] = useState<Date>(new Date());
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [priv, setPrivate] = useState<boolean>();
    const [selectedModerators, setSelectedModerators] = useState<string[]>([]);
    const [selectedConnections, setSelectedConnections] = useState<string[]>([]);
    const timezones = moment.tz.names();
    const [selectedTimezone, setSelectedTimezone] = React.useState<string>('');
    const [validationError, setValidationError] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const currentDate = moment();
    const [isPast, setIsPast] = useState<boolean>(false);
    const [isDelete, setIsDelete] = useState<boolean>(false);
    const [EmailId, setEmailId] = useState<string>("");
    const handleCloseModal = () => {

        setShowModal(false);
    };
    useEffect(() => {

        getEvents();
        GetEmail();
        GetConnections()
        moment.tz.setDefault();
    }, [currentTaskType, showDeleteModal, showEditModal, selectedTimezone]);


    function GetEmail() {
        axios.get('https://localhost:44373/Connection/get/', { params: { _id: connectionId } }).then((response) => {


            console.log(response.data);
            setEmailId(response.data.emailId);
        });

    }
    
    const getEvents = () => {



        axios.get('https://localhost:44373/User/getconnectionevents', { params: { _id: id, connectionId: connectionId } }).then((response) => {
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
                    Reminder:training.reminder,
                }
            })
            setEvents(event);
        }).catch((err) => {
            alert(err)
        });



    }

    /// <summary>
    /// GetConnections will get all the connections of the user based on the User id.
    ///this function will be called everytime when the variables in the useEffect block changes
    /// </summary>
    function GetConnections() {
        axios.get('https://localhost:44373/Connection/getemail', { params: { _id: connectionId } }).then((response) => {

            setConnections(response.data.connection);
        }).catch((error) => {
            alert(error)
        });

    }
    moment.tz.setDefault(selectedTimezone);

    // Handle timezone selection change
    const handleTimezoneChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTimezone(event.target.value);
    };
        /// <summary>
        /// DeleteEvent will delete the event based on the userId and event Id
        ///after axios delete api call the response is the details of the events
        ///Which are then used to send email after the deletion.
        ///this function will be called everytime when the variables in the useEffect block changes
        /// </summary>
 async  function DeleteEvent(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        var eventName;
        var Moderator;
        var Connection;
        var _start;
        var _end;
        axios.delete('https://localhost:44373/User/', { params: { _id: deleteEventId, userId: connectionId } }).then((response) => {
            eventName = response.data.eventName;
            Moderator = response.data.moderator;
            Connection = response.data.connections;
            _start = response.data.startDate;
            _end = response.data.endDate;
            setCurrentTaskType('eventdeleted');
            setShowModal(true);

            setShowDeleteModal(false);
        }).catch((error) => { alert(error); });
        axios.post("https://localhost:44373/User/sendmail",
            {
                _id: deleteEventId,
                UserEmail: UserId,
                EventName: eventName,
                Moderator: Moderator,
                Connections: Connection,
                StartDate: _start,
                Delete: true,
                EndDate: _end,
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
    function showEmails(event: any) {

        axios
            .get('https://localhost:44373/User/getevent', { params: { _id: event._id } })
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
                    TimeZone: (selectedTimezone == "") ? defaultTimeZone : selectedTimezone,
                    Reminder: response.data.reminder,
                };
                setDeleteEvent(newEvent);

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
    function EditEvent() {
        
        for (var _event of events) {
            
            if (_event.start !== undefined && _event.end !== undefined) {
                if (_event._id != deleteEventId) {
                    if (
                        (startdate >= _event.start && startdate < _event.end) ||
                        (enddate > _event.start && enddate <= _event.end) ||
                        (startdate <= _event.start && enddate >= _event.end)
                    ) {
                        setCurrentTaskType('eventclash');
                        setShowModal(true);
                        return; // Clash found

                    }
                }
            }
        }

        axios.put('https://localhost:44373/User/', {
            _id: deleteEventId,
            UserId: UserId,
            EventName: titleInput,
            StartDate: startdate,
            Moderator: selectedModerators,
            EndDate: enddate,
            Connections: (priv ? selectedConnections : connections),
            priv: priv,
            TimeZone: (selectedTimezone == "") ? defaultTimeZone : selectedTimezone,
            Reminder:false,
        }).then(() => {


            setCurrentTaskType('eventedited');
            setShowModal(true);
            setShowEditModal(false);
            setShowDeleteModal(false);
            setEdit(false);
        }).catch((error) => { alert(error); });
        axios.post("https://localhost:44373/User/sendmail",
            {
                _id: deleteEventId,
                UserEmail: UserId,
                EventName: titleInput,
                Moderator: selectedModerators,
                Connections: (priv ? selectedConnections : connections),
                StartDate: startdate,
                EndDate: enddate,
                Delete: false,
                Subject: "Event is Edited",
                Body: `An event titled '${titleInput}' has been created.The start time of the event is '${startdate}' and ends at '${enddate}'.`,
            }).then(() => {
                //   alert("email sent");
            }).catch((error) => {
                alert("error in mail " + error)
            });
    };
   
   
    ///<summary>
    ///handlePost when the user creates a public post this function is called
    ///All the basic checks like empty title is taken care of,
    ///With the help of Edit boolean variable the function seperates it from an edit/post request.
    ///If it is a edit, EditEvent() is called.

    ///</summary>

    function handlePost(event: React.MouseEvent<HTMLButtonElement>): void {
        event.preventDefault();

        if (titleInput.trim() == '') {
            setValidationError('Please enter a valid title.');
            return;
        }

        else {
            setValidationError('');
            setPrivate(false);
            if (Edit) {

                EditEvent();

            }
            
        }
    }
    ///<summary>
    ///The functioning is same as handlePost but this is called when the user creates a private post
    ///In the private post the user is allowed to choose the connections, so new modal will pop up where all the connections will be displayed
    ///That is done by the modal setShowEmailModal
    ///</summary>
    function handlePrivatePost(event: React.MouseEvent<HTMLButtonElement>): void {
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
        ///When the user clicks on any event this function is called.It first checks the user whether they are moderator
        ///or connection of the event if yes, they can delete/edit the event
        ///else they cant modify the event
        ///All the basic checks are done if the event is past ispast is set to true which disables the edit option.
        ///And the delete modal becomes true
        ///</summary>
    function handleDelete(event: any) {

        

        const eventStart = moment(event.start);
        const isPastEvent = eventStart.isBefore(currentDate);
        setIsPast(isPastEvent);
    
            if (!event.Moderator.includes(connectionId)||event.UserId!=id)
            {
                
                setIsDelete(true);
                setIsPast(true);
            

               
        }
        
        setDeleteEventId(event._id);
        setUserId(event.UserId);
        showEmails(event);
        setShowDeleteModal(true);
                
            
        
    };

     ///<summary>
    ///This is the checkbox for the connections in the event details
    ///To avoid adding the same user twice as connection and moderator this function is used.
    ///It checks the selectedModerators array, all the users present in the array are disabled to select in the connections pop up
    ///</summary>
   
    const renderEmailCheckbox = (connection: string) => {
        const isDisabled = selectedModerators.includes(connection);

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
    ///<summary>
    ///This is for the private post to make sure the user selects alteast one other 
    ///user as connection / moderator.
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
            if (Edit) {
                EditEvent();
            }
            
        }
    };
       //Gets the defaultTimeZone of the client
    const defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const handleDeleteModal = () => {
        setShowDeleteModal(false);
        setIsDelete(false);
    }

    return (
        <div>
            <div>
                <div>
                    <StyledDiv>
                    <h4><strong>
                        Welcome to {EmailId} Calendar!
                        </strong></h4>
                    </StyledDiv>
                </div>
                <StyledDiv>
                <br/>
                    <label><strong> Select Timezone </strong></label>
                    <br />
                    <select value={selectedTimezone} onChange={handleTimezoneChange}>
                        <option value=""> {defaultTimeZone}</option>
                        {timezones.map((timezone) => (

                            <option key={timezone} value={timezone}>
                                {timezone}
                            </option>
                        ))}
                </select> </StyledDiv>
               
                <div >
                    <br />
                    <strong>
                        <StyledDiv>
                            Click an event to edit/delete.
                        </StyledDiv>
                    </strong>
                </div>
                <br />
                <Calendar
                
                    defaultView='week'
                    events={events}
                    localizer={localizer}
                    startAccessor="start"
                    endAccessor="end"
                    tooltipAccessor={tooltipAccessor}
                    formats={eventFormats}
                    titleAccessor="title"

                    onSelectEvent={handleDelete}
                    components={{
                        event: CustomEventContent,
                    }}
                    style={{ height: '80vh' }}
                    step={15}

                />


            </div>
            {deleteEvent && (
                <Modal show={showDeleteModal} onHide={ handleDeleteModal}>
                    <Modal.Header style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }} >

                        <Modal.Title>Details of the Event</Modal.Title>

                    </Modal.Header>

                    <Modal.Body >
                        <p><strong>Title:</strong> {deleteEvent.title}</p>

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
                        <p><strong>Event Type:</strong> {deleteEvent.priv ? 'Private' : 'Public'}</p>

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
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }} >
                            {(!isDelete || !isPast) && <p><strong>{isPast ? "Do you want to delete this event?" : "Do you want to delete/edit this event"}</strong></p>}
                        </div>
                    </Modal.Body>


                    <Modal.Footer >
                       
                            <Button variant="success" onClick={handleEditEvent} disabled={isPast} >
                                Edit
                            </Button>
                      
                        <Button variant="danger" onClick={DeleteEvent} disabled={isDelete}>
                            Delete
                        </Button>
                        
                        <Button variant="secondary" onClick={handleDeleteModal}>
                            Cancel
                        </Button>

                    </Modal.Footer>

                </Modal>)}

            {currentTaskType && (
                <MyModal show={showModal} onClose={handleCloseModal} taskType={currentTaskType} />
            )}
            <EditEventModal
                handleTimezoneChange={handleTimezoneChange}
                selectedTimezone={selectedTimezone}
                defaultTimeZone={defaultTimeZone}
                timezones={timezones}
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                onPost={handlePost}
                onPrivatePost={handlePrivatePost}
                validationError={validationError}
                titleInput={titleInput}
                onTitleInputChange={setTitleInput}
                setEnd={setEnd}
                setStart={setStart}
                start={startdate}
                end={enddate}
                connections={connections}
                selectedModerators={selectedModerators}
                handleUserSelection={handleUserSelection}
            

            />
            
            <SelectEmailModal
                show={showEmailModal}
                onClose={() => setShowEmailModal(false)}
                onSaveSelectedConnections={handleSaveSelectedConnections}
                validationError={validationError}
                connections={connections}
                renderEmailCheckbox={renderEmailCheckbox}

            />
        </div>
    );
};

export default CalendarPage;
