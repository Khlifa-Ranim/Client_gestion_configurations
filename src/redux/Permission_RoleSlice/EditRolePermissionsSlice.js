import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";
import { message } from "antd";
import { toast } from "react-toastify";

export const EditRolePermissions = createAsyncThunk(
  "permission/editPermission",
  async (updatedUser, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:5000/roles_permissions/${updatedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updatedUser),
        }
      );

      const data = await response.json();

      if (!response.ok) {
               /**************msg error */
               message.error(data.message);
               const { error } = await response.json();
        return rejectWithValue(data.error);
      }

      // ADD LOG
      const log = await fetch("http://localhost:5000/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          action: `${
            jwt_decode(localStorage.getItem("token")).username
          }Updated permissions for role with Id :  ${updatedUser.id}`,
        }),
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const RolePermissionsSlice = createSlice({
  name: "editPermissionStore",
  initialState: {
    isLoading: false,
    Users: [],
    error: "",
  },
  extraReducers: {
    [EditRolePermissions.pending]: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    // [EditRolePermissions.fulfilled]: (state, action) => {
    //   state.isLoading = false;
    //   state.roles.map((role) => {
    //     if (role.role_id == action.payload.role_id) {
    //       role.permission_ids = action.payload.permission_ids;
    //       // role.permission_names = action.payload.permission_names;
    //       // role.role_name = action.payload.role_name;


    //     }
    //   });
    // },
    [EditRolePermissions.fulfilled]: (state, action) => {
      state.isLoading = false;
      const { id, permission_ids } = action.payload;
      const role = state.roles.find((role) => role.id === id);
      if (role) {
        role.permission_ids = permission_ids;
      }
    },
    [EditRolePermissions.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export default RolePermissionsSlice.reducer;
