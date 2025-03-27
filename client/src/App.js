import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Outlet,
  useNavigate,
  Navigate,
} from "react-router-dom";
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
import "./App.css";
import AppProvider, { AppContext } from "./Context/AppContext"; // Import AppContext
import MemberList from "./Pages/MemberList";
import Workspace from "./Components/Project/Workspace";
import ListTask from "./Components/Project/ListTask";
import Header from "./Components/Utils/Header";
import ListProject from "./Components/Project/ListProject";
import Payment from "./Components/CheckOut/Payment";
import BuyMembership from "./Components/Project/BuyMembership";
import ProjectStored from "./Components/Project/ProjectStored";
import JoinProject from "./Pages/joinProject/JoinProject";
import Summary from "./Components/Project/SummaryProject";
import UserList from "./Components/Admin/UserList";
import DetailUser from "./Components/Admin/DetailUser";
import ChangePasswordUser from "./Components/Admin/ChangePasswordUser";
import AllProjectList from "./Components/Admin/ProjectList";
import HeaderAdmin from "./Components/Utils/HeaderAdmin";
import ConfirmInvite from "./Pages/ConfirmInvite";
import ProjectSetting from "./Components/Project/ProjectSetting";

const Layout = () => {
  const location = useLocation();
  const showSidebar = location.pathname.startsWith("/project");
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <div className="d-flex" style={{ flexGrow: 1, overflow: "hidden" }}>
        {showSidebar && <Sidebar />}
        <div className="flex-grow-1" style={{ overflowY: "auto", height: "100%" }}>
          <Outlet /> {/* Đảm bảo render các route con tại đây */}
        </div>
      </div>
    </div>
  );
};
const LayoutAdmin = () => {
  const location = useLocation();
  const showSidebar = location.pathname.startsWith("/project");
  return (
    <>
      <HeaderAdmin />
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
  const [accessToken2, setAccessToken2] = useState(
    sessionStorage.getItem("token")
  );
  const navigate = useNavigate();
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

      {accessToken ||
        (accessToken2 && (
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <LayoutAdmin />
              </ProtectedRoute>
            }
          >
            <Route path="userList" element={<UserList />} />
            <Route path="viewDetailUser/:userId" element={<DetailUser />} />
            <Route
              path="changePasswordUser/:userId"
              element={<ChangePasswordUser />}
            />
            <Route path="projectList" element={<AllProjectList />} />
          </Route>
        ))}

      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route
          path="/invite-confirm/:projectId/:userId"
          element={<ConfirmInvite />}
        />
      </Route>
      {(accessToken || accessToken2) && (
        <Route path="/project/:projectId" element={<Layout />}>
          <Route path="workspace" element={<Workspace />} />
          <Route path="listTask" element={<ListTask />} />
          <Route path="members" element={<MemberList />} />
          <Route path="membership" element={<BuyMembership />} />
          <Route path="membership/checkOut" element={<Payment />} />
          <Route path="summary" element={<Summary />} />
          <Route path="setting" element={<ProjectSetting />} />
        </Route>
      )}

      {(accessToken || accessToken2) && (
        <Route path="/" element={<Layout />}>
          <Route path="listProject" element={<ListProject />} />
          <Route path="projectStored" element={<ProjectStored />} />
          <Route path="join-project" element={<JoinProject />} />
        </Route>
      )}

      {accessToken && (
        <Route
          path="/"
          element={<ProtectedRoute allowedRoles={["user", "admin"]} />}
        >
          <Route path="view-profile" />
          <Route path="edit-profile" />
          <Route path="change-password" />
        </Route>
      )}

      {accessToken || accessToken2 ? (
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <ProfilePage />
          </ProtectedRoute>
        }>
          <Route path="profileInfo" element={<ProfileInfo />} />
          <Route path="editProfile" element={<EditProfile />} />
          <Route path="changePassword" element={<ChangePassword />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login/loginForm" />} />
      )}
    </Routes>
  );
}

export default App;
