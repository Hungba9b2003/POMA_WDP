import React, { useState, useEffect } from "react";
import { FaAddressCard, FaUser, FaPhone } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { Table, Button } from "react-bootstrap";
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
      <div>
        <h2>User Profile</h2>

        <div className={styles.avatarContainer}>
          <img
            src={
              userInfo.profile.avatar !== "imageDefault"
                ? userInfo.profile.avatar
                : imageDefault
            }
            alt="User Avatar"
            className={styles.avatarImage}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = imageDefault;
            }}
          />
        </div>

        <div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th colSpan={2} style={{ fontSize: "1.3em", color: "#0F67B1" }}>
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
                <th colSpan={2} style={{ fontSize: "1.3em", color: "#0F67B1" }}>
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

          <div style={{ marginTop: "10px" }}>
            <Link to="/profile/editProfile">
              <Button variant="primary" style={{ marginRight: 5 }}>
                Edit Profile
              </Button>
            </Link>
            <Link to="/profile/changePassword">
              <Button variant="primary" style={{ marginRight: 5 }}>
                ChangePassword
              </Button>
            </Link>
            <Link to="/home">
              <Button variant="secondary">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileInfo;
