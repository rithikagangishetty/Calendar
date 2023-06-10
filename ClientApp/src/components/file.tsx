import axios from 'axios';

const API_URL = 'https://localhost:44373/User/';

export const getEvents = async () => {
    const response = await axios.get(API_URL
);
    return response.data;
};

export const createEvent = async (event:any) => {
    const response = await axios.post(API_URL, event);
    return response.data;
};

//export const deleteEvent = async (id) => {
//    const response = await axios.delete(`${API_URL}/${id}`);
//    return response.data;
//};
export const post=async function Post(event: any) {
    



    axios.get('https://localhost:44373/Connection/get/', { params: { _id: event.UserId } }).then((response) => {
        console.log(response.data);


        axios.post("https://localhost:44373/User", {
            _id: event._id,
            UserId: event.UserId,
            EventName: event.EventName,
            StartDate: event.StartDate,
            EndDate: event.EndDate,
            Connections: response.data.connection,

        }).then((response) => {
            console.log(response.data);
           

            alert("Event Created Succesfully");

            
        }).catch((error) => { alert("error in post " + error) });









    }).catch((error) => { alert("error in get " + error) });
}


