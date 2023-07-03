
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

    const handleCloseModal = () => {

        setShowModal(false);
    };
    useEffect(() => {

        getEvents();

        moment.tz.setDefault();
    }, [currentTaskType, showDeleteModal, showEditModal, selectedTimezone]);


    
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
                    priv: training.priv
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
            priv: priv
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
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setIsDelete(false);
        setIsPast(false)
      
    };
    const defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;


    return (
        <div>
            <div>
                <div>
                    <strong>
                        Welcome to your connections Calendar!
                    </strong>
                </div>
                <label>Select Timezone:</label>
                <select value={selectedTimezone} onChange={handleTimezoneChange}>
                    <option value="">{defaultTimeZone}</option>
                    {timezones.map((timezone) => (

                        <option key={timezone} value={timezone}>
                            {timezone}
                        </option>
                    ))}
                </select>
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
                <Modal show={showDeleteModal} onHide={closeDeleteModal}>
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
                                    {deleteEvent.Connections.map((connection: any, index: any) => (
                                        <li key={index}>{connection}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {deleteEvent.Moderator && deleteEvent.Moderator.length > 0 && (
                            <div>
                                <p>Moderators:</p>
                                <ul>
                                    {deleteEvent.Moderator.map((moderator: any, index: any) => (
                                        <li key={index}>{moderator}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {isDelete && isPast&&(<p>You cannot delete/edit this event</p>)}
                        <p>Do you want to delete/edit this event?</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="success" onClick={handleEditEvent} disabled={isPast} >
                            Edit
                        </Button>
                        <Button variant="danger" onClick={DeleteEvent} disabled={isDelete}>
                            Delete
                        </Button>
                        <Button variant="secondary" onClick={closeDeleteModal}>
                            Cancel
                        </Button>
                    </Modal.Footer>

                </Modal>)}

            {currentTaskType && (
                <MyModal show={showModal} onClose={handleCloseModal} taskType={currentTaskType} />
            )}
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
        </div>
    );
};

export default CalendarPage;
