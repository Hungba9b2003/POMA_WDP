import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const ListProject = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

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
    axios
      .post("http://localhost:9999/projects/get-project", { id }
      )
      .then((res) => setProjects(res.data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, [id]);

  const filteredProjects = projects.filter((project) =>
    project.projectName.toLowerCase().includes(search.toLowerCase())
  );

  const handleWorkspace = (projectId) => {
    navigate(`/project/${projectId}/workspace`);
  };

  const handleChangeStatus = async (projectId) => {
    try {
      const response = await axios.put(`http://localhost:9999/projects/update-status/${projectId}`);
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === projectId
            ? { ...project, status: response.data.project.status }
            : project
        )
      );
      if (response.data) {
        alert("Cập nhật trạng thái thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Cập nhật trạng thái thất bại!");
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-3">Projects</h2>

      {/* Ô tìm kiếm */}
      <input
        type="text"
        placeholder="Search by project"
        className="form-control mb-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Avatar</th>
            <th>Project Name</th>
            <th>Project Code</th>
            <th>Premium</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <tr key={project._id}>
                <td onClick={() => handleWorkspace(project._id)}>
                  <img
                    src={project.projectAvatar || "default-avatar.png"}
                    alt="Avatar"
                    className="rounded-circle"
                    style={{ width: "40px", height: "40px" }}
                  />
                </td>
                <td onClick={() => handleWorkspace(project._id)}>{project.projectName}</td>
                <td>{project.projectCode}</td>
                <td>
                  {project.isPremium ? (
                    <span className="badge bg-warning">Premium</span>
                  ) : (
                    <span className="badge bg-secondary">Free</span>
                  )}
                </td>
                <td>
                  {project.members.find((member) => member._id === id)?.role === "owner" ? (
                    <button
                      onClick={() => handleChangeStatus(project._id)}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        border: "none",
                        outline: "none",
                        backgroundColor: project.status === "active" ? "green" : "red",
                        color: "white"
                      }}
                    >
                      {project.status}
                    </button>
                  ) : (
                    <span>
                      {project.status}
                    </span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No projects found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListProject;


