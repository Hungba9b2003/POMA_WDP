import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Col, Row, Image } from "react-bootstrap";
import axios from "axios";
import { useParams } from "react-router-dom";

const TaskDetail = ({ task, showModal, onClose }) => {
    const [user, setUser] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState(task.comments || []);  // Use task.comments directly
    const [newSubTask, setNewSubTask] = useState("");
    const [subTasks, setSubTasks] = useState(task.subTasks || []);  // Use task.subTasks directly
    const { projectId } = useParams();  // L y project ID t i params

    useEffect(() => {
        if (task) {
            fetchUser();
            fetchComments();
            fetchSubTasks();
        }
    }, [task]);

    // Fetch user profile
    const fetchUser = async () => {
        const token = sessionStorage.getItem("authToken");
        try {
            const response = await axios.get("http://localhost:9999/users/get-profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user", error);
        }
    };

    // Add new comment
    const addComment = async () => {
        if (newComment) {
            try {
                await axios.post(`http://localhost:9999/projects/${projectId}/tasks/${task._id}/comments/create`, { content: newComment });
                setNewComment("");
                fetchComments(); // Re-fetch comments after adding
            } catch (error) {
                console.error("Error adding comment", error);
            }
        }
    };

    // Add new subtask
    const addSubTask = async () => {
        if (newSubTask) {
            try {
                await axios.post(`http://localhost:9999/projects/${projectId}/tasks/${task._id}/subTasks/create`, { subTaskName: newSubTask });
                setNewSubTask("");
                fetchSubTasks(); // Re-fetch subtasks after adding
            } catch (error) {
                console.error("Error adding subtask", error);
            }
        }
    };

    // Re-fetch comments
    const fetchComments = async () => {
        try {
            const response = await axios.get(`http://localhost:9999/projects/${projectId}/tasks/${task._id}/comments/get-all`);
            setComments(response.data || []);  // Ensure it's always an array
        } catch (error) {
            console.error("Error fetching comments", error);
            setComments([]);  // Fallback to empty array if an error occurs
        }
    };

    // Re-fetch subtasks
    const fetchSubTasks = async () => {
        try {
            const response = await axios.get(`http://localhost:9999/projects/${projectId}/tasks/${task._id}/subTasks/get-all`);
            setSubTasks(Array.isArray(response.data) ? response.data : []);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching subtasks", error);
            setSubTasks([]);  // Fallback to empty array if an error occurs
        }
    };

    return (
        <Modal show={showModal} onHide={onClose} size="xl">
            <Modal.Header closeButton>
                <Modal.Title style={{ fontWeight: "bold" }}>{task.taskName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Left Section: 7 part */}
                <div style={{ width: "70%" }}>
                    <p>Description:</p>
                    <Form.Control
                        as="textarea"
                        value={task.description}
                        onChange={(e) => (task.description = e.target.value)}
                        rows={3}
                        placeholder="Edit description"
                    />
                    <Button variant="success" className="mt-2">Update Description</Button>

                    {/* Subtask Section */}
                    <div>
                        <h5>Subtasks</h5>

                        <Row className="align-items-center" style={{ marginBottom: "10px" }}>
                            <Col xs={8} className="d-flex">
                                <Form.Control
                                    type="text"
                                    value={newSubTask}
                                    onChange={(e) => setNewSubTask(e.target.value)}
                                    placeholder="Add new subtask"
                                    style={{ height: '38px', marginBottom: 0 }} // Xóa margin dưới của Form.Control
                                />
                            </Col>
                            <Col xs={4} className="d-flex">
                                <Button
                                    variant="primary"
                                    onClick={addSubTask}
                                    className="w-100"
                                    style={{ height: '38px', marginTop: 0 }} // Xóa margin trên của Button
                                >
                                    Add Subtask
                                </Button>
                            </Col>
                        </Row>

                        <div style={{ overflowY: "auto", maxHeight: "300px", border: "1px solid black", borderRadius: "10px" }}>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {subTasks && subTasks.length > 0 ? (
                                    subTasks.map((subtask) => (
                                        <li key={subtask._id} style={{ borderBottom: "1px solid black" }}>
                                            <Row className="align-items-center" style={{ padding: "10px" }}>
                                                {/* SubTask Number */}
                                                <Col xs={1}>
                                                    <h6>{subtask.subTaskNumber}</h6>
                                                </Col>
                                                {/* SubTask Name */}
                                                <Col xs={7}>
                                                    <h6>{subtask.subTaskName}</h6>
                                                </Col>
                                                {/* Priority */}
                                                <Col xs={1}>
                                                    <div>
                                                        {subtask.priority === "High" && (
                                                            <span style={{ color: 'red', transform: 'rotate(90deg)', display: 'inline-block' }}>|||</span> // Xoay ba dấu gạch ngang
                                                        )}
                                                        {subtask.priority === "Medium" && (
                                                            <span style={{ color: 'yellow', transform: 'rotate(90deg)', display: 'inline-block' }}>||</span> // Xoay hai dấu gạch ngang
                                                        )}
                                                        {subtask.priority === "Low" && (
                                                            <span style={{ color: 'green', transform: 'rotate(90deg)', display: 'inline-block' }}>|</span> // Xoay một dấu gạch ngang
                                                        )}
                                                    </div>

                                                </Col>
                                                <Col xs={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Image
                                                        src="https://via.placeholder.com/10" // Thay thế bằng ảnh avatar của assignee khi có
                                                        roundedCircle
                                                        alt="Assignee Avatar"
                                                        style={{
                                                            border: "1px solid #ccc",
                                                            width: '30px',  // Đặt kích thước ảnh nhỏ
                                                            height: '30px', // Đặt kích thước ảnh nhỏ
                                                            objectFit: 'contain' // Đảm bảo ảnh không bị vỡ hoặc cắt
                                                        }}
                                                    />
                                                </Col>

                                                <Col xs={2}>
                                                    <p style={{
                                                        fontSize: "0.8rem",
                                                        fontWeight: "bold",
                                                        color: subtask.status === "Pending" ? "black" :
                                                            subtask.status === "In Progress" ? "blue" :
                                                                "green"
                                                    }}>{subtask.status}</p>
                                                </Col>
                                            </Row>
                                        </li>
                                    ))
                                ) : (
                                    <p style={{ padding: "10px" }}>No subtasks available</p>
                                )}
                            </ul>
                        </div>
                    </div>

                    <hr />

                    {/* Activity Section */}
                    <h5>Activity</h5>
                    {user && (
                        <div>
                            <img src={user.avatar} alt="avatar" width="50" />
                            <Form.Control
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add comment"
                            />
                            <Button variant="success" onClick={addComment} className="mt-2">Save</Button>
                            <Button variant="secondary" onClick={() => setNewComment("")} className="mt-2 ml-2">Cancel</Button>
                        </div>
                    )}

                    {/* Comments Section */}
                    <h5>Comments</h5>
                    <ul>
                        {comments.map((c, index) => (
                            <li key={index}>{c.content}</li>
                        ))}
                    </ul>
                </div>

                {/* Right Section: 3 part (tạm thời để trống) */}
                <div style={{ width: "30%" }}>
                    {/* You can add right section content later */}
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default TaskDetail;
