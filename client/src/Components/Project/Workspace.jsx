import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Container, Row, Col, Button } from "react-bootstrap";
import Column from "./Column";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


const Workspace = () => {
    const { projectId } = useParams();
    const [columns, setColumns] = useState(["Pending", "In Progress", "Completed"]);
    const [tasks, setTasks] = useState([]);

    // Lấy token và decode ID
    const getUserIdFromToken = () => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) return null;
        try {
            return jwtDecode(token)?.id || null;
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    };

    const userId = getUserIdFromToken();

    // Hàm lấy dữ liệu dự án và tasks
    const fetchProjectData = useCallback(async () => {
        try {
            const [tasksRes, projectRes] = await Promise.all([
                axios.get(`http://localhost:9999/projects/${projectId}/tasks/get-all`),
                axios.get(`http://localhost:9999/projects/${projectId}/get-project`)
            ]);

            setTasks(tasksRes.data);
            if (projectRes.data.project?.classifications) {
                setColumns(projectRes.data.project.classifications);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [projectId]);

    useEffect(() => {
        fetchProjectData();
    }, [fetchProjectData]);

    // Thêm cột mới
    const addColumn = useCallback(async () => {
        const newColumn = prompt("Enter new column title:")?.trim();
        if (!newColumn) return;

        try {
            const response = await axios.put(`http://localhost:9999/projects/${projectId}/edit`, {
                newColumn,
                id: userId
            });

            setColumns(response.data.classifications);
        } catch (error) {
            console.error("Error adding column:", error);
            alert("Failed to add column!");
        }
    }, [projectId, userId]);

    return (
        <Container fluid>
            <h2 className="mb-4">CRM Board</h2>
            <div className="board-container">
                <Row className="flex-nowrap">
                    {columns.map((col, index) => (
                        <Col key={index} md={3} className="column">
                            <Column
                                title={col}
                                tasks={tasks.filter(task => task.status === col)}
                                setTasks={setTasks}
                                projectId={projectId}
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
};

export default Workspace;
