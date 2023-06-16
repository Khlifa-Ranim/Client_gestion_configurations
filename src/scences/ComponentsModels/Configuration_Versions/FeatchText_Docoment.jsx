import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "../User/NewUser.css";
import GetAppIcon from "@mui/icons-material/GetApp";
import Sidebar from "../../global/Sidebar";
import Topbar from "../../global/Topbar";

import { featchConfigurationtextById } from "../../../redux/ConfigurationVersionSlice/FeatchDocumentConfigurationVersion";

function FeatchConfigurationById({ id }) {
  const navigate = useNavigate();
  // const { id } = useParams();
  const dispatch = useDispatch();

  const fileContent = useSelector(
    (state) => state.FeatchConfigurationversionTextByIdSlice.fileContent
  );
  console.log("filecontentbesmellah", fileContent);

  useEffect(() => {
    dispatch(featchConfigurationtextById());
  }, [dispatch, id]);

  const BacktoDashboard = () => {
    navigate(`/FeatchConfigurations`);
  };

  const handleExport = () => {
    const element = document.createElement("a");
    const file = new Blob([fileContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "file.txt";
    document.body.appendChild(element); // Required for Firefox
    element.click();
    document.body.removeChild(element); // Clean up
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="content">
        <Topbar />
        <div
          className="MainContainer2"
          style={{ backgroundColor: "white", height: "800px", width: "1000px" }}
        >
          <div>
          
            <button onClick={handleExport}  class="buttonn">
                        Export File <GetAppIcon />
            <div class="hoverEffect">
            <div>
            </div>
            </div>
            </button>
            <button
              onClick={() => BacktoDashboard()}
              className="back-btn"
              style={{ marginLeft: "480px" }}
            >
              Back
            </button>
          </div>
          <h2
            className="WelcomeText"
            style={{ color: "#7980F9", marginBottom: "28px" }}
          >
            Value Configuration Details
          </h2>

          <p
            style={{
              color: "#ff347f",
              fontWeight: "bold",
              fontSize: "18px",
              marginBottom: "18px",
            }}
          >
            Configuration:
          </p>

          <div
            style={{
              marginLeft: "20px",
              marginTop: "0px",
              height: "1000px",
              width: "980px",
              overflow: "auto",
            }}
          >
            <pre style={{ fontWeight: "bold" }}>{fileContent}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeatchConfigurationById;
