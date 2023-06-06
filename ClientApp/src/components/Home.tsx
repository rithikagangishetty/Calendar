import * as React from 'react';

import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import Connections from './Connections';
import Calenderweb from './calenderweb';
import DemoApp from './demo';
interface RouteParams {
    id: string;
}
function Home() {
    const { id } = useParams<RouteParams>();
    const history = useHistory();
    function calender() {
        history.push(`/calenderweb/${id}`);
    }
    function demo() {
        history.push(`/demo/${id}`);
    }
    function connect() {
        history.push(`/Connections/${id}`);
    }

    return (
        <div>
            <h1>Hello!</h1>
            <p>Welcome to Home Page</p>
            <br />
            <ul>

                {/*<li>*/}

                {/*    <Link to="/demo/">calenderweb</Link>*/}
                {/*</li>*/}
                {/*<li>*/}

                {/*    <Link to="/Connections/">Connections</Link>*/}
                {/*</li>*/}


            </ul>
            <div>
            <button className="btn btn-primary mt-4" onClick={calender}>
                Calendar Page
            </button>
        </div >
            <div>
            <button className="btn btn-primary mt-4" onClick={connect}>
                Connections Page
                </button>
            </div>
            <div>
                <button className="btn btn-primary mt-4" onClick={demo}>
                    demo Page
                </button>
            </div>
           
        </div>
    );
        
    

}
export default Home;
