import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";
import { useParams } from "react-router-dom";
import TaskDetail from "./TaskDetail.jsx";  // Import TaskDetail component

const ListTask = () => {
    const { projectId } = useParams();
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showModal, setShowModal] = useState(false); // State to control modal visibility

    useEffect(() => {
        fetchTasks();
    }, [projectId]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`http://localhost:9999/projects/${projectId}/tasks/get-all`);
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks", error);
        }
    };
    const handleTaskUpdate = (updatedTask) => {
        setTasks(prevTasks =>
            prevTasks.map(task => (task._id === updatedTask._id ? updatedTask : task))
        );
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setShowModal(true); // Open modal when a task is clicked
    };

    const handleCloseModal = () => {
        setShowModal(false); // Close modal
        setSelectedTask(null); // Clear selected task
    };

    return (
        <div>
            <h2>Task List</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Task Name</th>
                        <th>Assignee</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, index) => (
                        <tr key={task._id}>
                            <td>{index + 1}</td>
                            <td>{task.taskName}</td>
                            <td>{task.assignee?.name || "Unassigned"}</td>
                            <td>{task.status}</td>
                            <td>
                                <Button variant="info" onClick={() => handleTaskClick(task)}>View</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {selectedTask && (
                <TaskDetail
                    task={selectedTask}
                    showModal={showModal}
                    onClose={handleCloseModal}
                    onUpdateTask={handleTaskUpdate} // Thêm hàm cập nhật task
                />
            )}

        </div>
    );
};

export default ListTask;
