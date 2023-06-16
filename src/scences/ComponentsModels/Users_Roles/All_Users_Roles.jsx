import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { useTheme } from "@mui/material";
import Topbar from "../../global/Topbar";
import Sidebar from "../../global/Sidebar";
import "../../../index.css";
//import { useHistory } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUsers_Roles,
  featchUsers_RolesById,
} from "../../../redux/Users_RolesSlice/Featch_Users_RolesSlice";
import { deleteUserRoles } from "../../../redux/Users_RolesSlice/DeleteUserRolesSlice";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";



const Users_Roles = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const Users_Roles = useSelector(
    (state) => state.Featch_Users_Roles_SliceStore
  );
  console.log("Users_Roles:", Users_Roles.UsersRoles);
  const Tab_Users_Roles = Users_Roles.UsersRoles;


  const sortedTabUserRoles= [...Tab_Users_Roles].sort(
    (a, b) => b.id - a.id
  );

  useEffect(() => {
    dispatch(fetchUsers_Roles());
  }, []);

  //   console.log(role_permission.Permissions_Roles); // <-- add this line to check the value of user.users

  const FetchRolesUsersById = (id) => {
    console.log("fetch one Role active");
    // console.log("Users_Roles:", Tab_Users_Roles); // add this line to check the value of roles_permissions
    const selectedPermission = Tab_Users_Roles.find((item) => item.id === id);
    console.log("selectedPermission", selectedPermission);
    dispatch(featchUsers_RolesById(id));
    navigate(`/FeatchRolesUserById/${id}`);
  };

  /************delete***************** */
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [roleDeleted, setRoleDeleted] = useState(false); // state variable to keep track of deleted role

  const DeleteUserRoles = () => {
    if (selectedRoleId) {

    dispatch(deleteUserRoles(selectedRoleId))
      .then(() => setRoleDeleted(true)) // set roleDeleted to true after successful deletion
      .catch((error) => console.log(error));
      setShowDialog(false);
    }
  };

  
  const handleCancel = () => {
    setShowDialog(false);
  };

  const [searchTerm, setSearchTerm] = useState("");
  console.log(searchTerm);

  const rows = Users_Roles.loading
    ? []
    : Users_Roles.error
    ? []
    : sortedTabUserRoles.map((Users_Roles, index) => ({
        ...Users_Roles,
        // id: roles_permissions.role_name,
        // id: getRowId(Users_Roles, index),
      }));

  const filteredRows = rows.filter((row) =>
    row.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(filteredRows);

  const columns = [
    { field: "id", headerName: "id", flex: 0.5, hide: true },

    {
      field: "username",
      headerName: "username",
      flex:1,
      renderCell: (params) => (
        <div style={{ fontSize: "14px", color: "black" }}>{params.value}</div>
      ),
    },
    {
      field: "roles_names",
      headerName: "roles_names",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: (params) => (
        <div style={{ fontSize: "14px" }}>{params.value}</div>
      ),
    },

    {
      field: "accessLevel",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => FetchRolesUsersById(row.id)}
              style={{ marginRight: "10px", backgroundColor: "#a8e6cf" }} // add margin-right inline style
            >
              Read
            </Button>

            <>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {setShowDialog(true); setSelectedRoleId(row.id);}}
                style={{ marginRight: "10px", backgroundColor: "#ff8585" }}
              >
                Delete
              </Button>

              <Dialog open={showDialog} onClose={handleCancel}>
                <DialogTitle
                  style={{ fontSize: "20px", backgroundColor: "#ff8585" }}
                >
                  Are you sure you want to delete this User Roles ?
                </DialogTitle>
                <DialogContent style={{ fontSize: "18px" }}>
                  Confirm Delete
                </DialogContent>
                <DialogActions>
                  <Button
                    style={{ marginRight: "10px", backgroundColor: "#A4A9FC" }}
                    onClick={DeleteUserRoles}
                    autoFocus
                  >
                    Delete
                  </Button>
                  <Button
                    style={{ marginRight: "10px", backgroundColor: "#ff8585" }}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>
            </>
            <Link to={`/EditUserRoles/${row.id}`}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  // setId(row.id)
                }}
                style={{ marginRight: "10px" }} // add margin-right inline style
              >
                Edit
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  return (
    <div className="app">
      <Sidebar />
      <div className="content">
        <Topbar />
        <Box m="20px">
          <Header title="List of Roles affect to a specific User" subtitle="List of Roles affect to a specific User" />

          <Box
            m="40px 0 0 0"
            height="75vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .name-column--cell": {
                color: colors.greenAccent[300],
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.blueAccent[700],
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.primary[400],
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: colors.blueAccent[700],
              },
              "& .MuiCheckbox-root": {
                color: `${colors.greenAccent[200]} !important`,
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `${colors.grey[100]} !important`,
              },
            }}
          >
            <ToastContainer />
            <div style={{ position: "relative" }}>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                style={{
                  height: "44px",
                  width: "34%",
                  backgroundColor: "#eeeeee",
                  paddingLeft: "44px",
                  backgroundImage:
                    'url("https://cdn-icons-png.flaticon.com/512/149/149852.png")',
                  backgroundSize: "20px",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "12px 50%",
                  border: "none",
                  borderRadius: "4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
                placeholder="Search With Username..."
              />
            </div>
            {/* <Link to="/AddRoleUsers">
              <Button
                className="button"
                variant="contained"
                color="secondary"
                style={{
                  marginLeft: "400px",
                  height: "44px",
                  width: "40%",
                  backgroundColor: "#86f3b8",
                  marginTop: "14px",
                  fontSize: "11px",
                  fontFamily: "Arial",
                  fontWeight: "bold",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  borderRadius: "4px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  transition: "all 0.2s ease-in-out",
                  display: "flex",
                  justifyContent: "center",
                }} // add margin-right inline style
              >
                Add one Roles to a User
              </Button>
            </Link> */}
            <Link to="/AddManyUsersRoles">
              <Button
                className="button"
                variant="contained"
                color="secondary"
                style={{
                  marginLeft: "400px",
                  height: "44px",
                  width: "40%",
                  backgroundColor: "#86f3b8",
                  marginTop: "14px",
                  fontSize: "11px",
                  fontFamily: "Arial",
                  fontWeight: "bold",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  borderRadius: "4px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  transition: "all 0.2s ease-in-out",
                  display: "flex",
                  justifyContent: "center",
                }} // add margin-right inline style
              >
                Add  Roles to a specific User
              </Button>
            </Link>

            <DataGrid
              rows={filteredRows}
              columns={columns}
              components={{ Toolbar: GridToolbar }}
              // getRowId={(row) => row.role_name}
              getRowId={(row) => row.id}

              // onRowClick={(row) => fetchPermissionn(row.id, role_permission.Permissions_Roles)}
            />
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Users_Roles;
