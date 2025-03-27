import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Col, Dropdown, Row } from "react-bootstrap";
import { AiOutlineMenu } from "react-icons/ai";
import { AppContext } from "../../Context/AppContext";

const ProjectStored = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { API } = useContext(AppContext);
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
    axios

      .post(
        `${API}/projects/get-project`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      .then((res) => {
        const allProjects = res.data;
        setProjects(
          allProjects.filter((project) => project.status === "inactive")
        );
      })
      .catch((err) => console.error("Error fetching projects:", err));
  }, [id]);

  const filteredProjects = projects.filter((project) =>
    project.projectName.toLowerCase().includes(search.toLowerCase())
  );

  const handleChangeStatus = async (projectId) => {
    try {
      const response = await axios.put(
        `${API}/projects/update-status/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === projectId
            ? { ...project, status: response.data.project.status }
            : project
        )
      );
      if (response.data) {
        alert("Cập nhật trạng thái thành công!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Cập nhật trạng thái thất bại!");
    }
  };

  return (
    <div className="p-4">
      <Row className="d-flex justify-content-between align-items-center">
        <Col>
          <h2 className="mb-3">Projects Stored</h2>
        </Col>
        <Col className="text-end">
          <Dropdown>
            <Dropdown.Toggle variant="light" id="dropdown-menu">
              <AiOutlineMenu size={30} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => console.log("Join by Code Clicked")}
              >
                Join by Code
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/listProject")}>
                List Project
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      {/* Ô tìm kiếm */}
      <input
        type="text"
        placeholder="Search by project"
        className="form-control mb-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="row">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div className="col-md-3 mb-3" key={project._id}>
              <div className="card shadow-sm">
                <img
                  src={project.projectAvatar || "default-avatar.png"}
                  alt="Avatar"
                  className="card-img-top"
                  style={{ height: "90px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {project.projectName} {project.isPremium ? "💎" : ""}
                  </h5>
                  <p className="card-text">
                    Project Code: {project.projectCode}
                  </p>
                  <span
                    className={`badge ${
                      project.isPremium ? "bg-warning" : "bg-secondary"
                    }`}
                  >
                    {project.isPremium ? "Premium" : "Free"}
                  </span>
                  <button
                    className={`btn ${
                      project.status === "active" ? "btn-danger" : "btn-success"
                    } w-100 mt-2`}
                    onClick={() => handleChangeStatus(project._id)}
                  >
                    {project.status === "active" ? "Inactivate" : "Activate"}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center w-100">No projects found</div>
        )}
      </div>
    </div>
  );
};

export default ProjectStored;
