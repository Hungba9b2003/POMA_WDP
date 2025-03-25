import {
  Navbar,
  Nav,
  Button,
  Dropdown,
  Image,
  Container,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { FiLogOut, FiUser, FiKey } from "react-icons/fi";
import axios from "axios";
import { FaBell } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
const AdminHeader = () => {
  const [userInfo, setUserInfo] = useState(null);

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  let id = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      id = decoded?.id || null;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

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
          setUserInfo(response.data);
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      };
      fetchUserInfo();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUserInfo(null);
    window.location.href = "/login/loginForm";
  };

  return (
    <Navbar expand="lg" className="px-4 py-2" style={{ background: "#343a40" }}>
      <Container fluid>
        {/* Logo */}
        <Navbar.Brand href="/admin" className="text-white fw-bold fs-3">
          Admin Panel
        </Navbar.Brand>

        {/* Menu */}
        <Nav className="me-auto gap-3">
          <Nav.Link href="/admin/userList" className="text-white">
            User List
          </Nav.Link>
          <Nav.Link href="/admin/projectList" className="text-white">
            Project List
          </Nav.Link>
        </Nav>

        {/* User Dropdown */}
        {userInfo ? (
          <div className="ms-auto d-flex gap-2">
            {/* <Button variant="light">
              <FaBell className="text-dark fs-4" />
            </Button> */}
            <Dropdown align="end">
              <Dropdown.Toggle variant="light" id="dropdown-basic">
                <Image
                  src={userInfo?.profile?.avatar || "/logo.png"}
                  alt="avatar"
                  className="rounded-circle"
                  width={40}
                  height={40}
                />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Header>{userInfo.username}</Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item href="/profile/profileInfo">
                  <FiUser /> Profile
                </Dropdown.Item>
                <Dropdown.Item href="/profile/changePassword">
                  <FiKey /> Change password
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>
                  <FiLogOut /> Log out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        ) : (
          <div className="ms-auto d-flex gap-2">
            <Button href="/login/loginForm" variant="outline-dark">
              Sign in
            </Button>
            <Button href="/login/registerForm" variant="dark">
              Register
            </Button>
          </div>
        )}
      </Container>
    </Navbar>
  );
};

export default AdminHeader;
