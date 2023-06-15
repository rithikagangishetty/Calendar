import * as React from 'react';

import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useHistory } from 'react-router-dom';

interface RouteParams {
    id: string;
}
function Home() {
    const { id } = useParams<RouteParams>();
    const history = useHistory();
    function calender() {
        history.push(`/calenderweb/${id}`);
    }

    
    function connect() {
        history.push(`/Connections/${id}`);
    }
    function reactdemo() {
        history.push(`/ReactApp/${id}`);
    }

    return (
        <div>
            <h1>Hello!</h1>
            <p>Welcome to Home Page</p>
            <br />
           
        {/*    <div>*/}
        {/*    <button className="btn btn-primary mt-4" onClick={calender}>*/}
        {/*        Calendar Page*/}
        {/*    </button>*/}
        {/*</div >*/}
            <div>
            <button className="btn btn-primary mt-4" onClick={connect}>
                Connections Page
                </button>
            </div>
           
            <div>
                <button className="btn btn-primary mt-4" onClick={reactdemo}>
                    Calendar Page
                </button>
            </div>
           
        </div>
    );
        
    

}
export default Home;
