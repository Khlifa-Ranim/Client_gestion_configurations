import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import jwt_decode from "jwt-decode";

const initialState = {
  loading: false,
  tabConversationsuser: [],
  error: "",
};

export const featchConversationsuser = createAsyncThunk(
  "conversationsuser/featchConversation",
  async () => {
    const userId = jwt_decode(localStorage.getItem("token")).user_id; // Get the user ID from the token
    
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    const body = {
      user_id: userId,
    };

    console.log("Fetching Conversationsuser...");
    const response = await axios.post(
      "http://localhost:5000/conversations",
      body,
      config
    );
    console.log("Conversations fetched:", response.data);

    return response.data;
  }
);


  const ConversationsuserSlice = createSlice({
    name: "ConversationsuserStore",
    initialState,
    extraReducers: (builder) => {
      builder.addCase(featchConversationsuser.pending,(state)=>{
          state.loading=true
      })
      builder.addCase(featchConversationsuser.fulfilled,(state,action)=>{
          state.loading=false
          state.tabConversationsuser=action.payload
          state.error=''
      })
      builder.addCase(featchConversationsuser.rejected,(state,action)=>{
          state.loading=false
          state.tabConversationsuser=[]
          state.error=action.error.message
      })
    },
  });
  

  export default ConversationsuserSlice.reducer
