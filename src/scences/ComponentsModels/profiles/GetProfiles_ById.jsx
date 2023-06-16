
import React, { useEffect, useState } from 'react';
import {  useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import "..//User/NewUser.css";


import Sidebar from '../../global/Sidebar';
import Topbar from '../../global/Topbar';
import { fetchImageById } from "../../../redux/ImagesSlice/GetImageSlice";
import jwt_decode from "jwt-decode";
import { fetchProfiles } from "../../../redux/ProfileSlices/FetchProfileSlice";


function FetchProfileById() {
  const { id } = useParams();
  console.log("id:", id);

  const navigate=useNavigate();


  const tabprofile = useSelector((state) => state.FetchProfilessStore);
  const profiles = tabprofile.profiles


  
  const dispatch = useDispatch();

  const profileId = parseInt(id); // convert id to an integer
  const profile = profiles.find((item) => item.id === profileId);

  const [accessToken, setAccessToken] = useState(localStorage.getItem("token"));
 
  const decoded_token = jwt_decode(accessToken);

 
  useEffect(() => {
    dispatch(fetchProfiles());
  }, []);


  const ProfileIdMap = {};
  profiles.forEach((profile) => {
    ProfileIdMap[profile.user_id] = profile.id;
  });

  const ProfileId = ProfileIdMap[decoded_token.user_id];
/****************************TImage****************************** */
const Image = useSelector((state) => state.imageSlice.image);

useEffect(() => {
  if (!Image) {
    dispatch(fetchImageById({ id:ProfileId }));
  }
}, [dispatch, profileId, Image]);

  const { name, adresse,description,email,image,telephone } = profile;

  return (
    <div  className="app">
    <Sidebar/> 
     <div  className="content">
     <Topbar/>
    <div className="MainContainer2"style={{height:"800px",backgroundColor:"white"}}>
    <button onClick={() => navigate(`/FetchProfiles`)}className="back-btn"style={{marginTop:"2px"}}>
              Back
            </button>
              <img
                alt="profile-user"
                width="100px"
                height="100px"
                src={Image}
                style={{ cursor: "pointer", borderRadius: "50%" }}

              />
    <h2 className="WelcomeText" style={{ marginBottom:"120px",color:"#8A8FF7",marginTop:'8px'}}>{name}</h2>
    <div className="InputContainer">
     {profile.loading && <div>Chargement.....</div>}
<table style={{marginLeft:"20px",height:"1200px",width:"600px"}}>
<tr style={{height:"40px"}}>  <p style={{ color: "#ff347f"}}>description: </p></tr> <tr style={{height:"40px"}}> {description}</tr>
<tr style={{height:"40px"}}>  <p style={{ color: "#ff347f"}}>adresse: </p></tr> <tr style={{height:"40px"}}>  {adresse}</tr>
<tr style={{height:"40px"}}>  <p style={{ color: "#ff347f"}}>email: </p> </tr> <tr style={{height:"40px"}}> {email}</tr>
<tr style={{height:"40px"}}>  <p style={{ color: "#ff347f"}}>telephone: </p></tr> <tr style={{height:"40px"}}> {telephone}</tr>


      </table>    

    </div>
    </div>

    </div>
    </div>

  );
}

export default FetchProfileById;


