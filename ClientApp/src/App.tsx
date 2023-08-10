import * as React from 'react';
/*import Layout from './components/Layout';*/
import Home from './components/Home';
import { Container } from 'reactstrap';
import NavMenu from './components/NavMenu';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Connections from './components/Connections';
import Login from './components/Login';
import CalendarApp from './components/Calendar'
import CalendarPage from './components/ViewCalendar'
function App() {

    return (
       <Router>
          {/* // <Layout>*/}
            {/*<React.Fragment>*/}
                {/*<NavMenu />*/}
                <Container>
                    <Switch>
                        <Route exact path="/" component={Login} />
                        <Route exact path="/Home/:id" component={Home} />
                        <Route exact path="/Home/Connections/:id" component={Connections} />
                        <Route exact path="/Home/Calendar/:id" component={CalendarApp} />
                        <Route exact path="/Home/Connections/calendar/:id/:connectionId" component={CalendarPage} />
                    </Switch>
                </Container>
            {/*</React.Fragment>*/}

           {/* </Layout> */}
        </Router>
       

  
 
       
        
           
        
    );
         
}
export default App;
