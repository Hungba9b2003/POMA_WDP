import React, { useContext, useEffect } from "react";
import { BrowserRouter, Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";

import LoginForm from "./Components/Login/LoginForm";
import "./App.css";
import AppProvider, { AppContext } from "./Context/AppContext"; // Import AppContext

function App() {
  const { checkTokenExpiration } = useContext(AppContext); // Lấy hàm checkTokenExpiration từ context
  const { accessToken } = useContext(AppContext);

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
        {!accessToken && (
          <Route path="/login" element={<Login />}>
            <Route path="loginForm" element={<LoginForm />} />
            <Route path="registerForm" element={""} />
            <Route path="forgotPass" element={""} />
            <Route path="verifyAccount/:id/:token" element={""} />
          </Route>
        )}
        <Route path="resetPassword/:id/:token" element={""} />

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
