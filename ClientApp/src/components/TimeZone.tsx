import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment-timezone';

const TimeZoneDatePicker = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const handleDateChange = (date:Date) => {
        setSelectedDate(date);
    };

    const applyTimeZone = (date:string, timeZone:string) => {
        return moment(date).tz(timeZone).toDate();
    };

    return (
        <div>
            <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                customInput={<input />} // Use a custom input to avoid warnings
                value={selectedDate ? selectedDate.toString() : ''}
                onChangeRaw={() => { }} // Disable direct editing of the input field
                onBlur={(e) => handleDateChange(applyTimeZone(e.target.value, 'Asia/Calcutta'))}
            />
        </div>
    );
};

export default TimeZoneDatePicker;
