import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";

import LoginForm from "./Components/Login/LoginForm";
import RegisterForm from "./Components/Login/RegisterForm";
import ForgotPassword from "./Components/Login/ForgotPass";
import ResetPassword from "./Components/Login/ResetPass";
import "./App.css";
import AppProvider, { AppContext } from "./Context/AppContext"; // Import AppContext

function App() {
  const { checkTokenExpiration } = useContext(AppContext); // Lấy hàm checkTokenExpiration từ context
  const [accessToken, setAccessToken] = useState(localStorage.getItem("token"));
  const [accessToken2, setAccessToken2] = useState(
    sessionStorage.getItem("token")
  );

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
        {!accessToken && !accessToken2 && (
          <Route path="/login" element={<Login />}>
            <Route path="loginForm" element={<LoginForm />} />
            <Route path="registerForm" element={<RegisterForm />} />
            <Route path="forgotPass" element={<ForgotPassword />} />
            <Route path="verifyAccount/:id/:token" element={""} />
          </Route>
        )}

        <Route path="/login" element={<Login />}>
          <Route
            path="resetPassword/:id/:token"
            element={<ResetPassword />}
          ></Route>
        </Route>

        {accessToken && (
          <Route path="/profile" element={""}>
            <Route path="profileInfo" element={""} />
            <Route path="editProfile" element={""} />
            <Route path="changePassword" element={""} />
          </Route>
        )}
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
