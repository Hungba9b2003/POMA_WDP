import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Login from "./Pages/Login";
import LoginForm from "./Components/Login/LoginForm";
import RegisterForm from "./Components/Login/RegisterForm";
import ForgotPassword from "./Components/Login/ForgotPass";
import ResetPassword from "./Components/Login/ResetPass";
import Sidebar from "./Components/Utils/Sidebar";
// import ViewProfile from "./Components/User_Components/ViewProfile";
// import EditProfile from "./Components/User_Components/EditProfile";
// import ChangePassword from "./Components/User_Components/ChangePassword";
import ProtectedRoute from "./Components/Utils/ProtectedRoute";

import "./App.css";
import { AppContext } from "./Context/AppContext";

const Layout = ({ children }) => {
  const location = useLocation();
  const hidePaths = ["/login", "/forgot-password", "/verify/:token", "/resetPassword/:id/:token"];

  return (
    <div className="d-flex">

      {!hidePaths.includes(location.pathname) && <Sidebar />}
      <div className="flex-grow-1 overflow-auto">{children}</div>
    </div>
  );
};

function App() {
  const { checkTokenExpiration } = useContext(AppContext);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("token"));
  const [accessToken2, setAccessToken2] = useState(sessionStorage.getItem("token"));

  useEffect(() => {
    checkTokenExpiration();
    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 60000);
    return () => clearInterval(interval);
  }, [checkTokenExpiration]);

  return (
    <Layout>
      <Routes>
        {!accessToken && !accessToken2 && (
          <Route path="/login" element={<Login />}>
            <Route path="loginForm" element={<LoginForm />} />
            <Route path="registerForm" element={<RegisterForm />} />
            <Route path="forgotPass" element={<ForgotPassword />} />
            <Route path="verifyAccount/:id/:token" element={""} />
            <Route path="resetPassword/:id/:token" element={<ResetPassword />} />
          </Route>
        )}

        {accessToken && (
          <Route path="/" element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
            <Route path="view-profile" />
            <Route path="edit-profile" />
            <Route path="change-password" />
          </Route>
        )}
      </Routes>
    </Layout>
  );
}

export default App;
