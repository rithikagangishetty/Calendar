import moment from 'moment';
import React, { useEffect, useState} from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


type TaskType = 'login' | 'monthpast'| 'signup' | "noemail" | 'noevent' |'connectionadded' | 'eventclash' | 'valid' | 'eventedited' | 'noedit' | 'connectiondeleted' | 'eventadded' | 'eventdeleted' | 'overlap' | 'noconnections' | 'past' | 'connectionexist' | 'sameemail' | 'editpast';
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
interface EventModalProps {
    show: boolean;
    onHide: () => void;
    
    connections: any;
    moderators: any;

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
    start: Date;
    end: Date;
    Timezone: any;
    defaultTimeZone: any;
    handleUserSelection: (user: string, connect: boolean) => void;
}

interface EditEventModalProps {
    show: boolean;
    creator: boolean;
    setSelectedModerators: (moderators: string[]) => void;
    onClose: () => void;
    onPost: (event: any) => void;
    onPrivatePost: (event: any) => void;
    validationError: string;
    start: Date;
    userId: any;
    setCreator: (value: any) => void;
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
    priv: any;
    setPrivate:(value: boolean)=> void;
   
   
   
}

const MyModal: React.FC<MyModalProps> = ({ show, onClose, taskType }) => {
    let message = '';
    if (taskType === 'login') {
        message = 'Account Exists,You are successfully logged in!';
    }
    else if (taskType === 'valid') {
        message = 'Please enter a valid Email.';
    }
    else if (taskType === 'noevent') {
        message = "The event could not be created because the selected Moderators / Connections are not available at the scheduled time.";
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
    else if (taskType === 'monthpast') {
        message = "Event creation is not permitted in the month view after 00:00 as it spans the whole day. To create an event on the same day, kindly switch to the week/day view.";
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
        message = 'No Connections Found! Please add a connection.';
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
    creator,
    onPost,
    onPrivatePost,
    validationError,
    titleInput,
    start,
    setPrivate,
    userId,
    end,
    setStart,
    setCreator,
    setEnd,
    onTitleInputChange,
    connections,
    selectedModerators,
    handleUserSelection,
    handleTimezoneChange,
    selectedTimezone,
    defaultTimeZone,
    timezones,
    priv,
    

}) => {

    const [startDateValidity, setStartDateValidity] = useState(true);
    const [endDateValidity, setEndDateValidity] = useState(true);
    if (selectedTimezone == "") {
        selectedTimezone = defaultTimeZone;
    }
    if (selectedTimezone != "") {
        console.log(selectedTimezone);
    }
    moment.tz.setDefault(selectedTimezone);
    
    const currentTime = moment();
    const defaultOffset: number = moment.tz(currentTime, defaultTimeZone).utcOffset();
    const [prevSelectedTimezone, setPrevSelectedTimezone] = useState(selectedTimezone); // Initialize with an empty string
    const selectedOffset: number = moment.tz(currentTime, selectedTimezone).utcOffset();
    const timeOffset: number = defaultOffset - selectedOffset;

    useEffect(() => {
        
        const startDate = new Date(start);
        const endDate = new Date(end);
        const prevTimezoneOffset = moment.tz(start, prevSelectedTimezone).utcOffset();
        const currentTimezoneOffset = moment.tz(start, selectedTimezone).utcOffset();
        const timeOff = prevTimezoneOffset - currentTimezoneOffset;
        // Adjust the minutes based on the timeOffset
        startDate.setMinutes(start.getMinutes() - timeOff);
        endDate.setMinutes(end.getMinutes() - timeOff);

        // Update the state variables with adjusted dates
        setStart(startDate);
        setEnd(endDate);
        setPrevSelectedTimezone(selectedTimezone);
   
    }, [selectedTimezone]);



    var now = new Date();
  
    const setEndDate = (date: Date) => {
       
        setEndDateValidity(date !== null&&date > start);
        setStartDateValidity(start < date);
        setEnd(date);
    };
    const setStartDate = (date: Date) => {
        setEndDateValidity(end > date);
        setStartDateValidity(date !== null && date < end);
        
        setStart(date);
    };
    function Post(event: any) 
    {
      
        start.setMinutes(start.getMinutes() + timeOffset);
        end.setMinutes(end.getMinutes() + timeOffset);
        setCreator(creator);
        onTitleInputChange(titleInput);
        setStart(start);
        setEnd(end);
        onPost(event);
       
    }
   
   
    function PrivatePost(event: any) {
        setCreator(creator);
        start.setMinutes(start.getMinutes() + timeOffset);
        end.setMinutes(end.getMinutes() + timeOffset);
        onTitleInputChange(titleInput);
        setStart(start);
        setEnd(end);
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
   
  
    function OnCloseFunc() {
        setStart(null);
        setEnd(null);
        onTitleInputChange("");
        onClose();
    }
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
           
         
        }
    }
   
    const minDate = currentTime.toDate();
    //if (userId && userId.trim() !== '') {
    //    // Assuming 'useremail' is a valid email address and is not an empty string
    //    if (!connections.includes(userId)) {
    //        // Add 'useremail' to 'connections' if it's not already present
    //        connections.push(userId);
    //    }
    //}

    
    const endOfDay = moment(currentTime).endOf('day').toDate();
    const maxTime = new Date(
        endOfDay.getFullYear(),
        endOfDay.getMonth(),
        endOfDay.getDate(),
        23,
        59
    );
    
    const handleCreatorChange = () => {
        setCreator(!creator);
    };
    const timeInterval = 15;
    return (
        <Modal show={show} onHide={OnCloseFunc} >
            <Modal.Header style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Modal.Title>Edit Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="eventTitle">
                    <Form.Label><strong>Title</strong></Form.Label>
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
                        <Form.Label><strong>Select Timezone:</strong></Form.Label>
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
                    <Form.Label><strong>Start Date and Time of the Event</strong></Form.Label>

                    <DatePicker
                        showTimeSelect
                        timeFormat="HH:mm"
                        minTime={minTime}
                        selected={start || null}
                        onChange={setStartDate}
                        dateFormat="MM/dd/yyyy h:mm aa"
                        placeholderText="Select start date and time"
                        timeIntervals={timeInterval}
                        timeInputLabel="Time:"
                        maxTime={maxTime}
                        minDate={minDate}
                    
                    />
                   
                </Form.Group>
               <br/>
                {(!startDateValidity || !endDateValidity) && (    <FormGroup>
                   
                    <div style={{ color: 'red' }}>Invalid Start/End date and time</div>
                    <br />
                </FormGroup>  )}
              
                <Form.Group controlId="eventEnd">
                    <Form.Label><strong>End Date and Time of the Event</strong></Form.Label>
                    <DatePicker
                        timeFormat="HH:mm"
                        selected={end || null}
                        onChange={setEndDate}
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
                <Form.Group controlId="eventCreator">
                    <Form.Label>
                        <strong>Creator of the Event</strong>
                    </Form.Label>
                   
                        <Form.Check
                            type="checkbox"
                            label={userId}
                            checked={creator}
                            onChange={handleCreatorChange}
                            disabled={selectedModerators.includes(userId)}
                        />
                   
                </Form.Group>
                <br />
                <Form.Group controlId="eventEmails">
                    <Form.Label><strong>Select the Moderators</strong></Form.Label>
                    <div>
                        {connections.length > 0 &&
                            connections.map((moderator) => (
                                <Form.Check
                                    key={moderator}
                                    type="checkbox"
                                    label={ moderator}
                                    value={selectedModerators}
                                    checked={selectedModerators.includes(moderator)}
                                    onChange={() => handleUserSelection(moderator, false)}
                                    disabled={creator && moderator === userId}
                                />
                            ))}
                    </div>
                </Form.Group>
                
                
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={Post} disabled={!startDateValidity || !endDateValidity || start === null || end === null} >
                    {priv ? "Update to Public Event" : "Update Public Event"}
                </Button>
                <Button variant="success" onClick={PrivatePost} disabled={!startDateValidity || !endDateValidity || start === null || end === null} >
                    {priv ? "Update Private Event" : "Update to Private Event"}
                </Button>
                <Button variant="secondary" onClick={OnCloseFunc} >
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
    start,
    end,
    defaultTimeZone,
    Timezone,
    
}) => {
    if (Timezone == "") {
        Timezone = defaultTimeZone;
    }

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
                    <Form.Label><strong>Title</strong></Form.Label>
                    <Form.Control
                        type="text"
                        value={titleInput}
                        onChange={(e) => onTitleInputChange(e.target.value)}
                        isInvalid={validationError !== ''}
                    />
                    <Form.Control.Feedback type="invalid">{validationError}</Form.Control.Feedback>
                </Form.Group>
                <br />
                <p><strong>TimeZone:</strong> {Timezone}</p>
                    <p><strong>Start:</strong> {new Date(start).toLocaleString('en-US', {
                        timeZone: Timezone,
                        dateStyle: 'medium',
                        timeStyle: 'medium'
                    })}</p>
               
                    <p><strong>End:</strong> {new Date(end).toLocaleString('en-US', {
                       timeZone: Timezone,
                        dateStyle: 'medium',
                        timeStyle: 'medium'
                    })}</p>
                <br />
               
                <Form.Group controlId="eventEmails">
                    <Form.Label><strong>Select the Moderators</strong></Form.Label>
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
                <br />
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
                <Modal.Title>
                    Select Connections
                    <br />
                    <div style={{ fontSize: '14px', fontWeight: 'normal', textDecoration: 'underline' }}>
                        The connections selected here are not added as moderators
                    </div>
                </Modal.Title>

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

export const EventModal: React.FC<EventModalProps> = ({ show, onHide, moderators, connections }) => {
    
    return (
        <div>
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Event Creation Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        <strong> Cannot create/edit event. Some moderators/connections shown below are unavailable at the scheduled time. Try a private event, excluding them.</strong></p>


                    {moderators && moderators.length > 0 && (
                        <>
                            <p><strong>Moderators:</strong></p>
                            <ul>
                                {moderators.map((moderator: any, index: any) => (
                                    <li key={index}>{moderator}</li>
                                ))}
                            </ul>
                        </>
                    )}
                    {connections && connections.length > 0 && (
                        <>
                            <p><strong>Connections:</strong></p>
                            <ul>
                                {connections.map((connection: any, index: any) => (
                                    <li key={index}>{connection}</li>
                                ))}
                            </ul>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>

    );
}


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
                            <p><strong>Moderators:</strong></p>
                        <ul>
                            {moderator.map((moderator:any, index:any) => (
                                <li key={index}>{moderator}</li>
                            ))}
                        </ul>
                    </div>
                    )}

                {/* Add more event details here */}
                    <p><strong>Are you sure you want to delete/edit this event?</strong></p>
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




