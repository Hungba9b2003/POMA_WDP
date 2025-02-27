import React, { useState, useEffect } from "react";
import { FaAddressCard, FaUser, FaPhone } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { Table, Button } from "react-bootstrap";
import { FaKey, FaHome } from "react-icons/fa";

import styles from "../../Styles/Profile/Profile.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import imageDefault from "./../../assets/user/avatar/imageDefault.jpg";
import axios from "axios";
function ProfileInfo() {
  const [userInfo, setUserInfo] = useState(null);
  const token = localStorage.getItem("token")
    ? localStorage.getItem("token")
    : sessionStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const fetchUserInfo = async () => {
        try {
          const response = await axios.get(
            "http://localhost:9999/users/get-profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response.data);
          setUserInfo(response.data);
        } catch (error) {
          console.error("Error fetching user information:", error);
        }
      };
      fetchUserInfo();
    }
  }, [token]);

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "200px",
          marginBottom: "100px", // Tăng margin để chừa chỗ cho avatar
        }}
      >
        <img
          src="/images/cover/default-cover.jpg"
          alt="Cover"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
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
            border: "4px solid white",
            overflow: "hidden",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          <img
            src={
              userInfo.profile.avatar !== "imageDefault"
                ? userInfo.profile.avatar
                : imageDefault
            }
            alt="User Avatar"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = imageDefault;
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: "1" }}>
          <div style={{ marginTop: "50px" }}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th
                    colSpan={2}
                    style={{ fontSize: "1.3em", color: "#0F67B1" }}
                  >
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

            <Table striped bordered hover>
              <thead>
                <tr>
                  <th
                    colSpan={2}
                    style={{ fontSize: "1.3em", color: "#0F67B1" }}
                  >
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

            <div
              className="d-flex flex-wrap justify-content-center gap-2"
              style={{ marginTop: "20px" }}
            >
              <Link to="/profile/editProfile">
                <Button
                  variant="primary"
                  className="px-4 py-2"
                  style={{
                    minWidth: "160px",
                    fontSize: "1rem",
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <FaUser className="me-2" />
                  Chỉnh sửa hồ sơ
                </Button>
              </Link>
              <Link to="/profile/changePassword">
                <Button
                  variant="info"
                  className="px-4 py-2"
                  style={{
                    minWidth: "160px",
                    fontSize: "1rem",
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <FaKey className="me-2" />
                  Đổi mật khẩu
                </Button>
              </Link>
              <Link to="/home">
                <Button
                  variant="secondary"
                  className="px-4 py-2"
                  style={{
                    minWidth: "160px",
                    fontSize: "1rem",
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <FaHome className="me-2" />
                  Về trang chủ
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            flex: "1",
            backgroundColor: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "15px",
              borderRadius: "8px",
              boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3>Notification</h3>
            <p>Notification</p>
            <button
              style={{
                marginTop: "10px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => console.log("View all notifications")}
            >
              View All
            </button>
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "15px",
              borderRadius: "8px",
              boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3>Project</h3>
            <p>List Project</p>
            <button
              style={{
                marginTop: "10px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => console.log("View all projects")}
            >
              View All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileInfo;
