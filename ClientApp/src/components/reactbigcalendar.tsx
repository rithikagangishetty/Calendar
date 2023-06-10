import { FC, useState,useEffect } from 'react'
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar'
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import addHours from 'date-fns/addHours'
import startOfHour from 'date-fns/startOfHour'
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

        // Format events for react-big-calendar
        const formattedEvents = data.map((event: { start: string | number | Date; end: string | number | Date }) => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end)
        }));

        setEvents(formattedEvents);
    };

   

    const onEventResize: withDragAndDropProps['onEventResize'] = data => {
        const { start, end } = data

        setEvents(currentEvents => {
            const firstEvent = {
                start: new Date(start),
                end: new Date(end),
            }
            return [...currentEvents, firstEvent]
        })
    }

    const onEventDrop: withDragAndDropProps['onEventDrop'] = data => {
        console.log(data)
    }
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
            // getEvents(id);
            //console.log(users);
            post(details);
           //fetchEvents();
            
        }
    };
    const locales = {
        'en-US': enUS,
    } 
    // The types here are `object`. Strongly consider making them better as removing `locales` caused a fatal error
    const localizer = dateFnsLocalizer({
        format,
        parse,
        startOfWeek,
        getDay,
        locales,
    })
    //@ts-ignore
    const DnDCalendar = withDragAndDrop(Calendar)
    return (
        <Calendar
            selectable
            defaultView='week'
            events={events}
            localizer={localizer}
            //onEventDrop={onEventDrop}
            //onEventResize={onEventResize}
            //resizable={false}
            startAccessor="start"
            endAccessor="end"
            onSelectSlot={handleSelect}
            style={{ height: '100vh' }}
            step={15 }
        />
    )
}


export default ReactApp