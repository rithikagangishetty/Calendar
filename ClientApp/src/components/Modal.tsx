import React, { useState} from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
type TaskType = 'login' | 'signup' | 'connectionadded' | 'eventclash'|'valid' | 'eventedited' |'noedit'| 'connectiondeleted' | 'eventadded' | 'eventdeleted' | 'overlap' | 'noconnections' | 'past' | 'connectionexist' | 'sameemail' | 'editpast';
interface MyModalProps {
    show: boolean;
    onClose: () => void;
    taskType: TaskType; 
}
interface DeleteModalProps {
    show: boolean;
    onHide: () => void;
    onEdit: (event:any) => void;
    onDelete: (event:any) => void;
}
interface SelectEmailModalProps {
    show: boolean;
    onClose: () => void;
    onSaveSelectedConnections: () => void;
    validationError: string;
    connections: string[];
    renderEmailCheckbox: (connection: string) => JSX.Element;
   
}


interface CreateEventModalProps {
    show: boolean;
    onClose: () => void;
    onPost: (event: any) => void;
    onPrivatePost: (event: any) => void;
    validationError: string;
    titleInput: string;
    onTitleInputChange: (value: string) => void;
    connections: string[];
    selectedModerators: string[];
    handleModeratorSelection: (moderator: string) => void;
}

interface EditEventModalProps {
    show: boolean;
    onClose: () => void;
    onPost: (event: any) => void;
    onPrivatePost: (event: any) => void;
    validationError: string;
    start: Date  ;
    end: Date;
    setStart: (value: any) => void;
    setEnd: (value: any) => void;
    titleInput: string;
    onTitleInputChange: (value: string) => void;
    connections: string[];
    selectedModerators: string[];
    handleModeratorSelection: (moderator: string) => void;
   // eventEdit:any
   
   
}

const MyModal: React.FC<MyModalProps> = ({ show, onClose, taskType }) => {
    let message = '';
    if (taskType === 'login') {
        message = 'Account Exists,You are successfully logged in!';
    }
    else if (taskType === 'valid') {
        message = 'Please enter a valid Email';
    }
    else if (taskType === 'eventclash') {
        message = 'The event cannot be edited to the selected time as it clashes with other events';
    }
    else if (taskType === 'editpast') {
        message = 'Deleting/Editing the past events is not allowed!';
    }
    else if (taskType === 'noedit') {
        message = 'You can not Delete/Edit this event';
    }
    else if (taskType === 'eventedited') {
        message = 'Event Edited Successfully';
    }
    else if (taskType === 'sameemail') {
        message = 'Cannot add your Email as a connection!';
    }
    else if (taskType === 'connectionexist') {
        message = 'Connection Already Exists!';
    }
    else if (taskType === 'signup') {
        message = 'New Account Created!';
    }
    else if (taskType === 'connectionadded') {
        message = 'New Connection Added!';
    }
    else if (taskType === 'connectiondeleted') {
        message = 'Connection Deleted Successfully!';
    }
    else if (taskType === 'eventadded') {
        message = 'New Event Created!';
    }
    else if (taskType === 'eventdeleted') {
        message = 'Event Deleted Successfully!';
    }
    else if (taskType == 'noconnections') {
        message = 'No Connections Found!';
    }
    else if (taskType == 'overlap') {
        message = 'Event creation is not allowed due to overlap';
    }
    else if (taskType == 'past') {
        message = 'Event creation is not allowed for past days and time';
    }
  

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Message</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{message}</p>
            </Modal.Body>
            <Modal.Footer>
                
                <Button variant="secondary" onClick={onClose}>
                    Ok
                </Button>
            </Modal.Footer>
        </Modal>
    );
}; export default MyModal;
export const EditEventModal: React.FC<EditEventModalProps> = ({
    show,
    onClose,
    onPost,
    onPrivatePost,
    validationError,
    titleInput,
    start,
    end,
    setStart,
    setEnd,
    onTitleInputChange,
    connections,
    selectedModerators,
    handleModeratorSelection,
   // eventEdit
    
}) => {
    //if (eventEdit.moderator != null) {
    //    for (var moderator in eventEdit.Moderator) {
    //        handleModeratorSelection(moderator);
    //    }
    //}
    const endTime = (date: Date) => {
        const isPastTime = start.getTime() > date.getTime();
        return !isPastTime;
    };
    const startTime = (date: Date) => {
        const isPastTime = new Date().getTime() > date.getTime();
        return !isPastTime;
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="eventTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        value={titleInput}
                        onChange={(e) => onTitleInputChange(e.target.value)}
                        isInvalid={validationError !== ''}
                    

                       
                    />
                    <Form.Control.Feedback type="invalid">{validationError}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="eventStart">
                    <Form.Label>Start Date/Time of the Event</Form.Label>
                    <DatePicker
                        showTimeSelect
                        selected={start}
                        onChange={setStart}
                        dateFormat="MM/dd/yyyy h:mm aa"
                        filterTime={startTime}
                        timeIntervals={15}
                        timeInputLabel="Time:"

                    />
                </Form.Group>
                <Form.Group controlId="eventEnd">
                    <Form.Label>End Date/Time of the Event</Form.Label>
                    <DatePicker

                        selected={end}
                        onChange={setEnd}
                        minDate={new Date()}
                        timeInputLabel="Time:"
                        dateFormat="MM/dd/yyyy h:mm aa"
                        showTimeSelect
                        timeIntervals={15}
                        filterTime={endTime}
                    />
                </Form.Group>
                <Form.Group controlId="eventEmails">
                    <Form.Label>Select the Moderators</Form.Label>
                    <div>
                        {connections.length > 0 &&
                            connections.map((moderator) => (
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
                <Button variant="success" onClick={onPost}>
                    Create Public Event
                </Button>
                <Button variant="success" onClick={onPrivatePost}>
                    Create Private Event
                </Button>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};








export const CreateEventModal: React.FC<CreateEventModalProps> = ({
    show,
    onClose,
    onPost,
    onPrivatePost,
    validationError,
    titleInput,
    onTitleInputChange,
    connections,
    selectedModerators,
    handleModeratorSelection,
}) => {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="eventTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        value={titleInput}
                        onChange={(e) => onTitleInputChange(e.target.value)}
                        isInvalid={validationError !== ''}
                    />
                    <Form.Control.Feedback type="invalid">{validationError}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="eventEmails">
                    <Form.Label>Select the Moderators</Form.Label>
                    <div>
                        {connections.length > 0 &&
                            connections.map((moderator) => (
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
                <Button variant="success" onClick={onPost}>
                    Create Public Event
                </Button>
                <Button variant="success" onClick={onPrivatePost}>
                    Create Private Event
                </Button>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};





export const SelectEmailModal: React.FC<SelectEmailModalProps> = ({
    show,
    onClose,
    onSaveSelectedConnections,
    validationError,
    connections,
    renderEmailCheckbox,
    
    
}) => {
    
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Select Email IDs</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {connections.length > 0 && connections.map((connection) => renderEmailCheckbox(connection))}
                </Form>
                {validationError && <div className="text-danger">{validationError}</div>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={onSaveSelectedConnections}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};




export const DeleteModal: React.FC<DeleteModalProps> = ({ show, onHide, onEdit, onDelete }) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete/edit this event?</Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={onEdit}>
                    Edit
                </Button>
                <Button variant="danger" onClick={onDelete}>
                    Delete
                </Button>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};




