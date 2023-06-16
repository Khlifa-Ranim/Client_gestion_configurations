import React, { useState } from "react";
import Topbar from "../../global/Topbar";
import Sidebar from "../../global/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { EditConfiguration } from "../../../redux/ConfigurationSlices/EditConfigurationSlice";
import "../User/NewUser.css";
import jwt_decode from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

const EditPermission = () => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const { id } = useParams(); //take the id from  the router

  const Configurations = useSelector(
    (state) => state.Featch_Configurations_Store
  );
  console.log("Configurations:", Configurations);
  const tabConfigurations = Configurations.TabConfiguration;
  console.log("tabConfigurations", tabConfigurations);

  const existingPermission = tabConfigurations.filter((f) => f.id == id);

  const { defaultValue, name, description, value, version } =
    existingPermission[0];
  const [accessToken, setAccessToken] = useState(localStorage.getItem("token"));
  const [uname, setUname] = useState(name);
  const [udescription, setUdescription] = useState(description);
  const [uversion, setUversion] = useState(version);

  const [formErrors, setFromErrors] = useState({});

  const [isSubmit, setIsSubmit] = useState(false);

  const Update_Configuraion_Handel = (e) => {
    e.preventDefault();

    const decoded_token = jwt_decode(accessToken);
    const user_id = decoded_token.user_id;

    setFromErrors (validate(uname,udescription));
    setIsSubmit(true);
  
    if (
      Object.keys(formErrors).length === 0 &&
      uname.trim() !== "" &&
      udescription.trim() !== "" 
        ) {
    dispatch(
      EditConfiguration({
        id: id,
        defaultValue,
        name:uname,
        description: udescription,
        value,
        version,
        user_id,
      })
    );
    setTimeout(() => Navigate("/FeatchConfigurations"), 22); // redirect after 3 seconds
  }};

  const handleClick = () => {
    alert('⚠️ Input is non-changeable Only the name and the description can be modified in the configuration ⛔   ');
  };

  const validate = (uname,udescription) => {
    const errors = {};

    if (!uname) {
      errors.uname = "Name is Required";
    } 
    if (!udescription) {
      errors.udescription = "Description is Required";
    } 
    return errors;
  };

  
  useEffect(() => {
    if (Object.keys(formErrors).length > 0 && isSubmit) {
      console.log(formErrors);
    }
  }, [formErrors, isSubmit]);

  return (
    <>
      <div className="app">
        <Sidebar />
        <div className="content">
          <Topbar />

          <div
            className="container"
            style={{ paddingTop: "80px", paddingBottom: "180px", }}
          >
            <form class="form">
              <p class="title">Update Configuration</p>
              <p class="message">

                Only the name and the description  can be modified in the configuration
              </p>
              <label>
                <input
                  type="text"
                  class="input"
                  value={uname}
                  placeholder="Update Name"
                  onChange={(e) => {
                    const { name, value } = e.target;
                    setUname(value);
                    setFromErrors({ ...formErrors, [name]: value });
                  }}
                />
                <span>Name</span>
                <p style={{ color: "red" }}>{formErrors.uname}</p>

              </label>

              <label>
                <input
                  type="text"
                  class="input"
                  value={udescription}
                  placeholder="Update Description"
                  onChange={(e) => {
                    const { name, value } = e.target;
                    setUdescription(value);
                    setFromErrors({ ...formErrors, [name]: value });
                  }}
                />
                <span>Description</span>
                <p style={{ color: "red" }}>{formErrors.udescription}</p>

              </label>


              <label>
                <input
                  required=""
                  type="text"
                  class="input"
                  value={uversion}
                  placeholder="Update Version Of Configuration"
                  onClick={handleClick}
                  // onChange={(e) => setUversion(e.target.value)}
                />
                <span>Version</span>
              </label>
              <div style={{ marginLeft: "40px" }}>
                <button
                  class="submit"
                  style={{ width: "400px" }}
                  onClick={Update_Configuraion_Handel}
                >
                  Update Configuration
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
