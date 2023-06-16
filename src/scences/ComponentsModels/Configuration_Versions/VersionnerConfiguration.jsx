import React, { useEffect, useState } from "react";
import Topbar from "../../global/Topbar";
import Sidebar from "../../global/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import "../User/NewUser.css";
import jwt_decode from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { message } from "antd";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VersionnerConfiguration = () => {
  const Navigate = useNavigate();

  const { id } = useParams(); //take the id from  the router

  const Configurations = useSelector(
    (state) => state.Featch_Configurations_Store
  );
  console.log("Configurations:", Configurations);
  const tabConfigurations = Configurations.TabConfiguration;
  console.log("tabConfigurations", tabConfigurations);

  const existingPermission = tabConfigurations.filter((f) => f.id == id);

  const { name, description, value } = existingPermission[0];
  const [accessToken, setAccessToken] = useState(localStorage.getItem("token"));
  const [uname, setUname] = useState(name);
  const [udescription, setUdscription] = useState(description);
  const [uvalue, setUvalue] = useState(value);
  const [responseMessage, setResponseMessage] = useState("");

  const [formErrors, setFromErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setUvalue(selectedFile); // Update the state with the selected file
  };

  const Update_Configuraion_Handel = (e) => {
    e.preventDefault();
    setFromErrors(validate(udescription, uvalue));
    setIsSubmit(true);

    if (
      Object.keys(formErrors).length === 0 &&
      udescription.trim() !== "" &&
      uvalue !== null
    ) {
      const decoded_token = jwt_decode(accessToken);
      const user_id = decoded_token.user_id;

      const formData = new FormData();
      formData.append("name", name);
      formData.append("user_id", user_id);
      formData.append("description", udescription);
      formData.append("value", uvalue);

      axios
        .put(`http://localhost:5000/versionner/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            const log = fetch("http://localhost:5000/logs", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                action: ` ${
                  jwt_decode(localStorage.getItem("token")).username
                } successfully created a new configuration With Name :  ${
                  VersionnerConfiguration.name
                }`,
              }),
            });

            toast.success("Configuration version created successfully");
            setResponseMessage("Configuration updated successfully");
            setTimeout(() => {
              setResponseMessage("");
              Navigate("/FeatchConfigurations");
            }, 400); // Display the success message for 3 seconds
          } else {
            setResponseMessage("Failed to update configuration");
          }
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            message.error(error.response.data.message);
          }
          setResponseMessage("Failed to update configuration");
        });
    }
  };

  const handleClick = () => {
    alert("⚠️ Name configuration non-changeable in new version⛔ ");
  };

  const validate = (udescription, uvalue) => {
    const errors = {};

    if (!udescription) {
      errors.udescription = "Description is Required";
    } else if (udescription.length < 8) {
      errors.udescription = "Description should contain at least 8 letters";
    }
    if (!uvalue) {
      errors.uvalue = "Value is Required";
    }

    return errors;
  };

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
              <p class="title">Versionner Configuration </p>
              <p class="message"> Add a new version for the configuration </p>
              <label>
                <input
                  required=""
                  type="text"
                  class="input"
                  value={uname}
                  placeholder="Update Name"
                  onClick={handleClick}
                />
                <span>Name</span>
              </label>

              <label>
                <input
                  required=""
                  type="text"
                  class="input"
                  value={udescription}
                  placeholder=" Description"
                  onChange={(e) => {
                    const { name, value } = e.target;
                    setUdscription(value);
                    setFromErrors({ ...formErrors, [name]: value });
                  }}
                />
                <p style={{ color: "red" }}>{formErrors.udescription}</p>
              </label>
  
                 
                  <label for="file-input" class="drop-container">
                  <span class="drop-title">Import Configuration</span>
                  File should be .txt
                  <input
                    style={{ marginTop: "10px" ,height:"100px"}}
                    type="file"
                    accept=".txt"
                    onChange={(e) => {
                      handleFileChange(e);
                      setFromErrors({
                        ...formErrors,
                        uvalue: e.target.files[0] ? null : "Value is Required",
                      });
                    }}
                    required="" 
                    id="file-input"
                  />
                  {/* {formErrors.uvalue && (
                    <p style={{ color: "red" }}>{formErrors.uvalue}</p>
                  )}               */}
                    </label>

              <div style={{ marginLeft: "40px" }}>
                <button
                  class="submit"
                  style={{ width: "400px" }}
                  onClick={Update_Configuraion_Handel}
                >
                  Versionner Configuration
                </button>
                <button
                  class="submit"
                  style={{
                    marginLeft: "20px",
                    background: "gray",
                    width: "400px",
                  }}
                  onClick={() => {
                    Navigate("/FeatchConfigurations");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default VersionnerConfiguration;
