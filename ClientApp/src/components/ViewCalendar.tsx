
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


    moment.tz.setDefault(selectedTimezone);

    // Handle timezone selection change
    const handleTimezoneChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTimezone(event.target.value);
    };


    
    function showEmails(event: any) {

        axios
            .get('https://localhost:44373/User/getevent', { params: { _id: event._id } })
            .then((response) => {
                const newEvent = {
                    title: response.data.eventName,
                    start: response.data.startDate.toLocaleString(),
                    end: response.data.endDate.toLocaleString(),
                    Moderator: response.data.moderator,
                    UserId: response.data.userId,
                    Connections: response.data.connections,
                    priv: response.data.priv,
                    _id: response.data._id,
                    TimeZone: response.data.timeZone,
                    Reminder:response.data.reminder,
                };
                setDeleteEvent(newEvent);

            })
            .catch((error) => {
                alert(error);


            });

    }

   
   

    function DeleteEvent(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        axios.delete('https://localhost:44373/User/', { params: { _id: deleteEventId, userId: connectionId } }).then((response) => {
            setCurrentTaskType('eventdeleted');
            setShowModal(true);

            setShowDeleteModal(false);
        }).catch((error) => { alert(error); });

    };
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
            UserId: id,
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

    function handleEditEvent(event: React.MouseEvent<HTMLButtonElement>) {


        setEdit(true);
        setShowEditModal(true);


    }
    const tooltipAccessor = (event: any) => {
        return `Title: ${event.title}\nStart: ${event.start.toLocaleString()}\nEnd: ${event.end.toLocaleString()}`;

    };
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
    const StyledDiv = styled.div`
  text-align: center;
`;
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
            
        }
    };
   
    const defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;


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
                            {(!isDelete || !isPast) && <p><strong>{isPast ? "Do you want to delete this event?" : "Do you want to delete/edit this event"}</strong></p>}
                        </div>
                    </Modal.Body>


                    <Modal.Footer >
                        {!isDelete && !isPast && 
                            <Button variant="success" onClick={handleEditEvent} disabled={isPast} >
                                Edit
                            </Button>
                        }
                        {!isDelete&& 
                        <Button variant="danger" onClick={DeleteEvent} disabled={isDelete}>
                            Delete
                        </Button>
                        }
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
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
                timeZone={"america"}
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
        </div>
    );
};

export default CalendarPage;
