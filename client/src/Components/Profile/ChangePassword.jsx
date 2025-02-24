import React, { useState } from "react";
import { Table } from "react-bootstrap";
import styles from "../../Styles/Profile/Profile.module.css";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("token")
        ? localStorage.getItem("token")
        : sessionStorage.getItem("token"); // Retrieve token from local storage
      const response = await axios.put(
        "http://localhost:9999/users/change-password", // Update to your actual API endpoint
        {
          oldPassword,
          newPassword,
          confirmPassword, // Include confirmPassword for server-side validation
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle success
      if (response.status === 200) {
        setSuccess("Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setError("");

        // Redirect after success, optionally after a short delay
        setTimeout(() => {
          navigate("/profile/profileinfo");
        }, 2000);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(
          err.response.data.message ||
            "An error occurred while changing the password."
        );
      } else {
        setError("Network error or server error.");
      }
    }
  };
  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th colSpan={2} style={{ fontSize: "1.3em", color: "#0F67B1" }}>
                Change Password
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Old Password:</strong>
              </td>
              <td>
                <input
                  type="password"
                  name="oldPassword"
                  placeholder="Enter old password"
                  className="inputField"
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <strong>New Password:</strong>
              </td>
              <td>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Enter new password"
                  className="inputField"
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </td>
            </tr>
            <tr>
              <td>
                <strong>Re New Password:</strong>
              </td>
              <td>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Enter new password"
                  className="inputField"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </td>
            </tr>
          </tbody>
        </Table>
        <div style={{ marginTop: "10px" }}>
          <Button variant="primary" type="submit" style={{ marginRight: 5 }}>
            Save
          </Button>
          <Button variant="secondary" style={{ marginRight: 5 }} type="reset">
            Clear
          </Button>
        </div>
      </form>
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
      {success && (
        <div style={{ color: "green", marginTop: "10px" }}>{success}</div>
      )}
    </div>
  );
}

export default ChangePassword;
