import React, { useState, useContext, useEffect } from "react";
import { Table, Button, Container, Form, Badge } from "react-bootstrap";
import axios from "axios";
import { MdVisibility } from "react-icons/md";
import { AppContext } from "../../Context/AppContext";
const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [premiumCount, setPremiumCount] = useState(0);
  const { API } = useContext(AppContext);
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const filtered = projects.filter((project) =>
      project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [searchQuery, projects]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API}/admins/getAllProjectList`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data.projects);
      setProjects(response.data.projects);
      setFilteredProjects(response.data.projects);
      setPremiumCount(response.data.projects.filter((p) => p.isPremium).length);
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  };

  const handleViewDetail = (projectId) => {
    window.location.href = `/admin/viewDetailProject/${projectId}`;
  };

  return (
    <Container style={{ padding: "20px", maxWidth: "100%", overflowX: "auto" }}>
      <h2 className="text-center">Project List</h2>
      <div className="d-flex justify-content-between mb-3">
        <div>
          <Badge bg="primary" className="me-2">
            Total Projects: {projects.length}
          </Badge>
          <Badge bg="success">Premium Projects: {premiumCount}</Badge>
        </div>
        <Form.Control
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ maxWidth: "400px" }}
        />
      </div>
      <Table striped bordered hover responsive className="text-center">
        <thead>
          <tr>
            <th>#</th>
            <th>Project Name</th>
            <th>Owner</th>
            <th>Premium</th>
            {/* <th>Action</th> */}
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((project, index) => (
            <tr key={project._id}>
              <td>{index + 1}</td>
              <td>{project.projectName}</td>
              <td>{project.members[0]._id.username}</td>
              <td>
                {project.isPremium ? (
                  <Badge bg="warning">Premium</Badge>
                ) : (
                  <Badge bg="secondary">Free</Badge>
                )}
              </td>
              {/* <td>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => handleViewDetail(project._id)}
                >
                  <MdVisibility /> View
                </Button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ProjectList;
