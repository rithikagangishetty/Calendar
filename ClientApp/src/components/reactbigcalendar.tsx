﻿import { FC, useState, useEffect } from 'react'
import { Calendar,  Event, momentLocalizer, DateLocalizer } from 'react-big-calendar'
import moment from 'moment';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import React from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
type TaskType = 'eventadded' | 'eventdeleted' | 'overlap' |'past'; // Define the possible task types
import { Modal, Button, Form } from 'react-bootstrap';
import MyModal from './Modal';
//import { Event } from 'react-toastify/dist/core';
interface RouteParams {
    id: string;
}

const ReactApp: FC = () => {
    const localizer: DateLocalizer = momentLocalizer(moment);
    const [events, setEvents] = useState<Event[]>([]);
    const [connections, setConnections] = useState<Array<string>>([""]);
    const { id } = useParams<RouteParams>();
    const [showModal, setShowModal] = useState(false);
    const [currentTaskType, setCurrentTaskType] = useState<TaskType | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteEventId, setDeleteEventId] = useState<string>('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [titleInput, setTitleInput] = useState<string>('');
    const [startdate, setStart] = useState('')
    const [enddate, setEnd] = useState('');

    const handleCloseModal = () => {
       
        setShowModal(false);
    };
    useEffect(() => {
       
        getEvents();
      

    }, [handleDelete]);

    
   
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
                    Connections: training.connections
                }
            })
            setEvents(event);
        }).catch((err) => {
            alert(err)
        });
       
        
    }
   
    function Post(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        setShowCreateModal(false);
        axios.get('https://localhost:44373/Connection/get/', { params: { _id: id } }).then((response) => {
           
            axios.post("https://localhost:44373/User", {
                _id: '',
                UserId: id,
                EventName: titleInput,
                StartDate: startdate,
                EndDate: enddate,
                Connections: response.data.connection,
            }).then((response) => {
                axios.post('https://localhost:44373/User/email',
                    {
                        _id:'',
                        UserId: id,
                        EventName: titleInput,
                        StartDate: startdate,
                        EndDate: enddate,
                        Connections: response.data.connection,

                    })
                setCurrentTaskType('eventadded');
                setShowModal(true);
               
              
               /* alert("Event Created Succesfully");*/
            }).catch((error) => { alert("error in post " + error) });
        }).catch((error) => { alert("error in get " + error) });
    };
    function DeleteEvent(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        axios.delete('https://localhost:44373/User/', { params: { _id: deleteEventId } }).then((response) => {
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
        const currentDate = moment();
       
       
       
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
        
            console.log("reached here");
           
                const newEvent = {
                    title: titleInput,
                    start: event.start,
                    end: event.end,
                    UserId: id,
                    Connections: connections,
                    _id: "",
                };
                setEvents([...events, newEvent]);
             
                
              
            
        }
    };
    
    function handleDelete(event:any) {
        setDeleteEventId(event._id);
            setShowDeleteModal(true); };
   
   
   

    return (
        <div>
            <ToastContainer />
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
                defaultDate={new Date()}
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
                </Modal.Body>
                <Modal.Footer>
                   
                    <Button variant="success" onClick={Post}>
                        Create
                    </Button>
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

        </div >
    );
};export default ReactApp