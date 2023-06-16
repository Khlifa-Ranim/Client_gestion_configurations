import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  tabConversations: [],
  error: "",
};

export const featchConversations= createAsyncThunk("conversations/featchConversation", async () => {
    
    const config = {
      
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    console.log("Fetching Configurations..."); // <-- add this line to log when Permissions are being fetched
  
    const response = await axios.get("http://localhost:5000/conversations", config);
    console.log("Conversations fetched:", response.data); // <-- add this line to log the fetched users

    return response.data;
  });

  const ConversationsSlice = createSlice({
    name: "ConversationsStore",
    initialState,
    extraReducers: (builder) => {
      builder.addCase(featchConversations.pending,(state)=>{
          state.loading=true
      })
      builder.addCase(featchConversations.fulfilled,(state,action)=>{
          state.loading=false
          state.tabConversations=action.payload
          state.error=''
      })
      builder.addCase(featchConversations.rejected,(state,action)=>{
          state.loading=false
          state.tabConversations=[]
          state.error=action.error.message
      })
    },
  });
  

  export default ConversationsSlice.reducer
