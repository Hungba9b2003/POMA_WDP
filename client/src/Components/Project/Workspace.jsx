import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Button } from "react-bootstrap";
import Column from "./Column";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Workspace = () => {
    const [columns, setColumns] = useState(["Pending", "In Progress", "Completed"]);
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

        axios.get(`http://localhost:9999/projects/${projectId}`)
            .then(response => {
                if (response.data.classifications) {
                    setColumns(response.data.classifications);
                }
            })
            .catch(error => console.error("Error fetching project data:", error));
    }, [projectId]);

    const addColumn = () => {
        const newColumn = prompt("Enter new column title:");
        if (!newColumn) return;

        axios.post(`http://localhost:9999/projects/${projectId}/add-column`, { title: newColumn })
            .then(response => {
                setColumns(response.data.project.classifications);
            })
            .catch(error => {
                console.error("Error adding column:", error);
                alert("Failed to add column!");
            });
    };

    return (
        <Container fluid>
            <h2 className="mb-4">CRM Board</h2>
            <Row>
                {columns.map((col, index) => (
                    <Col key={index} md={3}>
                        <Column title={col} tasks={tasks.filter(task => task.status === col)} setTasks={setTasks} projectId={projectId} />
                    </Col>
                ))}
                <Col md={1}>
                    <Button variant="light" onClick={addColumn} className="mt-4">+</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default Workspace;
