import axios from 'axios';
import * as React from 'react';
import { useParams, useNavigate, Link } from "react-router-dom";
import styled from 'styled-components';
import { Logout } from './Modal';

const StyledDiv = styled.div`
  text-align: center;
 
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;
const ConnectionContainer = styled.div`
  padding-top: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh; 
  justify-content: flex-start; 
`;
const Button = styled.button`
  margin: 0px 10px;
  width:200px;
   padding: 10px 20px;
   background-color: floralwhite; /* Change this to your desired background color */
  color: black; /* Change this to your desired text color */
`;
const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px; /* Adjust the left value to position the button */
  padding: 10px 20px;
  background-color: #e74c3c; /* Change this to your desired background color */
  color: white; /* Change this to your desired text color */
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
function Home() {
   // const { id } = useParams<RouteParams>();
    const params = useParams();
    const id = params.id;
    const navigate = useNavigate();
    const [EmailId, setEmailId] = React.useState<string>("");
    const baseUrl = process.env.REACT_APP_URL;

   React.useEffect(() => {

       GetEmail();

        
   }, []);
    /// <summary>
    /// Used for storing the before page information
    /// </summary>
    function goBack() {
        navigate(-1);
    }
   
    /// <summary>
    /// Once the user clicks on connection page button it takes to the connection page.
    /// </summary>
    function connect() {
        navigate(`/Home/Connections/${id}`);
    }
     /// <summary>
    /// Once the user clicks on calendar page button it takes to the calendar page.
    /// </summary>
    function calendar() {
        navigate(`/Home/Calendar/${id}`);
    }
   /// <summary>
    /// This function gets the email ID of the user entered.
    /// </summary>
    function GetEmail()
    {
        axios.get(`${baseUrl}/Connection/GetUser/`, { params: { id: id } }).then((response) => {

           
            
            setEmailId(response.data.emailId);
        });

    }

    return (
        <div >
            <Logout />
            <ConnectionContainer className="connections-container">
                <StyledDiv>
                    <h2>Welcome to the Home Page, {EmailId}!</h2>
            </StyledDiv>
            <br />
           
           
                <ButtonContainer>
                <Button className="btn btn-primary mt-4" onClick={connect}>
                Connections Page
                </Button>
           
                <Button className="btn btn-primary mt-4" onClick={calendar}>
                    Calendar Page
                </Button>
           
                </ButtonContainer>
                <button className="back-button" onClick={goBack}>
                    Back
                </button>
               

            </ConnectionContainer>
        
            
            </div>
    );
        
    

}
export default Home;
