import * as React from 'react';

import Layout from './components/Layout';
import Home from './components/Home';
import { useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './custom.css'
import Connections from './components/Connections';
import Login from './components/login';
import ReactApp from './components/reactbigcalendar'

function App() {

    return (
        
            <Layout>
                <Router>
                    <Switch>
                        <Route exact path="/" component={Login} />
                        <Route path="/Connections/:id" component={Connections} />
                        <Route path="/Home/:id" component={Home} />
                        <Route path="/ReactApp/:id" component={ReactApp} />

                    </Switch>

                </Router>
        </Layout> 
    

  
 
       
        
           
        
    );
         
}
export default App;
