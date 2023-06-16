import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";
import { message } from "antd";

export const deleteRolePermissions = createAsyncThunk(
  "permission/deletePermissions",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/roles_permissions/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}
          `,
        },
      });
      if (response.status === 200) {
        toast.success(" Role to Many permissions deleted Successfully")
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
      const errorMessage = "Default Role Cannot be Deleted"; // Replace "Custom error message" with your desired error message

      message.error(errorMessage); // Display the custom error message using Ant Design's message component
    
      return rejectWithValue(error.message);
    }
  }
);


const DeleterolePermissionSlice = createSlice({
  name: "deletePermissions",
  initialState: {
    isLoding: false,
    error: null
  },

  extraReducers: {
    [deleteRolePermissions.pending]: (state, action) => {
      state.isLoding = true;
      state.error = null;
    },
[deleteRolePermissions.fulfilled]: (state, action) => {
  state.isLoding = false;
  state.permissions = state.permissions.filter((permission) => permission.id !== action.payload.id);
},

    [deleteRolePermissions.rejected]: (state, action) => {
      state.isLoding = false;
      state.error = action.payload;
    }
  }

});

export default DeleterolePermissionSlice.reducer;
