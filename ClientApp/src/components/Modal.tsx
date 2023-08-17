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
interface DeleteConfirmProps {
    show: boolean;
    onClose: () => void;
    onDelete: (event: any) => void;
    

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
    initialTimezone: any;
    defaultTimeZone: any;
    timezones: any;
    priv: any;
   
   
   
   
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
    initialTimezone,
    onPost,
    onPrivatePost,
    validationError,
    titleInput,
    start,
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
   
    moment.tz.setDefault(selectedTimezone);
    const currentTime = moment();
    const defaultOffset: number = moment.tz(currentTime, defaultTimeZone).utcOffset();
    const selectedOffset: number = moment.tz(currentTime, selectedTimezone).utcOffset();
    const [prevSelectedTimezone, setPrevSelectedTimezone] = useState(selectedTimezone);
    const timeOffset: number = defaultOffset - selectedOffset;
   
    useEffect(() => {

        if (show) {
            const currentTime = moment();
            const prevTimezoneOffset = moment.tz(start, prevSelectedTimezone).utcOffset();
            const selectedOffset: number = moment.tz(currentTime, selectedTimezone).utcOffset();
            const timeOffset:number = prevTimezoneOffset - selectedOffset; 
            

            if (start && end) {
                const startDate = new Date(start);
                const endDate = new Date(end);
                startDate.setMinutes(start.getMinutes() - timeOffset);
                endDate.setMinutes(end.getMinutes() - timeOffset);
                setStart(startDate);
                setEnd(endDate);
            }

            setPrevSelectedTimezone(selectedTimezone);
        }
    }, [show, selectedTimezone]);


   



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
        setPrevSelectedTimezone(defaultTimeZone);
       
    }
   
   
    function PrivatePost(event: any) {
        setCreator(creator);
        start.setMinutes(start.getMinutes() + timeOffset);
        end.setMinutes(end.getMinutes() + timeOffset);
        onTitleInputChange(titleInput);
        setStart(start);
        setEnd(end);
        setPrevSelectedTimezone(defaultTimeZone);
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
        onTitleInputChange("");
        setPrevSelectedTimezone(defaultTimeZone);
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

    const [expandedModerator, setExpandedModerator] = useState<string | null>(null);

    
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

                <Form.Group controlId="eventTitle" className="form-inline">
                    <Form.Label className="form-label" ><strong>Title : </strong></Form.Label>
                    <Form.Control
                        type="text"
                        value={titleInput}
                        onChange={(e) => onTitleInputChange(e.target.value)}
                        isInvalid={validationError !== ''}
                        style={{ width: '70%' }}
                    />
                    <Form.Control.Feedback type="invalid">{validationError}</Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="form-inline">
                    
                    <Form.Label className="form-label"  ><strong>Select Timezone :</strong></Form.Label>
                        <select value={selectedTimezone} onChange={handleTimezoneChange}>
                            <option value="">{defaultTimeZone}</option>
                            {timezones.map((timezone: any) => (
                                <option key={timezone} value={timezone}>
                                    {timezone}
                                </option>
                            ))}
                        </select>
                   
                </Form.Group>
               
                
                <Form.Group controlId="eventStart" className="form-inline">
                    <div className="datetime-group">
                        <div className="datetime-label">
                            <Form.Label><strong>Start Date and Time :</strong></Form.Label>
                        </div>
                        <div className="datetime-picker">
                            <DatePicker
                                showTimeSelect
                                timeFormat="HH:mm"
                                minTime={minTime}
                                selected={start || null}
                                onChange={setStartDate}
                                dateFormat="MM/dd/yyyy h:mm aa"
                                placeholderText="Select Start Date and Time"
                                timeIntervals={timeInterval}
                                timeInputLabel="Time:"
                                maxTime={maxTime}
                                minDate={minDate}
                            />
                        </div>
                    </div>
                </Form.Group>
                {(!startDateValidity || !endDateValidity) && (    <FormGroup>
                   
                    <div style={{ color: 'red' }}>Invalid Start/End date and time</div>
                    
                </FormGroup>  )}
              
                <Form.Group controlId="eventEnd" className="form-inline">
                    <div className="datetime-group">
                        <div className="datetime-label">
                            <Form.Label><strong>End Date and Time :</strong></Form.Label>
                        </div>
                        <div className="datetime-picker">
                            <DatePicker
                                timeFormat="HH:mm"
                                selected={end || null}
                                onChange={setEndDate}
                                minTime={endMinTime}
                                timeInputLabel="Time:"
                                dateFormat="MM/dd/yyyy h:mm aa"
                                showTimeSelect
                                timeIntervals={timeInterval}
                                placeholderText="Select End Date and Time"
                                maxTime={maxTime}
                                minDate={minDate}
                            />
                        </div>
                    </div>
                </Form.Group>
                <Form.Group controlId="eventCreator" className="form-inline">
                    <Form.Label className="form-label">
                        <strong>Creator of the Event : </strong>
                    </Form.Label>

                    <Form.Check
                        type="checkbox"
                        label={userId}
                        checked={creator}
                        onChange={handleCreatorChange}
                        disabled={selectedModerators.includes(userId)}
                    />

                </Form.Group>
               
                <Form.Group controlId="eventEmails">
                    <Form.Label><strong>Select the Moderators</strong></Form.Label>
                    <div>
                        {connections.length > 0 &&
                            connections.map((moderator) => (
                                <Form.Check
                                    key={moderator}
                                    type="checkbox"
                                    //label={ moderator}
                                    label={
                                        <span
                                            className="truncate"
                                            onClick={() => setExpandedModerator(expandedModerator === moderator ? null : moderator)}
                                        >
                                            {expandedModerator === moderator ? moderator : (moderator.length > 50 ? `${moderator.slice(0, 50)}...` : moderator)}
                                        </span>
                                    }
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
    const [expandedModerator, setExpandedModerator] = useState<string | null>(null);

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
                <Form.Group controlId="eventTitle" className="form-inline">
                    <Form.Label className="form-label" ><strong>Title : </strong></Form.Label>
                    <Form.Control
                        type="text"
                        value={titleInput}
                        onChange={(e) => onTitleInputChange(e.target.value)}
                        isInvalid={validationError !== ''}
                        style={{ width: '70%' }}
                    />
                    <Form.Control.Feedback type="invalid">{validationError}</Form.Control.Feedback>
                </Form.Group>
              
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
              
               
                <Form.Group controlId="eventEmails">
                    <Form.Label><strong>Select the Moderators</strong></Form.Label>
                    <div >
                        {connections.length > 0 &&
                            connections.map((moderator) => (
                                <Form.Check 
                               
                                    key={moderator}
                                    type="checkbox"
                                
                                    label={
                                        <span
                                            className="truncate"
                                            onClick={() => setExpandedModerator(expandedModerator === moderator ? null : moderator)}
                                        >
                                            {expandedModerator === moderator ? moderator : (moderator.length > 50 ? `${moderator.slice(0, 50)}...` : moderator)}
                                        </span>
                                    }
                                    checked={selectedModerators.includes(moderator)}
                                    onChange={() => handleUserSelection(moderator,false)}
                                />
                            ))}
                    </div>
                </Form.Group>
                
            </Modal.Body>
            <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                    <div style={{ textAlign: 'center' }}>Select Connections</div>
                    <div style={{ fontSize: '14px', fontWeight: 'normal', textDecoration: 'underline', textAlign:'center' }}>
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
            <Modal.Footer style={{ display: 'flex', justifyContent: 'center' }}>
               
                <Button variant="success" onClick={onSaveSelectedConnections}>
                    Save
                </Button>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export const EventModal: React.FC<EventModalProps> = ({ show, onHide, moderators, connections }) => {
    const [expandedConnection, setExpandedConnection] = useState<string | null>(null);
    const [expandedModerator, setExpandedModerator] = useState<string | null>(null);
    return (
        <div>
            <Modal show={show} onHide={onHide}>
                <Modal.Header >
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
                                    <li key={index}>
                                        <span
                                            className="truncate"
                                            onClick={() => setExpandedModerator(expandedModerator === moderator ? null : moderator)}
                                        >
                                            {expandedModerator === moderator ? moderator : (moderator.length > 70 ? `${moderator.slice(0, 70)}...` : moderator)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                    {connections && connections.length > 0 && (
                        <>
                            <p><strong>Connections:</strong></p>
                            <ul>
                                {connections.map((connection: any, index: any) => (
                                    <li key={index}> <span
                                        className="truncate"
                                        onClick={() => setExpandedConnection(expandedConnection === connection ? null : connection)}
                                    >
                                        {expandedConnection === connection ? connection : (connection.length > 50 ? `${connection.slice(0, 50)}...` : connection)}
                                    </span></li>
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


export const DeleteConfirmModal: React.FC<DeleteConfirmProps> = ({ show, onClose,onDelete}) => {

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Modal.Title> <strong>Delete Confirmation </strong></Modal.Title>
            </Modal.Header>
            <Modal.Body style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <p>          <strong> Are you sure you want to delete?</strong></p>   </Modal.Body>
            <Modal.Footer style={{ display: 'flex', justifyContent: 'center' }}>
               
                <Button variant="danger" onClick={onDelete}>
                    Yes
                </Button>
                <Button variant="secondary" onClick={onClose}>
                    No
                </Button>
            </Modal.Footer>
        </Modal>
    );
       
};




