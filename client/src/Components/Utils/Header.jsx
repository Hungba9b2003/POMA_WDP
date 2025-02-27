import { Navbar, Nav, Button, Dropdown, Image, Container, NavDropdown } from "react-bootstrap";
import { FaBell } from "react-icons/fa";
import { FiLogOut, FiUser, FiKey } from "react-icons/fi";

const Header = () => {

  

  return (
    <Navbar expand="lg" className="px-4 py-2" style={{ backgroundColor: "#F5A9A9" }}>
      <Container fluid>
        {/* Logo */}
        <Navbar.Brand href="#" className="fs-3 fw-bold">
          <img src="/logo.png" alt="Logo" width="40" height="40" className="d-inline-block align-top" />
        </Navbar.Brand>

        {/* Create button hiển thị luôn */}
        <Button variant="primary" className="me-3">Create +</Button>

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
        <div className="ms-auto d-flex gap-2">
          <Button variant="outline-dark">Sign in</Button>
          <Button variant="dark">Register</Button>
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;
