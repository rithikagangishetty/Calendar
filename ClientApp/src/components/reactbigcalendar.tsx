﻿import { FC, useState, useEffect } from 'react'
import { Calendar, Event, momentLocalizer } from 'react-big-calendar'
import moment from 'moment';
import React from 'react';
import 'moment-timezone'; `1`
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import MyModal from './Modal';


type TaskType = 'eventadded' | 'eventdeleted' | 'overlap' | 'past' | 'eventedited'; // Define the possible task types
interface RouteParams {
    id: string;
}

const ReactApp: FC = () => {
    const localizer = momentLocalizer(moment);
    const [Edit, setEdit] = useState<boolean>(false);
    const [events, setEvents] = useState<Event[]>([]);
    const [connections, setConnections] = useState<Array<string>>([]);
    const { id } = useParams<RouteParams>();
    const [showModal, setShowModal] = useState(false);
    const [currentTaskType, setCurrentTaskType] = useState<TaskType | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteEventId, setDeleteEventId] = useState<string>('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [titleInput, setTitleInput] = useState<string>('');
    const [startdate, setStart] = useState<Date>();
    const [enddate, setEnd] = useState<Date>();
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [priv, setPrivate] = useState<boolean>();
    const [selectedModerators, setSelectedModerators] = useState<string[]>([]);
    const [selectedConnections, setSelectedConnections] = useState<string[]>([]);
    const timezones = moment.tz.names();
    const [selectedTimezone, setSelectedTimezone] = React.useState<string>('');

    const handleCloseModal = () => {

        setShowModal(false);
    };
    useEffect(() => {

        getEvents();
        GetConnections();


    }, [deleteEventId, showDeleteModal, showCreateModal, selectedTimezone]);




    moment.tz.setDefault(selectedTimezone);

    // Handle timezone selection change
    const handleTimezoneChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTimezone(event.target.value);
    };


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
                    priv: training.priv
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
                    priv: priv
                }).then((response) => {


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
            console.log(response.data);
            setConnections(response.data.connection);
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
    function EditEvent() {


        axios.put('https://localhost:44373/User/', {
            _id: deleteEventId,
            UserId: id,
            EventName: titleInput,
            StartDate: startdate,
            Moderator: selectedModerators,
            EndDate: enddate,
            Connections: (priv ? selectedConnections : connections),
            priv: priv
        }).then((response) => {
           
            
            setCurrentTaskType('eventedited');
            setShowModal(true);
            setShowCreateModal(false);
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
        const currentDate = moment();
        console.log(currentDate);
       


        if (overlap(event)) {

            setCurrentTaskType('overlap');
            setShowModal(true);
            return;
        }
        if (selectedDate.isBefore(currentDate)) {

            setCurrentTaskType('past');
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
                    Connections: connections,
                    priv: priv,
                    _id: "",
                };
                setEvents([...events, newEvent]);

            }


        }

    };
    const CustomEventContent = ({ event }: any) => (
        <div>
            <div>{event.title}</div>
            <div>{moment(event.start).format('LT')} - {moment(event.end).format('LT')}</div>
        </div>
    );
    const eventFormats = {
        eventTimeRangeFormat: () => '', // Override the time format to empty string
    };
    function handlePost(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        setPrivate(false);
        if (Edit) {
            EditEvent();
        }
        else {
            Post();
        }
    }
    function handlePrivatePost(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        setPrivate(true);
        setShowEmailModal(true);

    }
    function handleEditEvent(event: React.MouseEvent<HTMLButtonElement>) {
        setEdit(true);
        setShowCreateModal(true);
       

    }
    function handleDelete(event: any) {
        setDeleteEventId(event._id);
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

        setSelectedConnections([]);
        setShowEmailModal(false);
        if (Edit) {
            EditEvent();
        }
        else {
            Post();
        }
    };
    return (
        <div>
            <label>Select Timezone:</label>
            <select value={selectedTimezone} onChange={handleTimezoneChange}>
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
                components={{
                    event: CustomEventContent,
                }}
                style={{ height: '80vh' }}
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
                    Are you sure you want to delete/edit this event?
                </Modal.Body>
                <Modal.Footer>
                   
                    <Button variant="success" onClick={handleEditEvent}>
                        Edit
                    </Button>
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
                            onChange={(e) => setTitleInput(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="eventEmails">
                        <Form.Label>Select the Moderators</Form.Label>
                        <div>
                            {connections.length > 0 && connections.map((moderator) => (
                                <Form.Check
                                    key={moderator}
                                    type="checkbox"
                                    label={moderator}
                                    checked={selectedModerators.includes(moderator)}
                                    onChange={() => handleModeratorSelection(moderator)}
                                />
                            ))}
                        </div>
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



            <Modal show={showEmailModal} onHide={() => setShowEmailModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Email IDs</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {connections.length > 0 && connections.map((connection) => renderEmailCheckbox(connection))}
                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEmailModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveSelectedConnections}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>

        </div >
    );
}; export default ReactApp