
////import React from 'react';
////import { FC, useState, useEffect } from 'react'
////import { Calendar, Event, momentLocalizer, DateLocalizer } from 'react-big-calendar'


////interface EditEventProps {
////    event: Event;
////    onUpdate: (event: Event) => void;
////    onCancel: () => void;
////}

////const EditEvent: React.FC<EditEventProps> = ({ event, onUpdate, onCancel }) => {
////    const [editedEvent, setEditedEvent] = useState<Event | null>(event);

////    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
////        const { name, value } = e.target;
////        setEditedEvent(prevState => ({
////            ...prevState!,
////            [name]: value,
////        }));
////    };

////    const handleSubmit = (e: React.FormEvent) => {
////        e.preventDefault();
////        onUpdate(editedEvent!);
////    };

////    if (!editedEvent) {
////        return null; // Render nothing if editedEvent is null
////    }

////    return (
////        <form onSubmit={handleSubmit}>
////            <input
////                type="text"
////                name="title"
////               // value={editedEvent.title || ''}
////                onChange={handleInputChange}
////            />
////            {/* Add more input fields for other event properties */}
////            <button type="submit">Save</button>
////            <button type="button" onClick={onCancel}>
////                Cancel
////            </button>
////        </form>
////    );
////};

////export default EditEvent;

//import { useState } from 'react';

//interface EventEditFormProps {
//    event: Event;
//    onSave: (updatedEvent: Event) => void;
//    onCancel: () => void;
//}

//const EventEditForm: React.FC<EventEditFormProps> = ({
//    event,
//    onSave,
//    onCancel,
//}) => {
//    const [title, setTitle] = useState(event.title);
//    const [start, setStart] = useState(event.start);
//    const [end, setEnd] = useState(event.end);

//    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//        setTitle(e.target.value);
//    };

//    const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//        setStart(new Date(e.target.value));
//    };

//    const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//        setEnd(new Date(e.target.value));
//    };

//    const handleSave = () => {
//        const updatedEvent: Event = {
//            ...event,
//            title,
//            start,
//            end,
//        };
//        onSave(updatedEvent);
//    };

//    return (
//        <div>
//            <h2>Edit Event</h2>
//            <label htmlFor="title">Title:</label>
//            <input type="text" id="title" value={title} onChange={handleTitleChange} />
//            <label htmlFor="start">Start Date:</label>
//            <input type="datetime-local" id="start" value={start.toISOString().slice(0, -8)} onChange={handleStartChange} />
//            <label htmlFor="end">End Date:</label>
//            <input type="datetime-local" id="end" value={end.toISOString().slice(0, -8)} onChange={handleEndChange} />
//            <button onClick={handleSave}>Save</button>
//            <button onClick={onCancel}>Cancel</button>
//        </div>
//    );
//};

