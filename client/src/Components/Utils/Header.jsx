import { Navbar, Nav, Button, Dropdown, Image, Container, NavDropdown, Modal, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { FiLogOut, FiUser, FiKey } from "react-icons/fi";
import axios from "axios";

const Header = () => {

  const [showModal, setShowModal] = useState(false);
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
          setUserInfo(response.data);
        } catch (error) {
          console.error("Error fetching user information:", error);
        }
      };
      fetchUserInfo();
    }
  }, []);

  return (
    <>
      <Navbar expand="lg" className="px-4 py-2" style={{ backgroundColor: "#F5A9A9" }}>
        <Container fluid>
          {/* Logo */}
          <Navbar.Brand href="#" className="fs-3 fw-bold">
            <img src="/logo.png" alt="Logo" width="40" height="40" className="d-inline-block align-top" />
          </Navbar.Brand>

          {/* Create button hiển thị luôn */}
          <Button variant="primary" className="me-3" onClick={() => setShowModal(true)}>
            Create +
          </Button>

          {/* Dropdown menu chỉ xuất hiện khi màn hình nhỏ */}
          <NavDropdown title="Menu" id="nav-dropdown" className="d-lg-none">
            <NavDropdown.Item href="#">Projects</NavDropdown.Item>
            <NavDropdown.Item href="#">Your work</NavDropdown.Item>
            <NavDropdown.Item href="#">Your team</NavDropdown.Item>
          </NavDropdown>

          {/* Menu hiển thị trên màn hình lớn */}
          <Nav className="d-none d-lg-flex gap-3">
            <Nav.Link href="#">Projects</Nav.Link>
            <Nav.Link href="#">Your work</Nav.Link>
            <Nav.Link href="#">Your team</Nav.Link>
          </Nav>

          {/* Đăng nhập / Đăng ký */}
          {
            userInfo ? (
              <>
                <Button><FaBell className="text-dark fs-4 cursor-pointer" /></Button>
                <Dropdown>
                  <Dropdown.Toggle variant="light" id="dropdown-basic">
                    <Image
                      src={userInfo?.profile?.avatar || "client/public/logo.png"}
                      alt="avatar"
                      className="rounded-circle"
                    />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Header>{userInfo.username}</Dropdown.Header>
                    <Dropdown.Divider />
                    <Dropdown.Item href="#"><FiUser /> Profile</Dropdown.Item>
                    <Dropdown.Item href="#"><FiKey /> Change password</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item href="#"><FiLogOut /> Log out</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <div className="ms-auto d-flex gap-2">
                <Button href="#" variant="outline-dark">Sign in</Button>
                <Button href="#" variant="dark">Register</Button>
              </div>
            )
          }
        </Container>
      </Navbar>
      {/* Modal Create Project */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="projectName">
              <Form.Label>Required fields are marked with an asterisk *</Form.Label>
              <br />
              <Form.Label>Project *</Form.Label>
              <Form.Control type="text" placeholder="Name" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button href="#" variant="dark" className="w-100">Create Project</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Header;
