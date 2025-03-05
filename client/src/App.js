import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from "react-router-dom";
import Login from "./Pages/LoginPage";
import LoginForm from "./Components/Login/LoginForm";
import RegisterForm from "./Components/Login/RegisterForm";
import ForgotPassword from "./Components/Login/ForgotPass";
import ResetPassword from "./Components/Login/ResetPass";
import Sidebar from "./Components/Utils/Sidebar";
import VerifyRegister from "./Components/Login/VerifyRegister";
import ProfilePage from "./Pages/ProfilePage";
import ChangePassword from "./Components/Profile/ChangePassword";
import EditProfile from "./Components/Profile/EditProfile";
import ProfileInfo from "./Components/Profile/ProfileInfo";
import ProtectedRoute from "./Components/Utils/ProtectedRoute";
import Landing from "./Pages/LandingPage";
import Workspace from "./Components/Project/Workspace";
import ListTask from "./Components/Project/ListTask";
import { AppContext } from "./Context/AppContext";
import Header from "./Components/Utils/Header";
import ListProject from "./Components/Project/ListProject";
import MemberList from "./Components/Project/MemberList";
import Payment from "./Components/CheckOut/Payment";
import BuyMembership from "./Components/Project/BuyMembership";
import ProjectStored from "./Components/Project/ProjectStored";

const Layout = () => {
  const location = useLocation();
  const showSidebar = location.pathname.startsWith("/project");
  return (
    <>
      <Header />
      <div className="d-flex">
        {showSidebar && <Sidebar />}
        <div className="flex-grow-1 overflow-auto">
          <Outlet /> {/* Đảm bảo render các route con tại đây */}
        </div>
      </div>
    </>
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

    <Routes>
      {!accessToken && !accessToken2 && (
        <Route path="/login" element={<Login />}>
          <Route path="loginForm" element={<LoginForm />} />
          <Route path="registerForm" element={<RegisterForm />} />
          <Route path="forgotPass" element={<ForgotPassword />} />
          <Route path="verify/:id/:token" element={<VerifyRegister />} />
          <Route path="resetPassword/:id/:token" element={<ResetPassword />} />
        </Route>
      )}

      <Route path="/" element={<Landing />} />

      {(accessToken || accessToken2) && (
        <Route path="/project/:projectId" element={<Layout />}>
          <Route path="workspace" element={<Workspace />} />
          <Route path="listTask" element={<ListTask />} />
          <Route path="members" element={<MemberList />} />
          <Route path="membership" element={<BuyMembership />} />
          <Route path="membership/checkOut" element={<Payment />} />
        </Route>
      )}

      {(accessToken || accessToken2) && (
        <Route path="/" element={<Layout />}>
          <Route path="listProject" element={<ListProject />} />
          <Route path="projectStored" element={<ProjectStored />} />
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

  );
}

export default App;
