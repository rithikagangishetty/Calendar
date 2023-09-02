import * as React from 'react';
import Home from './components/Home';
import { Container } from 'reactstrap';
import { BrowserRouter as Router, Route, Routes, Navigate, BrowserRouter, RouteProps } from 'react-router-dom';
import Connections from './components/Connections';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'; 
import { useNavigate } from 'react-router-dom';
import Login from './components/Login';
import CalendarApp from './components/Calendar'
import CalendarPage from './components/ViewCalendar';



interface ProtectedRouteProps {
    element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
    const authToken = sessionStorage.getItem('authToken');

    if (!authToken) {
        // If the token is not present, navigate to the login page
        return <Navigate to="/" />;
    }

    // Render the protected content if the token is present
    return <>{element}</>;
};
function App() {

    return (
       
       <Router>
         
                <Container>
                <Routes>
                    <Route path="/" element={<Login/>} />
                    <Route path="/Home/:id" element={<ProtectedRoute element={<Home />} />} />
                    <Route path="/Home/Connections/:id" element={<ProtectedRoute element={<Connections />}/>} />
                    <Route path="/Home/Calendar/:id" element={<ProtectedRoute element={<CalendarApp/>}/>} />
                    <Route path="/Home/Connections/calendar/:id/:connectionId" element={<ProtectedRoute element={<CalendarPage />} />} />
                    </Routes>
                </Container>
          
        </Router>
       
        
 
       
        
           
        
    );
         
}
export default App;
