import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  //token
  const accessToken = localStorage.getItem("token");
  const accessToken2 = sessionStorage.getItem("token");
  // api
  const authentication_API = `http://localhost:9999/authentication`;
  const users_API = "http://localhost:9999/users";
  //parameter
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  //fuction
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  //check token
  const checkTokenExpiration = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const { exp } = jwtDecode(token);
      if (Date.now() >= exp * 1000) {
        localStorage.removeItem("token"); // Xóa token
        setUser(null); // Xóa thông tin người dùng
        alert("Session expired, please log in again");
        navigate("/login/loginForm"); // Điều hướng về trang đăng nhập
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        checkTokenExpiration,
        accessToken,
        accessToken2,
        user,
        setUser,
        authentication_API,
        show,
        setShow,
        currentUserRole,
        setCurrentUserRole,
        handleLogout,
        checkTokenExpiration,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
