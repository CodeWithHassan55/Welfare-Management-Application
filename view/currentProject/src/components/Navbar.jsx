import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./component.css";
import logo from "../images/logo.jpg";
import { toast } from "react-toastify";
import { FiMenu } from "react-icons/fi";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const logout = () => {
    localStorage.clear();
    toast.success("Logout Successfully");
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 3000);
  };
  return (
    <div className="navbar">
      <div>
        <img src={logo} />
        <h3>Welfare App</h3>
      </div>
      <div>
        <NavLink to="/Dashboard" className="lnk">
          Dashboard
        </NavLink>
        <NavLink to="/AdminPanel" className="lnk">
          Admin Panel
        </NavLink>
        <NavLink to="/Donars" className="lnk">
          Donars
        </NavLink>
        <NavLink to="/Sheet" className="lnk">
          Sheet
        </NavLink>
        <NavLink to="/" onClick={logout} className="lnk">
          Logout
        </NavLink>
      </div>
      <div className="responsive">
        <FiMenu
          className="menuIcon"
          onClick={() => (menu === true ? setMenu(false) : setMenu(true))}
        />
        <div
          style={{
            display: menu === true ? "flex" : "none",
          }}
        >
          <NavLink to="/Dashboard" className="lnk">
            Dashboard
          </NavLink>
          <NavLink to="/AdminPanel" className="lnk">
            Admin Panel
          </NavLink>
          <NavLink to="/Donars" className="lnk">
            Donars
          </NavLink>
          <NavLink to="/Sheet" className="lnk">
            Sheet
          </NavLink>
          <NavLink to="/" onClick={logout} className="lnk">
            Logout
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;