import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import "./JoinProject.css";

const JoinProject = ({ handleJoin }) => {
  const [projectCode, setProjectCode] = useState("");

  // Hàm lấy userId từ token
  const getUserIdFromToken = () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return null;
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.userId || decodedToken.id || null;
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
      return null;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectCode.trim()) {
      Swal.fire("Fail", "Please enter the project code", "error");
      return;
    }

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      Swal.fire("Fail", "You are not logged in", "error");
      return;
    }

    const userId = getUserIdFromToken();
    if (!userId) {
      Swal.fire("Lỗi", "Failed to retrieve user information from the token", "error");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:9999/projects/join-by-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ projectCode, userId }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        Swal.fire(
          "Successfully",
          data.message || "Join project success!",
          "success"
        );
        setProjectCode("");
        if (handleJoin) handleJoin(projectCode);
      } else {
        Swal.fire("Fail", data.message || "Fail to join project", "error");
      }
    } catch (error) {
      Swal.fire("Fail", "An error occurred, please try again!", "error");
    }
  };

  return (
    <div className="join-project-container">
      <h3 className="title">Enter project code</h3>
      <Form onSubmit={handleSubmit} className="join-form">
        <Form.Group>
          <Form.Label className="label">Project Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter project code..."
            value={projectCode}
            onChange={(e) => setProjectCode(e.target.value)}
            className="input-field"
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="join-button">
          Tham gia
        </Button>
      </Form>
    </div>
  );
};

export default JoinProject;
