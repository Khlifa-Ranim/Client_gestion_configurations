
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


  export const featchConfigurationtByDefaultextById = createAsyncThunk(
    "configuration/fetchConfiguration",
    async (id, { rejectWithValue }) => {
      try {
        const response = await fetch(`http://localhost:5000/configurationsDefaultValue/file/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
  
        if (response.ok) {
          const fileContent = await response.text(); // Fetch the file content as text
          console.log("fileContent :",fileContent)
          return fileContent;
        } else {
          throw new Error(response.statusText);
        }
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  

  
  const FeatchConfigurationDeafaultByIdSlice = createSlice({
    name: "FeatchConfigurationById",
    initialState: {
      loading: false,
      error: null,
      fileContent: "" // New field to store the file content
    },
    reducers: {},
    extraReducers: {
      [featchConfigurationtByDefaultextById.pending]: (state, action) => {
        state.loading = true;
        state.error = null;
      },
      [featchConfigurationtByDefaultextById.fulfilled]: (state, action) => {
        state.loading = false;
        state.fileContent = action.payload; // Assign the file content to the new field
      },
      [featchConfigurationtByDefaultextById.rejected]: (state, action) => {
        state.loading = false;
        if (action.payload === "INVALID_ROLE") {
          state.error = "Cannot fetch permission - permission does not exist or unauthorized.";
        } else {
          state.error = action.payload;
        }
      }
    }
  });
  

export default FeatchConfigurationDeafaultByIdSlice.reducer

