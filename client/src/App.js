import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/LoginPage";

import LoginForm from "./Components/Login/LoginForm";
import RegisterForm from "./Components/Login/RegisterForm";
import ForgotPassword from "./Components/Login/ForgotPass";
import ResetPassword from "./Components/Login/ResetPass";
import VerifyRegister from "./Components/Login/VerifyRegister";
import ProfilePage from "./Pages/ProfilePage";
import ChangePassword from "./Components/Profile/ChangePassword";
import EditProfile from "./Components/Profile/EditProfile";
import ProfileInfo from "./Components/Profile/ProfileInfo";
import Landing from "./Pages/LandingPage";
import "./App.css";
import AppProvider, { AppContext } from "./Context/AppContext"; // Import AppContext
import MemberList from "./Pages/MemberList";

function App() {
  const { checkTokenExpiration } = useContext(AppContext); // Lấy hàm checkTokenExpiration từ context
  const accessToken = localStorage.getItem("token");
  const accessToken2 = sessionStorage.getItem("token");
  useEffect(() => {
    checkTokenExpiration();

    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 60000); // check mỗi 1p

    return () => clearInterval(interval);
  }, [checkTokenExpiration]);

  return (
    <div className="App">
      <Routes>
        {!(accessToken || accessToken2) && (
          <>
            <Route path="/login" element={<Login />}>
              <Route path="loginForm" element={<LoginForm />} />
              <Route path="registerForm" element={<RegisterForm />} />
              <Route path="forgotPass" element={<ForgotPassword />} />
              <Route path="verify/:id/:token" element={<VerifyRegister />} />
            </Route>
          </>
        )}
        <Route path="/" element={<Landing />}></Route>

        <Route path="/login" element={<Login />}>
          <Route
            path="resetPassword/:id/:token"
            element={<ResetPassword />}
          ></Route>
        </Route>

        <Route path="/profile" element={<ProfilePage />}>
          {accessToken || accessToken2 ? (
            <>
              <Route path="profileInfo" element={<ProfileInfo />} />
              <Route path="editProfile" element={<EditProfile />} />
              <Route path="changePassword" element={<ChangePassword />} />
            </>
          ) : (
            <Route
              path="*"
              element={<Navigate to="/login/loginForm" replace />}
            />
          )}
        </Route>

        {accessToken && <Route path="/projects"  >
            <Route path=":projectId/memberList" element={<MemberList />} />
          </Route>
        }
      </Routes>
    </div>
  );
}

// // Bọc App trong BrowserRouter và AppProvider
// function indexApp() {
//   return (
//     <BrowserRouter>
//       <AppProvider>
//         <App />
//       </AppProvider>
//     </BrowserRouter>
//   );
// }

export default App;
