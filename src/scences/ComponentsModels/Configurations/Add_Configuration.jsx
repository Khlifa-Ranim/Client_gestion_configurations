import { Box, Button, TextField, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import Topbar from "../../global/Topbar";
import Sidebar from "../../global/Sidebar";
import "../../../index.css";
import { useState } from "react";
import jwt_decode from "jwt-decode";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { toast } from "react-toastify";
import { message } from "antd";

const Dashboard = () => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("token"));

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [formErrors, setFromErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const Navigate = useNavigate();

  const [value, setValue] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setValue(selectedFile); // Update the state with the selected file
  };

  const CreateConfigurationHandle = (e) => {
    e.preventDefault();

    setFromErrors(validate(name, description, value));
    setIsSubmit(true);

    if (
      Object.keys(formErrors).length === 0 &&
      name.trim() !== "" &&
      description.trim() !== "" &&
      value !== null
    ) {
      const decoded_token = jwt_decode(accessToken);
      const user_id = decoded_token.user_id;
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("user_id", user_id);
      formData.append("value", value); // Pass the selected file to formData

      axios
        .post("http://localhost:5000/configurations", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          const log = fetch("http://localhost:5000/logs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              action: ` ${
                jwt_decode(localStorage.getItem("token")).username
              } successfully created a new configuration With Name :  ${name}`,
            }),
          });
          // Handle success response
          toast.success("Configuration version created successfully");
          console.log(response.data);
          setTimeout(() => {
            Navigate("/FeatchConfigurations");
          }, 400);
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            message.error(error.response.data.message);
          }
        });
    }
  };

  const validate = (name, description) => {
    const errors = {};

    if (!name) {
      errors.name = "Name is Required";
    } else if (name.length < 4) {
      errors.name = "Name should contain at least 4  letters";
    }
    if (!description) {
      errors.description = "Description is Required";
    } else if (description.length < 8) {
      errors.description = "Description should contain at least 8 letters";
    }
    if (!value) {
      errors.value = "Value is Required";
    }

    return errors;
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="content">
        <Topbar />
        <ToastContainer />
        <div
          className="container"
          style={{
            height: "200px",
            paddingTop: "80px",
            paddingBottom: "180px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "120px",
            }}
          >
            <Box
              style={{
                backgroundColor: "white",
                // width: "50%",
                borderRadius: "13px",
                padding: "10px",
                marginLeft: "1px",
                height: "420px",
              }}
            >
              <p class="title">Add New configuration</p>

              {/* <Typography id="modal-modal-title" variant="h6" component="h2">
              Please fill in your profile data
            </Typography> */}
              {/* START OF FORM */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "800px",
                }}
              >
                <TextField
                  style={{ marginTop: "10px" }}
                  id="name"
                  label="Name Configuration"
                  variant="outlined"
                  placeholder="Non de Role"
                  value={name}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    setName(value);
                    setFromErrors({ ...formErrors, [name]: value });
                  }}
                />
                <p style={{ color: "red" }}>{formErrors.name}</p>

                <TextField
                  style={{ marginTop: "10px" }}
                  id="email"
                  label="Description"
                  variant="outlined"
                  placeholder="Descrption of configuration"
                  value={description}
                  // onChange={(e) => setName(e.target.value)}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    setDescription(value);
                    setFromErrors({ ...formErrors, [name]: value });
                  }}
                />
                <p style={{ color: "red" }}>{formErrors.description}</p>

                <div>

                 

<label for="file-input" class="drop-container">
                  <span class="drop-title">Import Configuration</span>
                  File should be .txt
                  <input
                    style={{ marginTop: "10px" }}
                    type="file"
                    accept=".txt"
                    onChange={handleFileChange}
                    required="" 
                    id="file-input"
                  />
                  {formErrors.uvalue && (
                    <p style={{ color: "red" }}>{formErrors.uvalue}</p>
                  )}              
                    </label>
                  <p style={{ color: "red" }}>{formErrors.value}</p>
                </div>

                {/* <p style={{ color: "red" }}>{formErrors.version}</p> */}

                <div style={{ marginTop: "10px" }}>
                  <Button
                    variant="contained"
                    style={{
                      marginLeft: "10px",
                      backgroundColor: "#8A8FF7",
                      width: "380px",
                    }}
                    onClick={CreateConfigurationHandle}
                  >
                    Create Configuration
                  </Button>
                  <Button
                    variant="contained"
                    style={{
                      marginLeft: "10px",
                      backgroundColor: "black",
                      width: "380px",
                    }}
                    onClick={() => {
                      Navigate("/FeatchConfigurations");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
              {/* END OF FORM */}
            </Box>
            {/* </Modal> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
