import * as React from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './custom.css'
import Connections from './components/Connections';
import Login from './components/login';
import ReactApp from './components/reactbigcalendar'
import CalendarPage from './components/ViewCalendar'
function App() {

    return (
       <Router>
            <Layout>
              
                    <Switch>
                        <Route  exact path="/" component={Login} />
                        <Route exact path="/Home/:id" component={Home} />
                        <Route exact path="/Home/Connections/:id" component={Connections} />
                        <Route path="/Home/ReactApp/:id" component={ReactApp} />
                        <Route path="/Home/Connections/calendar/:id/:connectionId" component={CalendarPage} />
                    </Switch>


            </Layout> 
        </Router>
       

  
 
       
        
           
        
    );
         
}
export default App;
