import React, { useState, useContext, useEffect } from "react";
import { FaAddressCard, FaUser, FaPhone, FaKey, FaHome } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { Table, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import imageDefault from "./../../assets/user/avatar/imageDefault.jpg";
import styles from "../../Styles/Profile/Profile.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AppContext } from "../../Context/AppContext";
function DetailUser() {
  const { API } = useContext(AppContext);
  const { userId } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const fetchUserInfo = async () => {
        try {
          const response = await axios.get(
            `${API}/users/get-profileById/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUserInfo(response.data);
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
        }
      };
      fetchUserInfo();
    }
  }, []);

  if (!userInfo) return <div>Loading...</div>;

  return (
    <div
      style={{
        backgroundColor: "#EFF2F8",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      {/* Cover + Avatar */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "200px",
          marginBottom: "120px",
        }}
      >
        <img
          src="/images/cover/default-cover.jpg"
          alt="Cover"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "50px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            border: "5px solid white",
            overflow: "hidden",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}
        >
          <img
            src={
              userInfo.profile.avatar !== "imageDefault"
                ? userInfo.profile.avatar
                : imageDefault
            }
            alt="User Avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => (e.target.src = imageDefault)}
          />
        </div>
      </div>

      {/* Thông tin chính */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        <div style={{ flex: 1 }}>
          <Table
            striped
            bordered
            hover
            className="shadow-sm rounded"
            style={{ backgroundColor: "white" }}
          >
            <thead>
              <tr style={{ backgroundColor: "#2B92E4", color: "white" }}>
                <th colSpan={2} style={{ fontSize: "1.3em" }}>
                  <FaUser /> User Information
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Username:</strong>
                </td>
                <td>{userInfo.username}</td>
              </tr>
            </tbody>
          </Table>

          <Table
            striped
            bordered
            hover
            className="shadow-sm rounded"
            style={{ backgroundColor: "white" }}
          >
            <thead>
              <tr style={{ backgroundColor: "#2B92E4", color: "white" }}>
                <th colSpan={2} style={{ fontSize: "1.3em" }}>
                  <FaAddressCard /> Contact
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>
                    <IoMail /> Email:
                  </strong>
                </td>
                <td>{userInfo.account.email}</td>
              </tr>
              <tr>
                <td>
                  <strong>
                    <FaPhone /> Phone:
                  </strong>
                </td>
                <td>{userInfo.profile.phoneNumber}</td>
              </tr>
            </tbody>
          </Table>

          {/* Nút điều hướng */}
          <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
            {/* <ProfileButton
              to="/profile/editProfile"
              icon={<FaUser />}
              text="Edit profile"
              color="#2B92E4"
            /> */}
            {/* <ProfileButton
              to={`/admin/changePasswordUser/${userInfo._id}`}
              icon={<FaKey />}
              text="Change password"
              color="#F8B5C1"
            /> */}
            <ProfileButton
              to="/admin/userList"
              icon={<FaHome />}
              text="Back"
              color="#F8D0D2"
            />
          </div>
        </div>

        {/* Bảng thông tin bên phải */}
        <div
          style={{
            flex: 1,
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <InfoCard title="Notification" content="No new notifications" />
          <InfoCard title="Project" content="List of projects" />
        </div>
      </div>
    </div>
  );
}

// Component Nút bấm (Reusable)
const ProfileButton = ({ to, icon, text, color }) => (
  <Link to={to}>
    <Button
      style={{
        minWidth: "160px",
        fontSize: "1rem",
        borderRadius: "8px",
        backgroundColor: color,
        border: "none",
        transition: "0.3s",
      }}
      onMouseOver={(e) => (e.target.style.opacity = 0.8)}
      onMouseOut={(e) => (e.target.style.opacity = 1)}
    >
      {icon} {text}
    </Button>
  </Link>
);

// Component Card Thông tin bên phải (Reusable)
const InfoCard = ({ title, content }) => (
  <div
    style={{
      backgroundColor: "#EFF2F8",
      padding: "15px",
      borderRadius: "8px",
      marginBottom: "15px",
      boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
    }}
  >
    <h3 style={{ color: "#2B92E4" }}>{title}</h3>
    <p>{content}</p>
    <Button
      style={{
        marginTop: "10px",
        backgroundColor: "#2B92E4",
        color: "white",
        border: "none",
        padding: "8px 12px",
        borderRadius: "5px",
      }}
    >
      View All
    </Button>
  </div>
);

export default DetailUser;
