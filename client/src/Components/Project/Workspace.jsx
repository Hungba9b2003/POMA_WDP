import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Container, Row, Col, Button } from "react-bootstrap";
import Column from "./Column";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


const Workspace = () => {
    const [columns, setColumns] = useState(["Pending", "In Progress", "Completed"]);
    const [tasks, setTasks] = useState([]);
    const { projectId } = useParams();
    const [isPremium, setIsPremium] = useState(false);

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
        axios.get(`http://localhost:9999/projects/${projectId}/tasks/get-all`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => setTasks(response.data))
            .catch(error => console.error("Error fetching tasks:", error));

        axios.get(`http://localhost:9999/projects/${projectId}/get-project`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                if (response.data.project.classifications) {
                    setColumns(response.data.project.classifications);
                }
                if (response.data.project && response.data.project.isPremium !== undefined) {
                    setIsPremium(response.data.project.isPremium);
                } else {
                    console.warn("isPremium not found in response data");
                }
            })
            .catch(error => console.error("Error fetching project data:", error));
    }, [projectId, token, id]);




    // Thêm cột mới
    const addColumn = useCallback(async () => {
        if (!isPremium && columns.length >= 5) {
            alert("You have reached the maximum number of columns for a free account!");
            return;
        }

        const newColumn = prompt("Enter new column title:")?.trim();
        if (!newColumn) return;

        try {
            const response = await axios.put(`http://localhost:9999/projects/${projectId}/edit`, {
                newColumn,
                id
            });

            setColumns(response.data.classifications);
        } catch (error) {
            console.error("Error adding column:", error);
            alert("Failed to add column!");
        }
    }, [projectId, id, isPremium, columns]);

    return (
        <Container fluid className="workspace-container">
            <h2 className="mb-4">CRM Board</h2>

            <div className="board-wrapper">
                <Row className="flex-nowrap board-container">
                    {columns.map((col, index) => (
                        <Col key={index} md={3} className="column">
                            <Column
                                title={col}
                                tasks={tasks.filter(task => task.status === col)}
                                setTasks={setTasks}
                                projectId={projectId}
                                setColumns={setColumns}
                            />
                        </Col>
                    ))}
                    <Col md="auto">
                        <Button variant="light" onClick={addColumn} className="mt-4">+</Button>
                    </Col>
                </Row>
            </div>
        </Container>
    );

}


export default Workspace;
