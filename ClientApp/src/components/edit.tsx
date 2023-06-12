
//import React from 'react';
//import { FC, useState, useEffect } from 'react'
//import { Calendar, Event, momentLocalizer, DateLocalizer } from 'react-big-calendar'


//interface EditEventProps {
//    event: Event;
//    onUpdate: (event: Event) => void;
//    onCancel: () => void;
//}

//const EditEvent: React.FC<EditEventProps> = ({ event, onUpdate, onCancel }) => {
//    const [editedEvent, setEditedEvent] = useState<Event | null>(event);

//    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//        const { name, value } = e.target;
//        setEditedEvent(prevState => ({
//            ...prevState!,
//            [name]: value,
//        }));
//    };

//    const handleSubmit = (e: React.FormEvent) => {
//        e.preventDefault();
//        onUpdate(editedEvent!);
//    };

//    if (!editedEvent) {
//        return null; // Render nothing if editedEvent is null
//    }

//    return (
//        <form onSubmit={handleSubmit}>
//            <input
//                type="text"
//                name="title"
//               // value={editedEvent.title || ''}
//                onChange={handleInputChange}
//            />
//            {/* Add more input fields for other event properties */}
//            <button type="submit">Save</button>
//            <button type="button" onClick={onCancel}>
//                Cancel
//            </button>
//        </form>
//    );
//};

//export default EditEvent;
