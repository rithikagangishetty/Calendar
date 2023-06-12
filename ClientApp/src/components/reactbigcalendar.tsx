import { FC, useState, useEffect } from 'react'
import { Calendar,  Event, momentLocalizer, DateLocalizer } from 'react-big-calendar'
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import React from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
/*import EditEvent from './edit';*/
interface RouteParams {
    id: string;
}

const ReactApp: FC = () => {

    const [events, setEvents] = useState<Event[]>([]);
    const [connections, setConnections] = useState<Array<string>>([""]);
    const { id } = useParams<RouteParams>();

    useEffect(() => {
       
      //  getEvents();
    }, [DeleteEvent,Post]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    // Function to handle event update
    const handleEventUpdate = (updatedEvent: Event) => {
        setEvents(prevState =>
            prevState.map(event => (event._id === updatedEvent._id ? updatedEvent : event))
        );
        setSelectedEvent(null); // Close the edit form
    };

    // Function to handle canceling event edit
    const handleEventCancel = () => {
        setSelectedEvent(null); // Close the edit form
    };

    // Function to open the edit form
    const handleEventSelect = (event: Event) => {
        setSelectedEvent(event);
    };
   

    const getEvents = async () => {
        axios.get('https://localhost:44373/User/getevents', { params: { _id: id } }).then((response) => {
            const event = response.data.map((training:any) => {
                return {
                    _id: training._id,
                    title: training.eventName,
                    start: new Date(training.startDate),
                    end: new Date(training.endDate),
                   // allDay: false,
                    UserId: training.userId,
                    Connections: training.connections
                }
            })
            setEvents(event);
          //  console.log(event);
            

        }).catch((err) => {
            alert(err)
        });
        
    }
function Post(event: any) {

        axios.get('https://localhost:44373/Connection/get/', { params: { _id: event.UserId } }).then((response) => {
           
            axios.post("https://localhost:44373/User", {
                _id: event._id,
                UserId: event.UserId,
                EventName: event.title,
                StartDate: event.start,
                EndDate: event.end,
                Connections: response.data.connection,
            }).then(() => {
              
                alert("Event Created Succesfully");
            }).catch((error) => { alert("error in post " + error) });
        }).catch((error) => { alert("error in get " + error) });
    };
    function DeleteEvent(id: string) {
        axios.delete('https://localhost:44373/User/', { params: { _id: id } }).then((response) => { alert("event deleted") }).catch((error) => { alert(error); });
       
    };
    function EditEvent(event: any) {
        axios.put('https://localhost:44373/User/update',
            {
                _id: event._id,
                UserId: event.UserId,
                EventName: event.title,
                StartDate: event.start,
                EndDate: event.end,
                Connections: event.connection,

            }).then((response) => {
                console.log(response.data);
                alert("event edited")
            }).catch((error) => { alert(error); });

    };
    const handleSelectSlot = (event: any) => {
        const selectedDate = moment(event.start).startOf('day');
        const currentDate = moment().startOf('day');
        // Disable event creation for past days
        if (selectedDate.isBefore(currentDate)) {
            toast.error('Event creation is not allowed for past days');
            return;
        }
        else {
            const title = window.prompt('Enter event title:');
            if (title) {
                const newEvent = {
                   title: title,
                    start: event.start,
                    end: event.end,
                    UserId: id,
                    Connections: connections,
                    _id: "",
                };
                
                setEvents([...events, newEvent]);
                Post(newEvent);
              
              
            };
        };
    };
    const handleDelete =  (event:any) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this event?');
        if (confirmDelete) {
            DeleteEvent(event._id);
            console.log(event._id);
           
        }
        else {
            console.log("reached here");
        }
       
    };

    const handleEdit = (event: any) => {
        const confirmEdit = window.confirm('Are you sure you want to edit this event?');
        if (confirmEdit) {
            EditEvent(event._id);
            console.log(event._id);

        }
        else {
            console.log("reached here");
        }

    };
    const localizer: DateLocalizer = momentLocalizer(moment);
    const minDate = new Date();
    const getNow = () => {
        return new Date();
    };
    //  const DnDCalendar = withDragAndDrop(Calendar)
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
                titleAccessor="title"
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleDelete}
                style={{ height: '80vh' }}
                step={15}
                // min={minDate}
                // getNow={getNow}
               
            />
  
        </div >
    );
};export default ReactApp