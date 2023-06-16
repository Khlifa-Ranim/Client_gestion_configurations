
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


  export const featchConfigurationtextById = createAsyncThunk(
    "configuration/fetchConfiguration",
    async (id, { rejectWithValue }) => {
      try {
        const response = await fetch(`http://localhost:5000/configurations/file/${id}`, {
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
  

  
  const FeatchConfigurationTextByIdSlice = createSlice({
    name: "FeatchConfigurationById",
    initialState: {
      loading: false,
      error: null,
      fileContent: "" // New field to store the file content
    },
    reducers: {},
    extraReducers: {
      [featchConfigurationtextById.pending]: (state, action) => {
        state.loading = true;
        state.error = null;
      },
      [featchConfigurationtextById.fulfilled]: (state, action) => {
        state.loading = false;
        state.fileContent = action.payload; // Assign the file content to the new field
      },
      [featchConfigurationtextById.rejected]: (state, action) => {
        state.loading = false;
        if (action.payload === "INVALID_ROLE") {
          state.error = "Cannot fetch permission - permission does not exist or unauthorized.";
        } else {
          state.error = action.payload;
        }
      }
    }
  });
  

  export default FeatchConfigurationTextByIdSlice.reducer

