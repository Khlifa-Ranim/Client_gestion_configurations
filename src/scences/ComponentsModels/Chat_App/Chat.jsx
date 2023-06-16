import React, { useEffect, useState } from 'react'
import "./Chat.css";
import Topbar from "../../global/Topbar";
import Sidebar from "../../global/Sidebar";
import jwt_decode from "jwt-decode";
import {featchConversations} from"../../../redux/ChatApp/FeatchConversations"
import {featchConversationsuser} from"../../../redux/ChatApp/FeatchConversationsbyuser"
import { useDispatch, useSelector } from 'react-redux';

function Chat() {
    const [chats,setChats]=useState([null])
    const [accessToken, setAccessToken] = useState(localStorage.getItem("token"));

    const decoded_token = jwt_decode(accessToken);
    const user_id = decoded_token.user_id;
    console.log("user_id", decoded_token.user_id);
    
    const Conversations = useSelector((state) => state.ConversationsSlice);

    const tabConversation = Conversations.tabConversations ; // Use an empty array as the default value
  console.log("TabConversation",tabConversation)

  const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(featchConversations());
  
// }, []);
const Conversationsuser = useSelector((state) => state.ConversationsuserSlice);
console.log("Conversationsuser",Conversationsuser)

  
    const tabConversationuser = Conversationsuser.tabConversationsuser ; // Use an empty array as the default value
  console.log("TabConversationuser",tabConversationuser)

useEffect(() => {
  dispatch(featchConversationsuser(user_id));

}, [dispatch, user_id]);

  return (
    <div className="app">
    {/* <Sidebar /> */}
    <div className="content">
      <Topbar />
<div className="Chat">
    {/*left side */}
    <div className="Left-side-chat">
        <div className="Chat-container">
        <h2>Chats</h2>
      <div className="Chat-list">
        conversations
      </div>
        </div>
      
    </div>
      {/*right side */}

      <div className="Right-side-chat">
            right side
            </div>

</div>  
</div> 
</div> )
}

export default Chat