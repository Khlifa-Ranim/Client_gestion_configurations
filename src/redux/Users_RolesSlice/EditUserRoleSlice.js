import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";
import { message } from 'antd';
import { toast } from "react-toastify";

export const editUserRoles = createAsyncThunk(
  "role/editUserRoles",
  async (updatedRole, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:5000/users_roles/${updatedRole.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updatedRole),
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
          } Updated user roles with id :  ${updatedRole.id}`,
        }),
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const UserRolesSlice = createSlice({
  name: "editRolsStore",
  initialState: {
    isLoading: false,
    Roles: [],
    error: "",
  },
  extraReducers: {
    [editUserRoles.pending]: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    // [editUserRoles.fulfilled]: (state, action) => {
    //   state.isLoading = false;
    //   state.roles.map((role) => {
    //     if (role.id == action.payload.id) {
    //       role.roles_ids = action.payload.roles_ids;

    //     }
    //   });
    // },
    [editUserRoles.fulfilled]: (state, action) => {
      state.isLoading = false;
      const { id, roles_ids } = action.payload;
      const role = state.roles.find((role) => role.id === id);
      if (role) {
        role.roles_ids = roles_ids;
      }
    },
    
    [editUserRoles.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export default UserRolesSlice.reducer;












// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import jwt_decode from "jwt-decode";

// export const updateUserRoles = createAsyncThunk(
//   "role/updateUserRoles",
//   async ({ userId, data }, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`http://localhost:5000/users_roles/${userId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify(data),
//       });

//       const responseData = await response.json();

//       if (!response.ok) {
//         return rejectWithValue(responseData.error);
//       }

//       // ADD LOG
//       const log = await fetch("http://localhost:5000/logs", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({
//           action: `${jwt_decode(localStorage.getItem("token")).username} updated role with Name: ${data.name}`,
//         }),
//       });

//       return responseData;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const UserRolesSlice = createSlice({
//   name: "userRoles",
//   initialState: {
//     isLoading: false,
//     roles: [],
//     error: null,
//   },
//   reducers: {},
//   extraReducers: {
//     [updateUserRoles.pending]: (state) => {
//       state.isLoading = true;
//       state.error = null;
//     },
//     [updateUserRoles.fulfilled]: (state, action) => {
//       state.isLoading = false;
//       state.roles = state.roles.map((role) => {
//         if (role.username_id === action.payload.username_id) {
//           return {
//             ...role,
//             roles_names: action.payload.roles_names,
//             username: action.payload.username,
//             roles_ids: action.payload.roles_ids,
//           };
//         }
//         return role;
//       });
//     },
//     [updateUserRoles.rejected]: (state, action) => {
//       state.isLoading = false;
//       state.error = action.payload;
//     },
//   },
// });

// export default UserRolesSlice.reducer;


