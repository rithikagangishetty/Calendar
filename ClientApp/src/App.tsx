import * as React from 'react';

import Layout from './components/Layout';
import Home from './components/Home';
import Counter from './components/Counter';
import FetchData from './components/FetchData';
import { useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './custom.css'
import Connections from './components/Connections';
import Calenderweb from './components/calenderweb';
import Login from './components/login';
import DemoApp from './components/demo';
function App() {

    return (
        
        //    <Layout>
        //        <Router>
        //            <Switch>
        //                <Route exact path="/" component={Login} />
        //                <Route path="/Calenderweb/:id" component={Calenderweb} />
        //                <Route path="/Connections/:id" component={Connections} />
        //                <Route path="/Home/:id" component={Home} />
        //                <Route path="/DemoApp" component={DemoApp} />

        //            </Switch>

        //        </Router>
        //</Layout> 
        <DemoApp />
        
           
        
    );
         
}
export default App;
