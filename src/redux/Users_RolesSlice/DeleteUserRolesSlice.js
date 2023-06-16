import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";

export const deleteUserRoles = createAsyncThunk(
  "user/deleteUserRoles",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/users_roles/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}
          `,
        },
      });
      if (response.status === 200) {
        toast.success(" User Roles deleted Successfully")
        const log = await fetch("http://localhost:5000/logs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            action: `${
              jwt_decode(localStorage.getItem("token")).username
            } deleted Role with id: ${id}`,
          }),
        });
        // Refresh the page
        window.location.reload();
        return "role to many permissions deleted successfully";
      } else if (response.status === 202) {
        return { id, message: "Nothing deleted" };
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


const DeleteUserRolesSlice = createSlice({
  name: "deleteUserRoles",
  initialState: {
    isLoding: false,
    error: null
  },

  extraReducers: {
    [deleteUserRoles.pending]: (state, action) => {
      state.isLoding = true;
      state.error = null;
    },
[deleteUserRoles.fulfilled]: (state, action) => {
  state.isLoding = false;
  state.permissions = state.permissions.filter((permission) => permission.id !== action.payload.id);
},

    [deleteUserRoles.rejected]: (state, action) => {
      state.isLoding = false;
      state.error = action.payload;
    }
  }

});

export default DeleteUserRolesSlice.reducer;
