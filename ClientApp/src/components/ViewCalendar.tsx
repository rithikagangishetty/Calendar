
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
import MyModal from './Modal';


type TaskType = 'eventadded' | 'eventdeleted' | 'overlap' | 'past' | 'eventedited'; // Define the possible task types
type ViewCalendarProps = {
    id: string;
    connectionId: string;
};
interface RouteParams {
    id: string;
    connectionId:string,
}

const ViewCalendar: React.FC<ViewCalendarProps> = ({ id, connectionId }) => {

    const localizer = momentLocalizer(moment);
    const [events, setEvents] = useState<Event[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteEventId, setDeleteEventId] = useState<string>('');
    const [Edit, setEdit] = useState<boolean>(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    useEffect(() => {

        getEvents();
        


    }, []);
    const eventFormats = {
        eventTimeRangeFormat: () => '', // Override the time format to empty string
    };
    const CustomEventContent = ({ event }: any) => (
        <div>
            <div>{event.title}</div>
            <div>{moment(event.start).format('LT')} - {moment(event.end).format('LT')}</div>
        </div>
    );
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
    function handleEditEvent(event: React.MouseEvent<HTMLButtonElement>) {
        setEdit(true);
        setShowCreateModal(true);


    }
    
    function handleDelete(event: any)
    {
       // if (event.Moderator.Contains(connectionId))
       // {
       //     alert("can edit/delete the event");
       // }
       //else
       // {
       //     alert("Cannot edit/delete the event");
       // }
    };
    return (
        <div>
            <div>
                <strong>
                   Welcome to your connections Calendar!
                </strong>
            </div>
        <Calendar
            
            defaultView='week'
            events={events}
            localizer={localizer}
            startAccessor="start"
            endAccessor="end"
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
    );
};
const CalendarPage: React.FC = () => {

    const { id, connectionId } = useParams<RouteParams>();


    return (
        <div>
           
            <ViewCalendar id={id} connectionId={connectionId} />

        </div>
    );
};

export default CalendarPage;
