import axios from "axios";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { IoEyeOffSharp, IoEyeSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Toast from "../../components/Toast";
import { Base_URI } from "../../core";
import style from "./login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [eye, setEye] = useState(false);
  const inputType = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    const adminn = localStorage.getItem("admin");
    if (adminn === "Ali Asghar") {
      navigate("/Dashboard", { replace: true });
    }
  }, []);
  const loginForm = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${Base_URI}login`, {
        email,
        password,
      });
      if (response.data.message === "Login Successfull") {
        localStorage.setItem("admin", "Ali Asghar");
        toast.success("Login Successfull");
        setTimeout(() => {
          navigate("/Dashboard", { replace: true });
        }, 3000);
      }
      if (response.data.message === "Invalid Credentials") {
        toast.error("Invalid Credentials");
      }
    } catch (error) {
      console.log(error);
    }
    setEmail("");
    setPassword("");
  };
  return (
    <div className={style.mainDiv}>
      <div className={style.container}>
        <div className={style.subContainer}>
          <h1>Login</h1>
        </div>
        <form onSubmit={(e) => loginForm(e)}>
          <input
            type="email"
            placeholder="Email Address"
            className={style.credentialField}
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className={style.showPass}>
            <input
              type="password"
              placeholder="Password"
              className={style.credentialField}
              ref={inputType}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <span
              onClick={() => {
                setEye(!eye);
                inputType.current.type === "text"
                  ? (inputType.current.type = "password")
                  : (inputType.current.type = "text");
              }}
            >
              {eye === true ? <IoEyeSharp /> : <IoEyeOffSharp />}
            </span>
          </div>
          <input type="submit" value="Log In" className={style.btn} />
        </form>
      </div>
      <Toast />
    </div>
  );
};

export default Login;
