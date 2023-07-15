import moment from 'moment';
import React, { useEffect, useState} from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


type TaskType = 'login' | 'signup'  | "noemail" | 'connectionadded' | 'eventclash' | 'valid' | 'eventedited' | 'noedit' | 'connectiondeleted' | 'eventadded' | 'eventdeleted' | 'overlap' | 'noconnections' | 'past' | 'connectionexist' | 'sameemail' | 'editpast';
interface MyModalProps {
    show: boolean;
    onClose: () => void;
    taskType: TaskType; 
}
interface DeleteModalProps {
    show: boolean;
    onHide: () => void;
    onEdit: (event:any) => void;
    onDelete: (event: any) => void;
    isPast: boolean;
    title: any;
    event:any;
    start: any;
    end: any;
    connections: any;
    moderator: any;
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
    handleUserSelection: (user: string, connect: boolean) => void;
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
    handleUserSelection: (user: string, connect: boolean) => void;
    handleTimezoneChange: (event: any) => void;
    selectedTimezone: any;
    defaultTimeZone: any;
    timezones: any;
    priv: boolean;
   // eventEdit:any
   
   
}

const MyModal: React.FC<MyModalProps> = ({ show, onClose, taskType }) => {
    let message = '';
    if (taskType === 'login') {
        message = 'Account Exists,You are successfully logged in!';
    }
    else if (taskType === 'valid') {
        message = 'Please enter a valid Email.';
    }
    else if (taskType === 'eventclash') {
        message = 'The event cannot be edited to the selected time as it clashes with other events.';
    }
    else if (taskType === 'editpast') {
        message = 'Editing the past events is not allowed!';
    }
    else if (taskType === 'noemail') {
        message = 'Entered email does not exist!';
    }
    
    else if (taskType === 'noedit') {
        message = 'You can not Delete/Edit this event.';
    }
    else if (taskType === 'eventedited') {
        message = 'Event Edited Successfully.';
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
        message = 'Event creation is not allowed due to overlap.';
    }
    else if (taskType == 'past') {
        message = 'Event creation is not allowed for past days and time.';
    }
  

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }} >
                <Modal.Title>Message</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <p><strong>{message}</strong></p>
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
    handleUserSelection,
    handleTimezoneChange,
    selectedTimezone,
    defaultTimeZone,
    timezones,
    priv

}) => {
   
    if (selectedTimezone == "") {
        selectedTimezone = defaultTimeZone;
    }
    moment.tz.setDefault(selectedTimezone);
    const currentTime = moment();
    useEffect(() => {
        setStart(null);
        setEnd(null);
    }, []);
    var now = new Date();
    
    function OnPost(event:any) {
        start.setMinutes(start.getMinutes() + timeOffset);
        end.setMinutes(end.getMinutes() + timeOffset);

        onPost(event);
    }
    function OnPrivatePost(event: any) {
        //start.setMinutes(start.getMinutes() + timeOffset);
        //end.setMinutes(end.getMinutes() + timeOffset);
        onPrivatePost(event);
    }

    function areDatesOnSameDay(date1: Date, date2: Date): boolean {
        const year1 = date1.getFullYear();
        const month1 = date1.getMonth();
        const day1 = date1.getDate();

        const year2 = date2.getFullYear();
        const month2 = date2.getMonth();
        const day2 = date2.getDate();

        return year1 === year2 && month1 === month2 && day1 === day2;
    }
    const defaultOffset: number = moment.tz(currentTime, defaultTimeZone).utcOffset();
    const selectedOffset: number = moment.tz(currentTime, selectedTimezone).utcOffset();

    const timeOffset: number = defaultOffset - selectedOffset;

  
    
    var  minTime = new Date(
            currentTime.year(),
            currentTime.month(),
            currentTime.date(),
            currentTime.hour(),
            currentTime.minute()
    );
    var  endMinTime = new Date(
        currentTime.year(),
        currentTime.month(),
        currentTime.date(),
        currentTime.hour(),
        currentTime.minute()
        );
    
    if (start != null) {
        
        if (!areDatesOnSameDay(start, now)) {
            minTime = new Date();
            minTime.setHours(0, 0, 0, 0);
            
        }
    }
    if (end != null) {
        if (!areDatesOnSameDay(end, now)) {
        
                endMinTime = new Date();
                endMinTime.setHours(0, 0, 0, 0);
           
           // endMinTime.setMinutes(endMinTime.getMinutes() + 15);
        }
    }
   
    const minDate = currentTime.toDate();

    

    const endOfDay = moment(currentTime).endOf('day').toDate();
    const maxTime = new Date(
        endOfDay.getFullYear(),
        endOfDay.getMonth(),
        endOfDay.getDate(),
        23,
        59
    );

    const timeInterval = 15;
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
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
                <br />
                <Form.Group>
                    <div>
                        <Form.Label>Select Timezone:</Form.Label>
                        <br />
                        <select value={selectedTimezone} onChange={handleTimezoneChange}>
                            <option value=""> {defaultTimeZone}</option>
                            {timezones.map((timezone: any) => (

                                <option key={timezone} value={timezone}>
                                    {timezone}
                                </option>
                            ))}
                        </select> </div>
                </Form.Group>
                <br />
                <Form.Group controlId="eventStart">
                    <Form.Label>Start Date/Time of the Event</Form.Label>

                    <DatePicker
                        showTimeSelect
                        timeFormat="HH:mm"
                        minTime={minTime}
                        selected={start || null}
                        onChange={setStart}
                        dateFormat="MM/dd/yyyy h:mm aa"
                        placeholderText="Select start date and time"
                        timeIntervals={timeInterval}
                        timeInputLabel="Time:"
                        maxTime={maxTime}
                        minDate={minDate}
                    //isClearable
                    />

                </Form.Group>
                <br />
                <Form.Group controlId="eventEnd">
                    <Form.Label>End Date/Time of the Event</Form.Label>
                    <DatePicker
                        timeFormat="HH:mm"
                        selected={end || null}
                        onChange={setEnd}
                        minTime={endMinTime}
                        timeInputLabel="Time:"
                        dateFormat="MM/dd/yyyy h:mm aa"
                        showTimeSelect
                        timeIntervals={timeInterval}
                        placeholderText="Select end date and time"
                        maxTime={maxTime}
                        minDate={minDate}

                    />
                </Form.Group>
                <br />
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
                                    onChange={() => handleUserSelection(moderator, false)}
                                />
                            ))}
                    </div>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={OnPost}>
                    {priv ? "Update to Public Event" : "Update Public Event"}
                </Button>
                <Button variant="success" onClick={OnPrivatePost}>
                    {priv ? "Update Private Event" : "Update to Private Event"}
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
    handleUserSelection,
}) => {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }} >
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
                                    onChange={() => handleUserSelection(moderator,false)}
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
            <Modal.Header style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }} >
                <Modal.Title>Select Connections </Modal.Title>
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




export const DeleteModal: React.FC<DeleteModalProps> = ({ show, onHide, onEdit, onDelete, isPast, start, end, moderator, title, connections, event }) => {
    
    return (
        
        <Modal show={show} onHide={onHide}>
          
            <Modal.Header style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }} >
                <Modal.Title>Delete Event</Modal.Title>
            </Modal.Header>
            {event && (
            <Modal.Body>

                    {title&&(<p>Title: {title}</p>)}
                    {start && (<p>Start : {start}</p>)}
                    {end && (<p>End: {end}</p>)}

                {connections && connections.length > 0 && (
                    <div>
                        <p>Connections:</p>
                        <ul>
                            {connections.map((connection:any, index:any) => (
                                <li key={index}>{connection}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {moderator && moderator.length > 0 && (
                    <div>
                        <p>Moderators:</p>
                        <ul>
                            {moderator.map((moderator:any, index:any) => (
                                <li key={index}>{moderator}</li>
                            ))}
                        </ul>
                    </div>
                    )}

                {/* Add more event details here */}
                <p>Are you sure you want to delete/edit this event?</p>
            </Modal.Body>
            )}
            <Modal.Footer>
                <Button variant="success" onClick={onEdit} disabled={isPast} >
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




