import React, { useEffect, useState } from "react";
import Topbar from "../../global/Topbar";
import Sidebar from "../../global/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { editUserRoles } from "../../../redux/Users_RolesSlice/EditUserRoleSlice";
import "../User/NewUser.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { fetchUsers_Roles } from "../../../redux/Users_RolesSlice/Featch_Users_RolesSlice";
import { fetchUsers } from "../../../redux/UserSlices/FetchUserSlice";
import { fetchRoles } from "../../../redux/RolesSlices/FetchRolesSlice";

import { fetchRoles_permissions } from "../../../redux/Permission_RoleSlice/FeatchPermission_RoleSlice";
import Multiselect from "multiselect-react-dropdown";

import { message } from 'antd';

const EditRole = () => {
  const { id } = useParams(); //take the id from  the router
  const dispatch = useDispatch();

  const Navigate = useNavigate();

  const handleClick = () => {
    alert('⚠️ User name stay the same only the roles can be modified ⛔   ');
  };

  /**********************User_Roles***************** */
  const Users_Roles = useSelector(
    (state) => state.Featch_Users_Roles_SliceStore
  );
  console.log("Users_Roles:", Users_Roles.UsersRoles);
  const Tab_Users_Roles = Users_Roles.UsersRoles;

  const existingUserRoles = Tab_Users_Roles.filter((f) => f.id == id);
  console.log("existingUserRoles", existingUserRoles);
  useEffect(() => {
    dispatch(fetchUsers_Roles());
  }, []);

  /*****************************Users Select*************************/

  const user = useSelector((state) => state.FetchUsersStore);
  const Users = user.users;

  const FiltterAllUsers = Users.filter((user) => user.username);
  console.log("FiltterAllUsers", FiltterAllUsers);

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  // const { roles_ids, username_id } = existingUserRoles[0];
  // const [uRoles_ids, setURolesids] = useState(
  //   existingUserRoles[0]?.roles_ids || []
  // );
  // const [uRoles_ids, setURolesids] = useState(existingUserRoles[0]?.roles_ids.map((id) => ({ id })) || []);

  
  const [uUser_id, setUUser_id] = useState(existingUserRoles[0]?.id || "");

  /**********************Roles_Permissions**************************** */
  const role_permission = useSelector(
    (state) => state.FetchRoles_PermissionsStore
  );
  const roles_permissions = role_permission.Permissions_Roles;
console.log("roles_permissions",roles_permissions)
  // const filteredRoles = roles_permissions.filter((role) => role.role_name);
  // console.log("filteredRolessss", filteredRoles);

  
  const filteredRoles = roles_permissions.map((role) => ({
    id: role.id,
    role_name: role.role_name,
  }));
  console.log("filteredRoles:", filteredRoles);


  useEffect(() => {
    dispatch(fetchRoles_permissions());
  }, []);

  
  const [uRoles_ids, setURolesids] = useState(
    existingUserRoles[0]?.roles_ids.map((id) => {
      const role = filteredRoles.find((r) => r.id === id);
      return {
        id,
        role_name: role ? role.role_name : "",
      };
    }) || []
  );
  console.log("uRoles_ids",uRoles_ids)

  /**************************************************** */
  // const EditUserRolesHandel = (e) => {
  //   e.preventDefault();

  //   dispatch(editUserRoles({ id: id, roles_ids: uRoles_ids, id: uUser_id }));
  //   setTimeout(() => Navigate("/FeatchRolesUsers"), 1000); // redirect after 3 seconds
  // };

  const EditUserRolesHandel = (e) => {
    e.preventDefault();
  
    const updatedRole = {
      id: id,
      roles_ids: uRoles_ids.map((role) => role.id),
    };
  
    dispatch(editUserRoles(updatedRole))
      .unwrap()
      .then(() => {
        toast.success("User Roles Edit Successfully");
        setTimeout(() => Navigate("/FeatchRolesUsers"), 1000); // Redirect after 1 second
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  
  /*****************************Roles SELECT*************************/

  const [selectAlll, setSelectAlll] = useState(false); // state variable to keep track of select all option

  // function to handle select all option
  const handleSelectRoleAll = () => {
    if (selectAlll) {
      // unselect all options
      setURolesids([]);
    } else {
      // select all options
      setURolesids(
        filteredRoles.map((role) => ({
          role_name: role.role_name,
          id: role.id,
        }))
      );
    }
    // toggle select all option
    setSelectAlll(!selectAlll);
  };
/************************Featch Roles*************************** */
  const role = useSelector((state) => state.FetchRolsStore);

  useEffect(() => {
    dispatch(fetchRoles());
  }, []);

  
  
    return (
    <>
      <div className="app">
        <Sidebar />
        <div className="content">
          <Topbar />
          <ToastContainer />
          <div
            className="container"
            style={{ paddingTop: "80px", paddingBottom: "180px" }}
          >
            <form class="form">
              <p class="title">Update User Roles</p>
              <label>
                <label htmlFor="type"> Select User :</label>
                <select
                  required=""
                  type="text"
                  className="input"
                  value={uUser_id}
                  // onChange={(e) => {
                  //   setUUser_id(Number(e.target.value));
                  // }}
                  onClick={handleClick}

                >
                  <option></option>

                  {FiltterAllUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </label>

              <label>
  <label htmlFor="type"> Select Roles:</label>
  <Multiselect
    required=""
    type="text"
    className="input"
    options={filteredRoles}
    selectedValues={uRoles_ids}
    onSelect={(selectedList) => setURolesids(selectedList)}
    onRemove={(selectedList) => setURolesids(selectedList)}
    onChange={(selectedList) => {
      setURolesids(selectedList.map((role) => role.id));
    }}
    displayValue="role_name" // Use "role_name" to display role names
  />
</label>


              <label>
                <div style={{ marginLeft: "40px" }}>
                  <span style={{ color: "green" }}>Select All Roles </span>

                  <input
                    style={{ width: "50px", height: "20px" }}
                    required=""
                    type="checkbox"
                    class="input"
                    checked={selectAlll}
                    onChange={handleSelectRoleAll}
                  ></input>
                </div>
              </label>
              <div style={{ marginLeft: "40px" }}>
                <button
                  class="submit"
                  onClick={EditUserRolesHandel}
                  style={{ width: "400px" }}
                >
                  Edit Role{" "}
                </button>
                <button
                  class="submit"
                  onClick={() => {
                    Navigate("/FeatchRolesUsers");
                  }}
                  style={{
                    marginLeft: "20px",
                    background: "gray",
                    width: "400px",
                  }}
                >
                  Cancel{" "}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditRole;
