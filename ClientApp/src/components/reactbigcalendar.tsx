import { FC, useState, useEffect } from 'react'
import { Calendar, Event, momentLocalizer } from 'react-big-calendar'
import moment from 'moment';
import React from 'react';
import 'moment-timezone'; `1`
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
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
        axios.get('https://localhost:44373/User/getevents', { params: { _id: id } }).then((response) => {
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
                    TimeZone: training.timeZone
                }
            })
           
            setEvents(event);
        }).catch((err) => {
            alert(err)
        });


    }

    function Post() {



        axios.get('https://localhost:44373/Connection/get', { params: { _id: id } }).then((response) => {

           
            axios.post("https://localhost:44373/User",
                {
                    _id: '',
                    UserId: id,
                    EventName: titleInput,
                    StartDate: startdate,
                    Moderator: selectedModerators,
                    EndDate: enddate,
                    Connections: (priv ? selectedConnections : response.data.connection),
                    priv: priv,
                    TimeZone: (selectedTimezone =="") ? defaultTimeZone : selectedTimezone
                }).then(() => {
                   
                    setShowCreateModal(false);
                    setCurrentTaskType('eventadded');
                    setShowModal(true);
                   
                   
                  

                }).catch((error) => {
                    alert("error in post " + error)
                });


        }).catch((error) => { alert("error in get " + error) });
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
                    end: response.data.endDate
                    ,
                    Moderator: response.data.moderator,
                    UserId: response.data.userId,
                    Connections: response.data.connections,
                    priv: response.data.priv,
                    _id: response.data._id,
                    TimeZone: (selectedTimezone == "") ? defaultTimeZone : selectedTimezone,
                };
                setDeleteEvent(newEvent);
                  
                })
                .catch((error) => {
                    alert(error);
                   
                  
                });
       
    }
   
    function DeleteEvent(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        axios.delete('https://localhost:44373/User/', { params: { _id: deleteEventId, userId: id } }).then((response) => {
            setCurrentTaskType('eventdeleted');
            setShowModal(true);
            
            setShowDeleteModal(false);
        }).catch((error) => { alert(error); });

    };
    function EditEvent() {
        
                
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
        }for (var _event of events) {
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
        axios.put('https://localhost:44373/User/', {
            _id: deleteEventId,
            UserId: id,
            EventName: titleInput,
            StartDate: startdate,
            Moderator: selectedModerators,
            EndDate: enddate,
            Connections: (priv ? selectedConnections : connections),
            priv: priv,
            TimeZone: (selectedTimezone == "") ? defaultTimeZone : selectedTimezone
        }).then(() => {
           
            
            setCurrentTaskType('eventedited');
            setShowModal(true);
            setShowEditModal(false);
            setShowDeleteModal(false);
            setEdit(false);
        }).catch((error) => { alert(error); });

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
            if (selectedDate.isBefore(currentDate))
            {

                setCurrentTaskType('past');
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
                        TimeZone: (selectedTimezone == "") ? defaultTimeZone : selectedTimezone
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
    return (
        <div>
            <label>Select Timezone:</label>
            <select value={selectedTimezone} onChange={handleTimezoneChange}>
                <option value=""> {defaultTimeZone}</option>
                {timezones.map((timezone) => (

                    <option key={timezone} value={timezone}>
                        {timezone}
                    </option>
                ))}
            </select>

            <div>
                <strong>
                    Click an event to edit/delete,
                    Drag the mouse over the calendar
                    to select a date/time range.
                </strong>
            </div>
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
                <Modal.Header closeButton>
                    <Modal.Title>Details of the Event</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                        <p>Title: {deleteEvent.title}</p>
                        {deleteEvent.start && (
                            <p>Start: {deleteEvent.start.toLocaleString()}</p>
                        )}
                        {deleteEvent.end && (
                            <p>End: {deleteEvent.end.toLocaleString()}</p>
                        )}

                        {deleteEvent.Connections && deleteEvent.Connections.length > 0 && (
                            <div>
                                <p>Connections:</p>
                                <ul>
                                    { deleteEvent.Connections.map((connection: string, index: any) => (
                                     
                                        <li key={index}>{connection}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {deleteEvent.Moderator && deleteEvent.Moderator.length > 0 && (
                            <div>
                                <p>Moderators:</p>
                                <ul>
                                    {deleteEvent.Moderator.map((moderator: any, index: any) => 
                                        
                                        <li key={index}>{moderator}</li>
                                    )}
                                </ul>
                            </div>
                        )}
                        
                       

                   
                    <p>Do you want to delete/edit this event?</p>
                </Modal.Body>

                <Modal.Footer>
                        <Button variant="success" onClick={handleEditEvent} disabled={isPast} >
                        Edit
                    </Button>
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





