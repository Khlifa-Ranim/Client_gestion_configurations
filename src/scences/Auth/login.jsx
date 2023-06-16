import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SignInUser, logout, addUser } from "../../redux/UserSlices/AuthSlice";
import "./login.css";
import { useNavigate } from "react-router-dom";
import Logo from "../geography/Logo2.png";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const [formErrors, setFromErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  // added state variables
  const [showPassword, setShowPassword] = useState(false);

  const Navigate = useNavigate();
  const togglePasswordVisibility = (e) => {
    e.preventDefault(); //this ligne permet de n'est pas reload the page when i click on the button
    setShowPassword(!showPassword);
  };

  const isAuthenticated = useSelector(
    (state) => state.AuthStore.isAuthenticated
  );
  console.log(isAuthenticated);
  const navigate = useNavigate();

  const notify = () => {
    toast(" LOGIN Succès 👌");
  };
  const LoginHandle = () => {
    setFromErrors(validate(username, password));
    setIsSubmit(true);

    if (
      Object.keys(formErrors).length === 0 &&
      username.trim() !== "" &&
      password.trim() !== ""
    ) {
      console.log(username, password);
      dispatch(SignInUser({ username, password }));
      // setTimeout(() => navigate("/dashboard"), 100); // redirect after 3 seconds
      dispatch(addUser());
      notify(); // display toast notification
      setTimeout(() => navigate("/dashboard"), 10); // redirect after 3 seconds
    }
  };

  const validate = (username, password) => {
    const errors = {};
    const usernamePattern = /^[a-zA-Z]{3,50}$/; // pattern to check if username only contains letters and is between 3 to 50 characters long
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,50}$/; // pattern to check if password has at least one uppercase, one lowercase, one digit, one special character, and is between 8 to 50 characters long

    if (!username) {
      errors.username = "Le nom d'utilisateur est requis.";
    }
    // else if (!usernamePattern.test(username)) {
    //   errors.username = "Les noms d'utilisateur doivent comporter entre 3 et 50 caractères et ne peuvent contenir que des lettres.";
    // }

    if (!password) {
      errors.password = "Le mot de passe est requis.";
    }
    // else if (!passwordPattern.test(password)) {
    //   errors.password = "Les mots de passe doivent comporter entre 8 et 50 caractères et doivent inclure au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial tel que !@#$%^&*.";
    // }

    return errors;
  };

  useEffect(() => {
    if (Object.keys(formErrors).length > 0 && isSubmit) {
      console.log(formErrors);
    }
  }, [formErrors, isSubmit]);

  return (
    <div className="body">
      <div className="video">
        {/* <video autoPlay loop muted  >
    <source src={videoBG} type="video/mp4" />
   </video> */}

        <div className="card4" style={{ width: "480px", height: "480px"}}>
          <div className="card22" style={{ width: "480px", height: "480px" }}>
            <div className="form2" style={{ width: "480px", height: "480px"}}>
              <p id="heading2">welcome to Login</p>
              <img
                src={Logo}
                style={{ maxWidth: "180px", maxHeight: "180px",marginLeft:"120px",marginTop:"2px" }}
              />
              <div className="field2">
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  height="16"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                  className="input-icon2"
                >
                  <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"></path>
                </svg>
                <input
                  type="text"
                  className="input-field2"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    setUsername(value);
                    setFromErrors({ ...formErrors, [name]: value });
                  }}
                />
                <p
                  style={{
                    color: "black",
                    fontSize: "10px",
                    fontWeight: "bold",
                    fontFamily: "Arial",
                    marginLeft: "12px",
                    textTransform: "none",
                  }}
                >
                  {formErrors.username}
                </p>
              </div>
              <div>
                <div className="field2">
                  <svg
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    height="16"
                    width="16"
                    xmlns="http://www.w3.org/2000/svg"
                    className="input-icon2"
                  >
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input-field2"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      setPassword(value);
                      setFromErrors({ ...formErrors, [name]: value });
                    }}
                  />
                  <RemoveRedEyeIcon
                    style={{
                      position: "absolute",
                      top: "60%",
                      right: "10px",
                      transform: "translateY(-50%)",
                    }}
                    onClick={togglePasswordVisibility}
                  />
                  <p
                    style={{
                      color: "read",
                      fontSize: "10px",
                      fontWeight: "bold",
                      fontFamily: "Arial",
                      marginLeft: "12px",
                    }}
                  >
                    {formErrors.password}
                  </p>
                </div>
              </div>
              <div className="btn">
                <button className="button1" onClick={LoginHandle} type="submit">
                  Login
                </button>
              </div>
              <p class="signup" style={{ marginTop: "40px" }}>
                Forgot Password?
                <a rel="noopener noreferrer" href="/ForgetPassword">
                  Forgot Password
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
