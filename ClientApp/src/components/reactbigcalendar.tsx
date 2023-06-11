import { FC, useState, useEffect } from 'react'
import { Calendar, dateFnsLocalizer, Views, Event, momentLocalizer, DateLocalizer } from 'react-big-calendar'
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop'

import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getEvents,get, post } from './file';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import React from 'react'
import { useParams } from 'react-router-dom'
interface RouteParams {
    id: string;
}
type Events = {
    Id: string;
    UserId: string;
    EventName: string;
    Connections: Array<string>;
    StartDate: Date;
    EndDate: Date;

};
const ReactApp: FC = () => {
    
    const [events, setEvents] = useState<Event[]>([
       
    ])
    useEffect(() => {
        fetchEvents();
    }, []);
    const [connections, setConnections] = useState<Array<string>>([""]);
    const { id } = useParams<RouteParams>();
    const fetchEvents = async () => {
        const data = await getEvents(id);
        console.log(data);
        // Format events for react-big-calendar
        const formattedEvents = data.map((event: { start: string | number | Date; end: string | number | Date }) => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end)
        }));

        setEvents(formattedEvents);
    };

  
    const handleSelectSlot = (event:any) => {
        const selectedDate = moment(event.start).startOf('day');
        const currentDate = moment().startOf('day');
        
        // Disable event creation for past days
        if (selectedDate.isSameOrBefore(currentDate)) {
            toast.error('Event creation is not allowed for past days');
            return ;
        }
        else {
            const title = window.prompt('Enter event title:');
            if (title) {
                const newEvent = {
                    title,
                    start: event.start,
                    end: event.end,
                };
                const details: Events = {
                    Id: "",
                    UserId: id,
                    EventName: title,
                    Connections: connections,
                    StartDate: event.start,
                    EndDate: event.end,

                };

                setEvents([...events, newEvent]);
                console.log(id);
                getEvents(id);
                //console.log(users);
                post(details);
                fetchEvents();

            }
        }

        // Handle event creation for future days
        // ... Your logic for creating events ...
    };

    const handleSelect = (event: any) => {
        const title = window.prompt('Enter event title:');
        if (title) {
            const newEvent = {
                title,
                start: event.start,
                end: event.end,
            };
            const details: Events = {
                Id: "",
                UserId: id,
                EventName: title,
                Connections:connections,
                StartDate: event.start,
                EndDate: event.end,

            };

            setEvents([...events, newEvent]);
            console.log(id);
             getEvents(id);
            //console.log(users);
            post(details);
           fetchEvents();
            
        }
    };
   


      const localizer: DateLocalizer = momentLocalizer(moment);
    const isPastDate = (date: Date) => {
        const currentDate = new Date();
        return date < currentDate;
    };
   
    const minDate = new Date();



    const getNow = () => {
        return new Date();
    };


  //  const DnDCalendar = withDragAndDrop(Calendar)
    return (
        <div>
            <ToastContainer />
        <Calendar
            selectable
            defaultView='week'
            events={events}
            localizer={localizer}
           // min={minDate}
           // getNow={getNow}
            startAccessor="start"
            endAccessor="end"
            onSelectSlot={handleSelectSlot}
            style={{ height: '100vh' }}
            step={15 }
        />
        </div >
    );
}


export default ReactApp