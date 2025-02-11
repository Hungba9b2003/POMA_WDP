import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Group from './Pages/Group';
import Admin from './Pages/Admin';
import MemberList from './Pages/MemberList';
import GroupWorkSpace from './Pages/GroupWorkSpace';
import CreateGroup from './Pages/CreateGroup';
import LoginForm from './Components/Login/LoginForm';
import VerifyAccount from './Components/Login/VerifyAccount';
import RegisterForm from './Components/Login/RegisterForm';
import ForgotPass from './Components/Login/ForgotPass';
import Reset from './Components/Login/Reset';
import Dashboard from './Components/Admin_Components/Dashboard';
import GroupListPage from './Pages/GroupListPage';
import UserManagementPage from './Pages/UserManagementPage';
import IndividualSpacePage from './Pages/IndividualSpacePage';
import GroupSpace from './Components/Group_Components/GroupSpace';
import BuyMembership from './Components/Group_Components/BuyMembership';
import Header from './Components/Header';
import Payment from './Components/CheckOut_Components/Payment';
import ProfilePage from './Pages/ProfilePage';
import ProfileInfo from './Components/Profile/ProfileInfo';
import EditProfile from './Components/Profile/EditProfile';
import ChangePassword from './Components/Profile/ChangePassword';
import GroupSetting from './Components/Group_Components/GroupSetting';
import NotAuthorized from './Pages/NotAuthorized';

import './App.css';
import AppProvider, { AppContext } from './Context/AppContext'; // Import AppContext

import AdminDashboard from './Pages/AdminDashboard';


function App() {
  const { checkTokenExpiration } = useContext(AppContext); // Lấy hàm checkTokenExpiration từ context
  const { accessToken } = useContext(AppContext)

  useEffect(() => {
    checkTokenExpiration();

    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 60000); // check mỗi 1p

    return () => clearInterval(interval);
  }, [checkTokenExpiration]);

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='*' element={<NotAuthorized />} />  
        {/* theem 1 trang notFound doi vao day */}
       
        <Route path="/home" element={<Home />} />
        {!accessToken &&<Route path="/login" element={<Login />}>
          <Route path="loginForm" element={<LoginForm />} />
          <Route path="registerForm" element={<RegisterForm />} />
          <Route path="forgotPass" element={<ForgotPass />} />
          <Route path="verifyAccount/:id/:token" element={<VerifyAccount />} />
        </Route>}
        <Route path="resetPassword/:id/:token" element={<Reset />} />




        {accessToken &&<Route path="/profile" element={<ProfilePage />}>
          <Route path="profileInfo" element={<ProfileInfo />} />
          <Route path="editProfile" element={<EditProfile />} />
          <Route path="changePassword" element={<ChangePassword />} />
        </Route>}


        {accessToken &&<Route path="/admin" element={<Admin />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="userManagement" element={<UserManagementPage />} />
        </Route>}


        {accessToken &&<Route path="/individualSpace" element={<IndividualSpacePage />}>
        </Route>}
       




        {accessToken && <Route path="/groups"  >
          <Route index element={<GroupListPage />} />
          <Route path="create" element={<CreateGroup />} />


          <Route path=":groupId" element={<GroupWorkSpace />} >
            <Route index element={<GroupSpace />} />
            <Route path="membership" element={<BuyMembership />} />
            <Route path="memberList" element={<MemberList />} />
            <Route path="membership/checkOut" element={<Payment />} />
            <Route path="groupSetting" element={<GroupSetting />} />
          </Route>
        </Route>}


        {accessToken &&<Route path="/admin" element={<Admin />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="userManagement" element={<UserManagementPage />} />
        </Route>}


      </Routes>

    </div >

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
