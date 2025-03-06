import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import Column from "./Column";
import { useParams } from "react-router-dom";


const Workspace = () => {
    const [tasks, setTasks] = useState([]);
    const { projectId } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:9999/projects/${projectId}/tasks/get-all`)
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
