import * as React from 'react';
import { useParams, useHistory, Link } from "react-router-dom";


interface RouteParams {
    id: string;
}
function Home() {
    const { id } = useParams<RouteParams>();
    const history = useHistory();
   

    
    function connect() {
        history.push(`/Connections/${id}`);
    }
    function calendar() {
        history.push(`/ReactApp/${id}`);
    }

    return (
        <div>
            <h1>Hello!</h1>
            <p>Welcome to Home Page</p>
            <br />
           
            <div>
            <button className="btn btn-primary mt-4" onClick={connect}>
                Connections Page
                </button>
            </div>
           
            <div>
                <button className="btn btn-primary mt-4" onClick={calendar}>
                    Calendar Page
                </button>
            </div>
            
           
        </div>
    );
        
    

}
export default Home;
