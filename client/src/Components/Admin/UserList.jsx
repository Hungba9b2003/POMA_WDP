import React, { useState, useEffect } from "react";
import { Table, Button, Container, Form, Image } from "react-bootstrap";
import axios from "axios";
import { FaRegUser } from "react-icons/fa";
import { MdBlock, MdCheckCircle, MdVisibility } from "react-icons/md";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9999/admins/getUserList",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleUserStatusChange = async (userId, newStatus) => {
    try {
      await axios.post(
        "http://localhost:9999/admins/updateUserStatus",
        { userId, status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchUsers();
    } catch (error) {
      console.error("Error updating user status", error);
    }
  };

  const handleViewDetail = (userId) => {
    // Chuyển hướng đến trang chi tiết (có thể là '/users/:id' hoặc mở modal)
    window.location.href = `/admin/viewDetailUser/${userId}`;
  };

  return (
    <Container style={{ padding: "20px", maxWidth: "100%", overflowX: "auto" }}>
      <h2 className="text-center">User List</h2>
      <div className="d-flex justify-content-center">
        <Form.Control
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: "15px", maxWidth: "400px" }}
        />
      </div>
      <Table striped bordered hover responsive className="text-center">
        <thead>
          <tr>
            <th>#</th>
            <th>Avatar</th>
            <th>
              <FaRegUser /> Username
            </th>
            <th>Email</th>
            <th>Role</th>
            <th style={{ width: "100px" }}>Status</th>
            <th style={{ width: "220px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td className="text-center">
                <Image
                  src={user.profile.avatar || "/default-avatar.png"}
                  alt="User Avatar"
                  roundedCircle
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
              </td>
              <td>{user.username}</td>
              <td>{user.account.email}</td>
              <td>{user.role}</td>
              <td
                style={{
                  fontWeight: "bold",
                  color: user.status === "banned" ? "red" : "green",
                  whiteSpace: "nowrap",
                }}
              >
                {user.status}
              </td>
              <td style={{ whiteSpace: "nowrap" }}>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => handleViewDetail(user._id)}
                >
                  <MdVisibility /> View
                </Button>
                {user.status === "banned" ? (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleUserStatusChange(user._id, "active")}
                  >
                    <MdCheckCircle /> Unban
                  </Button>
                ) : (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleUserStatusChange(user._id, "banned")}
                  >
                    <MdBlock /> Ban
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default UserList;
