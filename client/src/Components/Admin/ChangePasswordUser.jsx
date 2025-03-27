import React, { useState, useContext } from "react";
import { Table } from "react-bootstrap";
import styles from "../../Styles/Profile/Profile.module.css";
import { Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { AppContext } from "../../Context/AppContext";

import "@fortawesome/fontawesome-free/css/all.min.css";

function ChangePasswordUser() {
  const { API } = useContext(AppContext);
  const { userId } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!newPassword || !confirmPassword) {
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
        `${API}/users/change-passwordById/${userId}`, // Update to your actual API endpoint
        {
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
        setNewPassword("");
        setConfirmPassword("");
        setError("");

        // Redirect after success, optionally after a short delay
        setTimeout(() => {
          navigate(`/admin/viewDetailUser/${userId}`);
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
        <div>
          <Table className="border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr>
                <th style={{ fontSize: "1.3em", color: "#0F67B1" }}>
                  Change Password
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <label htmlFor="password">New Password</label>
                  <div style={{ position: "relative" }}>
                    <i
                      className="fas fa-lock"
                      style={{
                        position: "absolute",
                        left: "10px",
                        top: "40%",
                        transform: "translateY(-80%)",
                        color: "#666",
                      }}
                    ></i>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="password"
                      value={newPassword}
                      placeholder="Enter your password"
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{ paddingLeft: "35px" }}
                      required
                    />
                    <i
                      className={
                        showNewPassword ? "fas fa-eye-slash" : "fas fa-eye"
                      }
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "40%",
                        transform: "translateY(-80%)",
                        color: "#666",
                        cursor: "pointer",
                      }}
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    ></i>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="password">Confirm New Password</label>
                  <div style={{ position: "relative" }}>
                    <i
                      className="fas fa-lock"
                      style={{
                        position: "absolute",
                        left: "10px",
                        top: "40%",
                        transform: "translateY(-80%)",
                        color: "#666",
                      }}
                    ></i>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="password"
                      value={confirmPassword}
                      placeholder="Enter your password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{ paddingLeft: "35px" }}
                      required
                    />
                    <i
                      className={
                        showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"
                      }
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "40%",
                        transform: "translateY(-80%)",
                        color: "#666",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    ></i>
                  </div>
                </td>
              </tr>
            </tbody>
          </Table>
          <div className="mt-4 flex justify-end space-x-3">
            <Button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              Back
            </Button>
            <Button type="reset">Clear</Button>
            <Button type="submit">save</Button>
          </div>
        </div>
      </form>
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
      {success && (
        <div style={{ color: "green", marginTop: "10px" }}>{success}</div>
      )}
    </div>
  );
}

export default ChangePasswordUser;
