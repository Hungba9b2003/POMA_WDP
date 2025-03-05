import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import Column from "./Column";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Workspace = () => {
    const [tasks, setTasks] = useState([]);
    const { projectId } = useParams();

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
        axios.get(`http://localhost:9999/projects/${projectId}/tasks/get-all`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then(response => setTasks(response.data))
            .catch(error => console.error("Error fetching tasks:", error));
    }, [projectId]);

    return (
        <Container fluid>
            <h2 className="mb-4">CRM Board</h2>
            <Row>
                <Col md={4}><Column title="To Do" tasks={tasks.filter(task => task.status === "Pending")} /></Col>
                <Col md={4}><Column title="In Progress" tasks={tasks.filter(task => task.status === "In Progress")} /></Col>
                <Col md={4}><Column title="Done" tasks={tasks.filter(task => task.status === "Completed")} /></Col>
            </Row>
        </Container>
    );
};

export default Workspace;
