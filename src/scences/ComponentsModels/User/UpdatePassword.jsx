import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editUser } from "../../../redux/UserSlices/EditUserSlice";
import "../User/NewUser.css";
import { useNavigate } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewUser = () => {
  const [username, setUsername] = useState("");
  const [new_password, setNew_password] = useState("");


  const [formErrors, setFromErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const { loading, error} = useSelector(
    (state) => state.CreateAddUserSlice
  );



  const CreateUserHandle = (e) => {
    e.preventDefault(); // prevent page reload
    setFromErrors(validate(username, new_password));
    setIsSubmit(true);

    console.table(username, new_password);
    if (
      Object.keys(formErrors).length === 0 &&
      username.trim() !== "" &&
      new_password.trim() !== "" 
    ) {
      dispatch(editUser({username, new_password}));
      setTimeout(() => Navigate("/"), 22000000000000); // redirect after 3 seconds

    }
  };

  const validate = (username, new_password) => {
    const errors = {};

    const name_pattern = /^[a-zA-Z\s]*$/;
    const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,50}$/; // pattern to check if password has at least one uppercase, one lowercase, one digit, one special character, and is between 8 to 50 characters long

    if (!username) {
      errors.username = "Name is Required";
    } else if (!name_pattern.test(username)) {
      errors.username = "Name should only contain letters and spaces";
    } else if (username.length < 4) {
      errors.username = "Name should contain at least 4 letters";
    }

    if (!new_password) {
      errors.new_password = "Password is Required";
    }
    //  else if (password.length < 4) {
    //   errors.password = "Password should contain at least 4 characters";
    // }
    else if (!passwordPattern.test(new_password)) {
      errors.new_password = "Les mots de passe doivent comporter entre 8 et 50 caractères et doivent inclure au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial tel que !@#$%^&*.";
    }

    return errors;
  };

  useEffect(() => {
    if (Object.keys(formErrors).length > 0 && isSubmit) {
      console.log("formErrors", formErrors);
    }
  }, [formErrors, isSubmit]);

  // added state variables
  const [showPassword, setShowPassword] = useState(false)
    useState(false);

  const togglePasswordVisibility = (e) => {
    e.preventDefault(); //this ligne permet de n'est pas reload the page when i click on the button
    setShowPassword(!showPassword);
  };

 

  return (
    <>
      <div className="app">
        <div className="content">
        <ToastContainer />
          <div className="container" style={{height:"200px", paddingTop:"80px",paddingBottom:"180px"}}>

       

            <form class="form" style={{marginLeft:"380px"}}>
              <p class="title">Update Password</p>
              <p class="message"></p>
                <label>
                  <input
                    required=""
                    placeholder=""
                    type="text"
                    class="input"
                    value={username}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      setUsername(value);
                      setFromErrors({ ...formErrors, [name]: value });
                    }}
                  />
                  <span>Username</span>
                  <p style={{ color: "red" }}>{formErrors.username}</p>
                </label>

                <label>
                  <div className="InputWithButton">
                    <input
                      class="input"
                      value={new_password}
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        setNew_password(value);
                        setFromErrors({ ...formErrors, [name]: value });
                      }}
                    />
                    <span>Password</span>
                    <RemoveRedEyeIcon
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "10px",
                        transform: "translateY(-50%)",
                      }}
                      onClick={togglePasswordVisibility}
                    />
                    <p style={{ color: "red" }}>{formErrors.new_password}</p>
                  </div>
                </label>

          

              
              <div  style={{marginLeft:"40px"}}>
                <button
                  class="submit"
                  onClick={CreateUserHandle}
                 style={{width:"400px"}}
                >
                  Update
                </button>
                <button
                  class="submit"
                  onClick={() => {
                    Navigate("/");
                  }}
                  style={{ marginLeft: "20px", background: "gray" ,width:"400px"}}
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

export default NewUser;
