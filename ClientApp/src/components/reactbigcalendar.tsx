import {  FC, useState, useEffect } from 'react'
import { Calendar,  Event, momentLocalizer, DateLocalizer } from 'react-big-calendar'
//import moment from 'moment';
import React from 'react';
import Select from 'react-select';
import moment from 'moment-timezone';
import  OptionTypeBase  from 'react-select';
//import { ToastContainer, toast } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import MyModal from './Modal';


type TaskType = 'eventadded' | 'eventdeleted' | 'overlap' | 'past'; // Define the possible task types
interface RouteParams {
    id: string;
}

const ReactApp: FC = () => {
    const localizer = momentLocalizer(moment);
    const [events, setEvents] = useState<Event[]>([]);
    const [connections, setConnections] = useState<Array<string>>([]);
    const { id } = useParams<RouteParams>();
    const [showModal, setShowModal] = useState(false);
    const [currentTaskType, setCurrentTaskType] = useState<TaskType | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteEventId, setDeleteEventId] = useState<string>('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [titleInput, setTitleInput] = useState<string>('');
    const [moderator, setModerator] = useState('');
    const [startdate, setStart] = useState('')
    const [enddate, setEnd] = useState('');
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [priv, setPrivate] = useState < boolean>(false);
    const [selectedConnections, setSelectedConnections] = useState<string[]>([]);
    const getCurrentDateTime = (timezone: string) => {
        return moment().tz(timezone).toDate();
    };
    const [selectedTimeZone, setSelectedTimeZone] = useState(moment.tz.guess());
    const [currentDateTime, setCurrentDateTime] = useState(getCurrentDateTime(selectedTimeZone));

    const handleTimeZoneChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTimeZone(event.target.value);
    };

    const handleCloseModal = () => {
       
        setShowModal(false);
    };
    useEffect(() => {
       
       getEvents();
       // setCurrentDateTime(getCurrentDateTime(selectedTimeZone));
      

    }, [handleDelete, Post ]);
    
    //const [selectedTimeZone, setSelectedTimeZone] = useState(moment.tz.guess());
    const getTimeZones = () => {
        const timeZones = moment.tz.names();
        return timeZones.map((tz) => ({
            value: tz,
            label: tz,
        }));
    };

    //const handleTimeZoneChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //    setSelectedTimeZone(event.target.value);
    //};
    function getEmailId(emailids:any)
    {

        axios.get('https://localhost:44373/Connection/getconnections', { params: { emails: emailids } }).then((response) => {
            console.log(response.data);
           // setModerator(response.data);
            return response.data;

        }).catch((error) => { alert(error); });
       
        
       
    }
   
    const getEvents =  () => {
        axios.get('https://localhost:44373/User/getevents', { params: { _id: id } }).then((response) => {
            const event = response.data.map((training:any) => {
                return {
                    _id: training._id,
                    title: training.eventName,
                    start: new Date(training.startDate),
                    end: new Date(training.endDate),
                    allDay: false,
                    UserId: training.userId,
                    Moderator:training.moderator,
                    Connections: training.connections
                }
            })
            setEvents(event);
        }).catch((err) => {
            alert(err)
        });
       
        
    }
    
    function Post() {
       
       
        const emailArray = moderator
            .split(',')
            .map((email) => email.trim())
            .filter((email) => email !== '');
    // var emails=   getEmailId(emailArray);
       
        axios.get('https://localhost:44373/Connection/get', { params: { _id: id } }).then((response) => {
            
            axios.post("https://localhost:44373/User", {
                _id: '',
                UserId: id,
                EventName: titleInput,
                StartDate: startdate,
                Moderator: emailArray,
                EndDate: enddate,
                Connections: (priv ? selectedConnections : response.data.connection)
            }).then((response) => {
               
                axios.post('https://localhost:44373/User/email',
                    {
                        _id:'',
                        UserId: id,
                        EventName: titleInput,
                        StartDate: startdate,
                        Moderator: emailArray,
                        EndDate: enddate,
                        Connections: (priv ? (selectedConnections) : response.data.connection)

                    })
                setShowCreateModal(false);


                setCurrentTaskType('eventadded');
                setShowModal(true);
            }).catch((error) => { alert("error in post " + error) });
        }).catch((error) => { alert("error in get " + error) });
    };

    function GetConnections() {
        axios.get('https://localhost:44373/Connection/getemail', { params: { _id: id } }).then((response) => {
            console.log(response.data);
            setConnections(response.data);
        }).catch((error) => {
            alert(error)
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
        const currentDate = currentDateTime;
        GetConnections();
       
       
        if (overlap(event)) {
           
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
        else {
            setStart(event.start);
            setEnd(event.end);
            setShowCreateModal(true);
        
          
            if (titleInput.trim() !== '')
            {
                const emailArray = moderator
                    .split(',')
                    .map((email) => email.trim())
                    .filter((email) => email !== '');
               
          
                const newEvent = {
                    title: titleInput,
                    start: event.start,
                    end: event.end,
                    Moderator: emailArray,
                    UserId: id,
                    Connections: connections,
                    _id: "",
                };
                setEvents([...events, newEvent]);

            }
              
            
        }
        
    };

    function handlePost(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        setPrivate(false);
        const emailArray = moderator
            .split(',')
            .map((email) => email.trim())
            .filter((email) => email !== '');


        Post();
    }
    function handlePrivatePost(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
       
        setPrivate(true);
        const emailArray = moderator
            .split(',')
            .map((email) => email.trim())
            .filter((email) => email !== '');
       
        setShowEmailModal(true);
   
    }
    function handleDelete(event:any) {
        setDeleteEventId(event._id);
            setShowDeleteModal(true); };
   
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
   
    const handleSaveSelectedConnections = () => {
        // Save the selected email IDs
        
        setSelectedConnections([]);
        setShowEmailModal(false);
       
       
        Post();
    };
    return (
        <div>
            {/*<select value={selectedTimeZone} onChange={handleTimeZoneChange}>*/}
            {/*    {getTimeZones().map((tz) => (*/}
            {/*        <option key={tz.value} value={tz.value}>*/}
            {/*            {tz.label}*/}
            {/*        </option>*/}
            {/*    ))}*/}
            {/*</select>*/}
            <select value={selectedTimeZone} onChange={handleTimeZoneChange}>
                {getTimeZones().map((tz) => (
                    <option key={tz.value} value={tz.value}>
                        {tz.label}
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
                defaultDate={currentDateTime}
                titleAccessor="title"
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleDelete}
              //  onDoubleClickEvent={handleEdit}
                style={{ height: '100vh' }}
                step={15}
               
            />
            {currentTaskType && (
                <MyModal show={showModal} onClose={handleCloseModal} taskType={currentTaskType} />
            )}

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this event?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={DeleteEvent}>
                        Delete
                    </Button>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    
                </Modal.Footer>
            </Modal>
           

            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="eventTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={titleInput}
                            onChange={(e) => setTitleInput(e.target.value) }
                        />
                    </Form.Group>
                    <Form.Group controlId="eventModerator">
                        <Form.Label>Moderators</Form.Label>
                        <small className="ml-2 text-muted">To add more than one moderators separate the emails by comma.</small>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={moderator}
                            onChange={(e) => setModerator(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                   
                    <Button variant="success" onClick={handlePost}>
                        Create Public Event
                    </Button>
                    <Button variant="success" onClick={handlePrivatePost}>
                        Create Private Event
                    </Button>
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>



            <Modal show={showEmailModal} onHide={()=>setShowEmailModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Email IDs</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {connections.map((connection) => (
                        <Form.Check
                            key={connection}
                            type="checkbox"
                            id={connection}
                            label={connection}
                            checked={selectedConnections.includes(connection)}
                            onChange={() => handleConnectionSelection(connection)}
                        />
                    ))}
                    {/*{connections.map((item, index) => (*/}
                    {/*    <p key={index}>{item}</p>*/}
                    {/*))}*/}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>setShowEmailModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveSelectedConnections}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>

        </div >
    );
};export default ReactApp