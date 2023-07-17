import axios from 'axios';
import * as React from 'react';
import { useParams, useHistory, Link } from "react-router-dom";
import styled from 'styled-components';


interface RouteParams {
    id: string;
}
const StyledDiv = styled.div`
  text-align: center;
`;
function Home() {
    const { id } = useParams<RouteParams>();
    const history = useHistory();
    const [EmailId, setEmailId] = React.useState<string>("");
   

   React.useEffect(() => {

       GetEmail();

        
    }, []);
    function connect() {
        history.push(`/Home/Connections/${id}`);
    }
    function calendar() {
        history.push(`/Home/Calendar/${id}`);
    }
   
    function GetEmail()
    {
        axios.get('https://localhost:44373/Connection/get/', { params: { id: id } }).then((response) => {

           
            console.log(response.data);
            setEmailId(response.data.emailId);
        });

    }

    return (
        <div>
            <StyledDiv>
            <h2>Welcome to the Home Page, {EmailId}!</h2>
            </StyledDiv>
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
