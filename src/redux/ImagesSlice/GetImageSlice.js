import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchImageById = createAsyncThunk(
  "image/fetchImageById",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/image/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "image/jpeg",
        },
        responseType: "arraybuffer", // Specify the response type as arraybuffer
      });

      const imageBlob = new Blob([response.data], { type: "image/jpeg" });
      const imageUrl = URL.createObjectURL(imageBlob);

      return imageUrl;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const imageSlice = createSlice({
  name: "image",
  initialState: {
    loading: false,
    image: null,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchImageById.pending, (state) => {
        state.loading = true;
        state.image = null;
        state.error = "";
      })
      .addCase(fetchImageById.fulfilled, (state, action) => {
        state.loading = false;
        state.image = action.payload;
        state.error = "";
      })
      .addCase(fetchImageById.rejected, (state, action) => {
        state.loading = false;
        state.image = null;
        state.error = action.payload;
      });
  },
});

export default imageSlice.reducer;
