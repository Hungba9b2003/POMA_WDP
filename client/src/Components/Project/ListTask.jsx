import React, { useState, useEffect } from "react";
import { Table, Button, Image, Container, Form } from "react-bootstrap";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaRegCalendarAlt } from "react-icons/fa";
import { TbHandFinger } from "react-icons/tb";
import TaskDetail from "./TaskDetail.jsx";
import { jwtDecode } from "jwt-decode";

const ListTask = () => {
    const { projectId } = useParams();
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]); // State để lưu task sau khi lọc
    const [searchQuery, setSearchQuery] = useState(""); // State cho ô tìm kiếm
    const [selectedTask, setSelectedTask] = useState(null);
    const [showModal, setShowModal] = useState(false);
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
        fetchTasks();
        fetchProject();
    }, [projectId]);

    useEffect(() => {
        // Lọc task theo tên khi searchQuery thay đổi
        const filtered = tasks.filter((task) =>
            task.taskName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredTasks(filtered);
    }, [searchQuery, tasks]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`http://localhost:9999/projects/${projectId}/tasks/get-all`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(response.data);
            setFilteredTasks(response.data); // Khởi tạo danh sách lọc ban đầu
        } catch (error) {
            console.error("Error fetching tasks", error);
        }
    };

    const fetchProject = async () => {
        try {
            const response = await axios.get(`http://localhost:9999/projects/${projectId}/get-project`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.project && response.data.project.isPremium !== undefined) {
                setIsPremium(response.data.project.isPremium);
            } else {
                console.warn("isPremium not found in response data");
            }
        } catch (error) {
            console.error("Error fetching project:", error);
        }
    };

    const handleTaskUpdate = (updatedTask) => {
        setTasks((prevTasks) => prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTask(null);
    };

    return (
        <Container
            style={{
                backgroundColor: "#ffe6e6", // Nền hồng nhạt
                padding: "20px",
                borderRadius: "10px",
                maxWidth: "100%",
                overflowX: "auto",
                overflowY: "auto",
                maxHeight: "600px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                margin: "20px 10px",
            }}
        >
            <h2 style={{ fontWeight: "bold" }}>Task List</h2>

            {/* Thanh tìm kiếm */}
            <Form.Control
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                    marginBottom: "15px",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    width: "100%",
                    maxWidth: "400px",
                }}
            />

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Task Name</th>
                        <th>@ Assignee</th>
                        <th>@ Reviewer</th>
                        <th><FaRegCalendarAlt />Created At</th>
                        <th><FaRegCalendarAlt />Updated At</th>
                        <th>Status</th>
                        <th><TbHandFinger /> Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTasks.map((task, index) => (
                        <tr key={task._id}>
                            <td>{index + 1}</td>
                            <td>{task.taskName}</td>
                            <td>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <Image
                                        src={task.assignee?.profile?.avatar || "https://via.placeholder.com/30"}
                                        roundedCircle
                                        width={30}
                                        height={30}
                                    />
                                    <span>{task.assignee?.username || "Unassigned"}</span>
                                </div>
                            </td>
                            <td>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <Image
                                        src={task.reviewer?.profile?.avatar || "https://via.placeholder.com/30"}
                                        roundedCircle
                                        width={30}
                                        height={30}
                                    />
                                    <span>{task.reviewer?.username || "Unknown"}</span>
                                </div>
                            </td>
                            <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                            <td>{new Date(task.updatedAt).toLocaleDateString()}</td>
                            <td
                                style={{ fontWeight: "bold", color: task.status === "Pending" ? "black" : task.status === "In Progress" ? "blue" : "green", }}
                            >
                                {task.status}
                            </td>
                            <td>
                                <Button variant="info" onClick={() => handleTaskClick(task)}>
                                    View
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {selectedTask && (
                <TaskDetail task={selectedTask} showModal={showModal} onClose={handleCloseModal} onUpdateTask={handleTaskUpdate} isPremium={isPremium} />
            )}
        </Container>
    );
};

export default ListTask;
