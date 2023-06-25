import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

type TaskType = 'login' | 'signup' | 'connectionadded' | 'valid' |'eventedited'| 'connectiondeleted' | 'eventadded' | 'eventdeleted' | 'overlap' | 'noconnections' | 'past' | 'connectionexist' | 'sameemail';
interface MyModalProps {
    show: boolean;
    onClose: () => void;
    taskType: TaskType; 
}

const MyModal: React.FC<MyModalProps> = ({ show, onClose, taskType }) => {
    let message = '';
    if (taskType === 'login') {
        message = 'Account Exists,You are successfully logged in!';
    }
    else if (taskType === 'valid') {
        message = 'Please enter a valid Email';
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

