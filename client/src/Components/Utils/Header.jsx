import { Navbar, Nav, Button, Dropdown, Image, Container, NavDropdown, Modal, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { FiLogOut, FiUser, FiKey } from "react-icons/fi";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [projectName, setProjectName] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");


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
    if (token && id && !userInfo) {
      axios.post("http://localhost:9999/users/get-profile", { id }) 
        .then(response => setUserInfo(response.data))
        .catch(error => console.error("Error fetching user information:", error));
    }
  }, [token, id, userInfo]);
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUserInfo(null);
    window.location.href = "/login/loginForm";
  };

  const handleCreate = async () => {
    if (!projectName.trim()) {
      alert("Project name is required!");
      return;
    }

    try {

      const createResponse = await axios.post(
        "http://localhost:9999/projects/create",
        { projectName , id},
      );

      if (createResponse.data) {
        setProjectName("");
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 2000);
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error: ", error);
      alert(error.response?.data?.message || "Error creating project!");
    }
  };



  return (
    <>
      <Navbar expand="lg" className="px-4 py-2" style={{ background: 'linear-gradient(to right,rgb(248, 218, 219),rgb(248, 159, 175))' }}>
        <Container fluid>
          {/* Logo */}
          <Navbar.Brand href="/" className="fs-3 fw-bold">
            <img src="/logo.png" alt="Logo" width="40" height="40" className="d-inline-block align-top" />
          </Navbar.Brand>

          {/* Create button */}
          <Button variant="primary" className="me-3" onClick={() => setShowModal(true)}>
            Create +
          </Button>

          {/* Dropdown menu cho màn hình nhỏ */}
          <NavDropdown title="Menu" id="nav-dropdown" className="d-lg-none">
            <NavDropdown.Item href="/listProject">Projects</NavDropdown.Item>
            <NavDropdown.Item href="#">Your work</NavDropdown.Item>
            <NavDropdown.Item href="#">Your team</NavDropdown.Item>
          </NavDropdown>

          {/* Menu cho màn hình lớn */}
          <Nav className="d-none d-lg-flex gap-3">
            <Nav.Link href="/listProject">Projects</Nav.Link>
            <Nav.Link href="#">Your work</Nav.Link>
            <Nav.Link href="#">Your team</Nav.Link>
          </Nav>

          {showSuccessAlert && (
            <div
              style={{
                position: "fixed",
                top: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "15px 30px",
                borderRadius: "5px",
                zIndex: 1000,
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                animation: "slideDown 0.5s ease-out",
              }}
            >
              Create Project Successful!
            </div>
          )}

          {/* Đăng nhập / Đăng ký */}
          {userInfo ? (
            <div className="ms-auto d-flex gap-2">
              <Button variant="light">
                <FaBell className="text-dark fs-4" />
              </Button>
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
                <Dropdown.Menu >
                  <Dropdown.Header>{userInfo.username}</Dropdown.Header>
                  <Dropdown.Divider />
                  <Dropdown.Item href="/view-profile"><FiUser /> Profile</Dropdown.Item>
                  <Dropdown.Item href="/change-password"><FiKey /> Change password</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}><FiLogOut /> Log out</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ) : (
            <div className="ms-auto d-flex gap-2">
              <Button href="/login/loginForm" variant="outline-dark">Sign in</Button>
              <Button href="/login/registerForm" variant="dark">Register</Button>
            </div>
          )}
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
              <Form.Label>Required fields are marked with an asterisk *</Form.Label>
              <br />
              <Form.Label>Project *</Form.Label>
              <Form.Control type="text" placeholder="Name" onChange={(e) => setProjectName(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" className="w-100" onClick={handleCreate}>Create Project</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Header;
