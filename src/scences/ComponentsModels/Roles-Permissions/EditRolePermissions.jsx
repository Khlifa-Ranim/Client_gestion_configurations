import React, { useEffect, useState } from "react";
import Topbar from "../../global/Topbar";
import Sidebar from "../../global/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { EditRolePermissions } from "../../../redux/Permission_RoleSlice/EditRolePermissionsSlice";
import "../User/NewUser.css";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { fetchRoles } from "../../../redux/RolesSlices/FetchRolesSlice";
import { fetchPermissions } from "../../../redux/PermissionSlices/FetchPermissionsSlice";
import {
  fetchRoles_permissions,
} from "../../../redux/Permission_RoleSlice/FeatchPermission_RoleSlice";
import { Multiselect } from "multiselect-react-dropdown";

import { message } from 'antd';
import { ToastContainer, toast } from "react-toastify";


const EditPermission = () => {
  const { id } = useParams(); //take the id from  the router
  // const user = useSelector((state) => state.FetchUsersStore);
  // const Users = user.users;
  // console.log(Users);



  const Navigate = useNavigate();

  const dispatch = useDispatch();

  const handleClick = () => {
    alert('⚠️ Role name stay the same only the permissions can be modified ⛔   ');
  };

  /********************Role_Permissions********************** */
  const role_permissions = useSelector(
    (state) => state.FetchRoles_PermissionsStore
  );
  console.log("role_permissionsss:", role_permissions.Permissions_Roles);
  const rolepermissions = role_permissions.Permissions_Roles;



  useEffect(() => {
    dispatch(fetchRoles_permissions());
  }, []);



  const existingRolePermissions = rolepermissions.filter((f) => f.id == id);

  console.log("existingRolePermissions",existingRolePermissions)

  /***********Roles********************************/

  const role_permission = useSelector((state) => state.FetchRolsStore);
  console.log("role:", role_permission.Roles);
  const roles_permissions = role_permission.Roles;
  console.log("roles_permissions", roles_permissions);

  const filteredRoless = roles_permissions.filter(
    (role) => role.name
  );

  useEffect(() => {
    dispatch(fetchRoles());
  }, []);

console.log("filteredRoless",filteredRoless)
  /*******************Permissions************************/

  const permission = useSelector((state) => state.FetchPermissionStore);
  const permissions = permission.Permissions;

  // const FilterPermission = permissions.filter(
  //   (permission) => permission.permission_names
  // );
  // console.log("FilterPermission", FilterPermission);

  const FilterPermission=permissions.map((permission)=>({
    id: permission.id,
    permission_names:permission.permission_names


  }))

  console.log("FilterPermission",FilterPermission)
  useEffect(() => {
    dispatch(fetchPermissions());
  }, []);
  const [selectAll, setSelectAll] = useState(false); // state variable to keep track of select all option

  // function to handle select all option
  const handleSelectAll = () => {
    if (selectAll) {
      // unselect all options
      setUNames_permissions([]);
    } else {
      // select all options
      setUNames_permissions(FilterPermission.map((permission) => ({
        id: permission.id,
        permission_names: permission.permission_names
      })));
    }
    // toggle select all option
    setSelectAll(!selectAll);
  };
  
/********************************************************* */

  // const [uNames_permissions,setUNames_permissions] = useState(existingRolePermissions[0]?.permission_ids.map((id) => ({ id })) || []);
  const [uNames_permissions,setUNames_permissions] = useState(
    existingRolePermissions[0]?.permission_ids.map((id) => {
      const role = FilterPermission.find((r) => r.id === id);

      return {
        id,
        permission_names: role ? role.permission_names : "",
      };
    }) || []
  );
  console.log("uNames_permissions",uNames_permissions)
  const [uNames_roles,setUNames_roles] = useState(existingRolePermissions[0]?.id||"");

 
console.log("uNames_roles",uNames_roles)

  // const EditRolePermissionsHandle = (e) => {
  //   e.preventDefault();
  //   // setFromErrors(validate(uPassword));
  //   // setIsSubmit(true);


  //   // if (Object.keys(formErrors).length === 0 && uPassword.trim() !== "") {
  //     dispatch(EditRolePermissions({id:id,permission_ids:uNames_permissions}))
  //     setTimeout(() => Navigate("/FeatchRole_Permission"), 200); // redirect after 3 seconds
    

  // };

  const EditRolePermissionsHandle = (e) => {
    e.preventDefault();
  
    const updatedRole = {
      id: id,
      permission_ids: uNames_permissions.map((role) => role.id),
    };
  
    dispatch(EditRolePermissions(updatedRole))
      .unwrap()
      .then(() => {
        toast.success("Role Permissions Edit Successfully");
        setTimeout(() => Navigate("/FeatchRole_Permission"), 1000); // Redirect after 1 second
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  


  return (
    <>
      <div className="app">
        <Sidebar />
        <div className="content">
          <Topbar />

          <div
            className="container"
            style={{
              height: "200px",
              paddingTop: "80px",
              paddingBottom: "180px",
            }}
          >
            <form class="form">
              <p class="title">Modify the permissions assigned to a role</p>
              <p class="message">Update account user </p>
      


              <label>
                  <label htmlFor="type"> Select a Roles:</label>
                  <select
                    required=""
                    type="text"
                    class="input"
                    value={uNames_roles}
                    // onChange={(e) => {
                    //   setUNames_roles({ role_id: Number(e.target.value) });
                    // }}
                    onClick={handleClick}

                  >
                    {filteredRoless.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <label htmlFor="type"> Select a Permissions:</label>
                  <Multiselect
                    required=""
                    type="text"
                    class="input"
                    options={FilterPermission}
                    selectedValues={uNames_permissions}
                    onSelect={(selectedList) => setUNames_permissions(selectedList)}
                    onRemove={(selectedList) => setUNames_permissions(selectedList)}
                    onChange={(selectedList) => {
                      setUNames_permissions((selectedList.map((role) => role.id)),
                      );
                    }}
                    displayValue="permission_names" 
                    />
                </label>
                <label>
                  <div style={{ marginLeft: "40px" }}>
                    <span style={{ color: "green" }}>
                      Select All Permissions
                    </span>

                    <input
                      style={{ width: "50px", height: "20px" }}
                      required=""
                      type="checkbox"
                      class="input"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    ></input>
                  </div>
                </label>

              <div style={{ marginLeft: "40px" }}>
                <button
                  class="submit"
                  onClick={EditRolePermissionsHandle}
                  style={{ width: "400px" }}
                >
                  Update User
                </button>
                <button
                  class="submit"
                  onClick={() => {
                    Navigate("/FeatchRole_Permission");
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

export default EditPermission;
