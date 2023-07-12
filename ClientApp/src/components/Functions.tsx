import { useState } from 'react';
import MyModal, { EditEventModal, CreateEventModal, SelectEmailModal, DeleteModal } from './Modal';
import axios from 'axios';
type TaskType = 'login' | 'signup' | 'connectionadded' | 'eventclash' | 'valid' | 'eventedited' | 'noedit' | 'connectiondeleted' | 'eventadded' | 'eventdeleted' | 'overlap' | 'noconnections' | 'past' | 'connectionexist' | 'sameemail' | 'editpast';

export async function DeleteEvents(deleteEventId:string,id:string) {
    


    var eventName;
    var Moderator;
    var Connection;
    var _start;
    var _end;
    const [showModal, setShowModal] = useState(false);
    const [currentTaskType, setCurrentTaskType] = useState<TaskType | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    await axios.delete('https://localhost:44373/User/', { params: { _id: deleteEventId, userId: id } }).then((response) => {


        eventName = response.data.eventName;
        Moderator = response.data.moderator;
        Connection = response.data.connections;
        _start = response.data.startDate;
        _end = response.data.endDate;
        setCurrentTaskType('eventdeleted');
        setShowModal(true);

        setShowDeleteModal(false);
    }).catch((error) => { alert(error); });
    axios.post("https://localhost:44373/User/sendmail",
        {
            _id: deleteEventId,
            UserEmail: id,
            EventName: eventName,
            Moderator: Moderator,
            Connections: Connection,
            StartDate: _start,
            Delete: true,
            EndDate: _end,
            Subject: "Event is Deleted",
            Body: `An event titled '${eventName}' has been deleted.`,
        }).then(() => {
            //  alert("email sent");
        }).catch((error) => {
            alert("error in mail " + error)
        });
    {
        
};