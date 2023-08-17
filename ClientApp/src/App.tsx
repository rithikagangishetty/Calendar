import * as React from 'react';
import Home from './components/Home';
import { Container } from 'reactstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Connections from './components/Connections';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'; 
import Login from './components/Login';
import CalendarApp from './components/Calendar'
import CalendarPage from './components/ViewCalendar';
function App() {

    return (
       <Router>
         
                <Container>
                <Routes>
                    <Route path="/" element={<Login/>} />
                    <Route path="/Home/:id" element={<Home/>} />
                    <Route path="/Home/Connections/:id" element={<Connections/>} />
                    <Route path="/Home/Calendar/:id" element={<CalendarApp/>} />
                    <Route path="/Home/Connections/calendar/:id/:connectionId" element={<CalendarPage/>} />
                    </Routes>
                </Container>
          
        </Router>
       

  
 
       
        
           
        
    );
         
}
export default App;
