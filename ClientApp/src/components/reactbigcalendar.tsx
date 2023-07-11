import { FC, useState, useEffect } from 'react'
import { Calendar, Event, momentLocalizer } from 'react-big-calendar'
import moment from 'moment';
import React from 'react';
import 'moment-timezone'; `1`
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import './NavMenu.css';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components';
import MyModal, { EditEventModal, CreateEventModal, SelectEmailModal, DeleteModal } from './Modal';



type TaskType = 'eventadded' | 'eventdeleted' | 'overlap' | 'past' | 'eventedited' |'editpast'|'eventclash'; // Define the possible task types
interface RouteParams {
    id: string;
}

const ReactApp: FC = () => {
    const localizer = momentLocalizer(moment);
    const [Edit, setEdit] = useState<boolean>(false);
    const [isPast, setIsPast] = useState<boolean>(false);
    const [events, setEvents] = useState<Event[]>([]);
    const [connections, setConnections] = useState<Array<string>>([]);
    const { id } = useParams<RouteParams>();
    const [showModal, setShowModal] = useState(false);
    const [currentTaskType, setCurrentTaskType] = useState<TaskType | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteEventId, setDeleteEventId] = useState<string>('');
    const [deleteEvent, setDeleteEvent] = useState<Event>();
    const [showCreateModal, setShowCreateModal] = useState(false);
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
   
    const handleCloseModal = () => {

        setShowModal(false);
        
    };
    useEffect(() => {

        getEvents();
        GetConnections();

        moment.tz.setDefault();
    }, [selectedTimezone, showModal]);




    moment.tz.setDefault(selectedTimezone);

    // Handle timezone selection change
    const handleTimezoneChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTimezone(event.target.value);
    };

   

    const defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const getEvents = () => {
        axios.get('https://localhost:44373/User/getallevents', { params: { _id: id } }).then((response) => {
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

    async function Post() {


        var _connections;
        var eventId;
        await axios.get('https://localhost:44373/Connection/get', { params: { _id: id } }).then((response) => {

            _connections = response.data.connection;

        }).catch((error) => { alert("error in get " + error) });
         await axios.post("https://localhost:44373/User/post",
            {
                _id: '',
                UserId: id,
                EventName: titleInput,
                StartDate: startdate,
                Moderator: selectedModerators,
                EndDate: enddate,
                Connections: (priv ? selectedConnections : _connections),
                priv: priv,
                TimeZone: (selectedTimezone == "") ? defaultTimeZone : selectedTimezone,
                Reminder: false,
           }).then((response) => {
               eventId = response.data;
                setShowCreateModal(false);
                setCurrentTaskType('eventadded');
                setShowModal(true);




            }).catch((error) => {
                alert("error in post " + error)
            });

        axios.post("https://localhost:44373/User/sendmail",
            {
                _id: eventId,
                UserEmail: id,
                EventName: titleInput,
                Moderator: selectedModerators,
                Connections: (priv ? selectedConnections : _connections),
                StartDate: startdate,
                EndDate: enddate,
                Delete: false,
                Subject: "Event is Created",
                Body: `An event titled '${titleInput}' has been created.
                The start time of the event is '${startdate}' and ends at '${enddate}'.`,
            }).then(() => {
               // alert("email sent");
            }).catch((error) => {
                alert("error in mail " + error)
            });

    };

    function GetConnections() {
        axios.get('https://localhost:44373/Connection/getemail', { params: { _id: id } }).then((response) => {
            
            setConnections(response.data.connection);
        }).catch((error) => {
            alert(error)
        });

    }
   
    function showEmails(event: any) {
       
        axios
            .get('https://localhost:44373/User/getevent', { params: { _id: event._id } })
            .then((response) => {
                const newEvent = {
                    title: response.data.eventName,
                    start: response.data.startDate,
                    end: response.data.endDate ,
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
   
    async function DeleteEvent(event: React.MouseEvent<HTMLButtonElement>) {
       event.preventDefault();
       
      
      var eventName;
      var Moderator;
      var Connection;
      var _start;
      var _end;
     await axios.delete('https://localhost:44373/User/', { params: { _id: deleteEventId, userId: id } }).then((response) => {

        
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
                UserEmail: id,
                EventName: eventName,
                Moderator: Moderator,
                Connections: Connection,
                StartDate: _start,
                Delete:true,
                EndDate: _end,
                Subject: "Event is Deleted",
                Body: `An event titled '${eventName}' has been deleted.`,
            }).then(() => {
              //  alert("email sent");
            }).catch((error) => {
                alert("error in mail " + error)
            });

    };
    async function EditEvent() {
        
                
        for (var _event of events) {
            // Check if the event overlaps with any existing event
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
      await  axios.put('https://localhost:44373/User/', {
            _id: deleteEventId,
            UserId: id,
            EventName: titleInput,
            StartDate: startdate,
            Moderator: selectedModerators,
            EndDate: enddate,
            Connections: (priv ? selectedConnections : connections),
            priv: priv,
            TimeZone: (selectedTimezone == "") ? defaultTimeZone : selectedTimezone,
            Reminder: false,
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
                UserEmail: id,
                EventName: titleInput,
                Moderator: selectedModerators,
                Connections: (priv ? selectedConnections : connections),
                StartDate: startdate,
                EndDate: enddate,
                Delete:false,
                Subject: "Event is Edited",
                Body: `An event titled '${titleInput}' has been created.The start time of the event is '${startdate}' and ends at '${enddate}'.`,
            }).then(() => {
             //   alert("email sent");
            }).catch((error) => {
                alert("error in mail " + error)
            });

    };
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
    const handleSelectSlot = (event: any) => {
        const selectedDate = moment(event.start);
       

        const isPastEvent = selectedDate.isBefore(currentDate);

        if (isPastEvent) {
            setCurrentTaskType('past');
            setShowModal(true);
            // Event is in the past, disable edit and delete options
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
    const CustomEventContent = ({ event }: any) => (
        <div>
            <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{event.title}</div>
            <div style={{ fontSize: '13px' }}>{moment(event.start).format('LT')} - {moment(event.end).format('LT')}</div>
        </div>
    );
    const eventFormats = {
        eventTimeRangeFormat: () => '', // Override the time format to empty string
    };
    function handlePost(event: React.MouseEvent<HTMLButtonElement>):void {
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
            else {
                Post();
            }
        }
    }
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
   
 function handleEditEvent(event: React.MouseEvent<HTMLButtonElement>) {
        setEdit(true);
        setShowEditModal(true);
       }
   
   async function handleDelete(event: any) {
      
       const eventStart = moment(event.start);
        const isPastEvent = eventStart.isBefore(currentDate);
        setIsPast(isPastEvent);
       setDeleteEventId(event._id);
       showEmails(event);
        setShowDeleteModal(true);
    };

    const handleConnectionSelection = (connection: string) => {

        const selected = [...selectedConnections];

        if (selected.includes(connection)) {
            const index = selected.indexOf(connection);
            selected.splice(index, 1);
        } else {
            selected.push(connection);
        }

        setSelectedConnections(selected);

    };
    const tooltipAccessor = (event: any) => {
        return `Title: ${event.title}\nStart: ${event.start.toLocaleString()}\nEnd: ${event.end.toLocaleString()}`;

    };

    const renderEmailCheckbox = (connection: string) => {
        const isDisabled = selectedModerators.includes(connection);

        return (
            <Form.Check
                key={connection}
                type="checkbox"
                id={connection}
                label={connection}
                checked={selectedConnections.includes(connection)}
                onChange={() => handleConnectionSelection(connection)}
                disabled={isDisabled}
            />
        );
    };
   
    const handleModeratorSelection = (moderator: string) => {
        if (selectedModerators.includes(moderator)) {
            setSelectedModerators(selectedModerators.filter((selectedModerator) => selectedModerator !== moderator));
        } else {
            setSelectedModerators([...selectedModerators, moderator]);
        }
    };

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
            else {
                Post();
            }
        }
    };
    const StyledDiv = styled.div`
  text-align: center;
`;
    return (
        <div >
            <StyledDiv>
            <label><strong> Select Timezone </strong></label>
            <br/>
            <select value={selectedTimezone} onChange={handleTimezoneChange}>
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
                    Click an event to edit/delete,
                    Drag the mouse over the calendar
                        to select a date/time range.
                    </StyledDiv>
                </strong>
            </div>
            <br />
            <Calendar
                selectable
                defaultView='week'
                events={events}
                localizer={localizer}
                startAccessor="start"
                endAccessor="end"
                formats={eventFormats}
                titleAccessor="title"
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleDelete}
                tooltipAccessor={tooltipAccessor}
                components={{
                    event: CustomEventContent,
                }}
                style={{ height: '80vh' }}
                step={15}
             
                
               

            />
            {currentTaskType && (
                <MyModal show={showModal} onClose={handleCloseModal} taskType={currentTaskType} />
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
                            <p><strong>{isPast ? "Do you want to delete this event?" : "Do you want to delete/edit this event"}</strong></p>
                        </div>
                    </Modal.Body>


                    <Modal.Footer >
                        {!isPast &&
                            <Button variant="success" onClick={handleEditEvent} disabled={isPast} >
                                Edit
                            </Button>
                        }
                        <Button variant="danger" onClick={DeleteEvent}>
                        Delete
                    </Button>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                            </Button>
                   
                </Modal.Footer>

                </Modal>)}
           
            <CreateEventModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onPost={handlePost}
                onPrivatePost={handlePrivatePost}
                validationError={validationError}
                titleInput={titleInput}
                onTitleInputChange={setTitleInput}
                connections={connections}
                selectedModerators={selectedModerators}
                handleModeratorSelection={handleModeratorSelection}
            />
            <EditEventModal
                handleTimezoneChange={handleTimezoneChange }
                show={showEditModal}
                selectedTimezone={selectedTimezone}
                defaultTimeZone={defaultTimeZone}
                timezones={timezones}
                onClose={() => setShowEditModal(false)}
                onPost={handlePost}
                timeZone={"america"}
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
                handleModeratorSelection={handleModeratorSelection}
             
               
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
}; export default ReactApp





