import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  TabConfiguration: [],
  error: "",
};

export const featchConfigurations= createAsyncThunk("configuration/featchConfigurations", async () => {
    
    const config = {
      
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
  
    const response = await axios.get("http://localhost:5000/configurations", config);
  
  
    return response.data.map((Configuration) => {
      return {
        createdAt:Configuration.createdAt,
        createdBy: Configuration.createdBy,
        defaultValue: Configuration.defaultValue,
        description: Configuration.description,
        id: Configuration.id,
        name: Configuration.name,
        updatedBy: Configuration.updatedBy,
        value: Configuration.value,
        version: Configuration.version,}

  });
  });


 
  export const featchConfigurationById = createAsyncThunk(
    "configuration/fetchconfiguration",
    async (id, { rejectWithValue }) => {
      try {
        const response = await fetch(`http://localhost:5000/configuration/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          
        });
  
        if (response.status === 200) {
          return "configuration deleted successfully";
        } else if (response.status === 202) {
          return "Nothing deleted";
        } else if (response.status === 401) {
          throw new Error("Unauthorized - Invalid or missing token");
        } else if (response.status === 403) {
          throw new Error("Forbidden - User does not have necessary roles");
        } else if (response.status === 404) {
          throw new Error("Not Found - Endpoint not found or invalid permissions");
        } else {
          throw new Error("Internal Server Error");
        }
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

  // export const featchConfigurationtextById = createAsyncThunk(
  //   "configuration/fetchConfiguration",
  //   async (id, { rejectWithValue }) => {
  //     try {
  //       const response = await fetch(`http://localhost:5000/configurations/file/${id}`, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       });
  
  //       if (response.ok) {
  //         const fileContent = await response.text(); // Fetch the file content as text
  //         console.log("fileContent :",fileContent)
  //         return fileContent;
  //       } else {
  //         throw new Error(response.statusText);
  //       }
  //     } catch (error) {
  //       return rejectWithValue(error.message);
  //     }
  //   }
  // );
  
  const Featch_Users_Roles_Slice = createSlice({
    name: "Featch_Configurations_Store",
    initialState,
    extraReducers: (builder) => {
      builder.addCase(featchConfigurations.pending,(state)=>{
          state.loading=true
      })
      builder.addCase(featchConfigurations.fulfilled,(state,action)=>{
          state.loading=false
          state.TabConfiguration=action.payload
          state.error=''
      })
      builder.addCase(featchConfigurations.rejected,(state,action)=>{
          state.loading=false
          state.TabConfiguration=[]
          state.error=action.error.message
      })
    },
  });
  
  const FeatchConfigurationByIdSlice = createSlice({
    name: "FeatchConfigurationById",
    initialState,
  
    extraReducers: {
      [featchConfigurationById.pending]: (state, action) => {
        state.loading = true;
        state.error = null;
      },
      [featchConfigurationById.fulfilled]: (state, action) => {
        state.loading = false;
        state.RoleInfo = action.payload;
      },
      [featchConfigurationById.rejected]: (state, action) => {
        state.loading = false;
        if (action.payload === "INVALID_ROLE") {
          state.error = "Cannot fech permission - permission does not exist or unauthorized.";
        } else {
          state.error = action.payload;
        }
      }
    }
  
  });
  
  // const FeatchConfigurationTextByIdSlice = createSlice({
  //   name: "FeatchConfigurationById",
  //   initialState: {
  //     loading: false,
  //     error: null,
  //     fileContent: "" // New field to store the file content
  //   },
  //   reducers: {},
  //   extraReducers: {
  //     [featchConfigurationtextById.pending]: (state, action) => {
  //       state.loading = true;
  //       state.error = null;
  //     },
  //     [featchConfigurationtextById.fulfilled]: (state, action) => {
  //       state.loading = false;
  //       state.fileContent = action.payload; // Assign the file content to the new field
  //     },
  //     [featchConfigurationtextById.rejected]: (state, action) => {
  //       state.loading = false;
  //       if (action.payload === "INVALID_ROLE") {
  //         state.error = "Cannot fetch permission - permission does not exist or unauthorized.";
  //       } else {
  //         state.error = action.payload;
  //       }
  //     }
  //   }
  // });
  

  export default Featch_Users_Roles_Slice.reducer
  export const fetchRoleReducer = FeatchConfigurationByIdSlice.reducer;
  // export const fetchconfigurationReducer = FeatchConfigurationTextByIdSlice.reducer;

