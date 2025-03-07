import React, { useState, useCallback } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import TaskCard from "./TaskCard";
import CreateTask from "./CreateTask";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Column = ({ title, tasks, setTasks, projectId, setColumns }) => {
    const [showModal, setShowModal] = useState(false);

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

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleDeleteColumn = useCallback(async () => {
        if (!window.confirm(`Are you sure you want to delete column "${title}"?`)) return;
    
        try {
            const response = await axios.put(`http://localhost:9999/projects/${projectId}/edit`, {
                id,
                removeColumn: title 
            });
    
            if (response.data.classifications) {
                setColumns(response.data.classifications); 
            }
        } catch (error) {
            console.error("Error deleting column:", error);
            alert("Failed to delete column!");
        }
    }, [title, projectId, id, setColumns]);
    

    return (
        <Card className="p-3">
            <Row>
                <Col><h5>{title}</h5></Col>
                <Col className="text-end">
                    <RiDeleteBin6Line 
                        onClick={handleDeleteColumn} 
                        style={{ cursor: "pointer", color: "red" }} 
                    />
                </Col>
            </Row>           
            
            {tasks.map((task) => (
                <TaskCard key={task._id} task={task} />
            ))}

            <Button variant="outline-primary" className="mt-2" onClick={handleOpenModal}>
                + Create Task
            </Button>

            <CreateTask 
                show={showModal} 
                handleClose={handleCloseModal} 
                projectId={projectId} 
                setTasks={setTasks} 
            />
        </Card>
    );
};

export default Column;
