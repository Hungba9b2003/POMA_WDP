import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Col, Row, Image, ProgressBar, OverlayTrigger, Tooltip } from "react-bootstrap";
import axios from "axios";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const TaskDetail = ({ task, showModal, onClose, onUpdateTask }) => {
    const [user, setUser] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState(task.comments || []);  // Use task.comments directly
    const [newSubTask, setNewSubTask] = useState("");
    const [subTasks, setSubTasks] = useState(task.subTasks || []);  // Use task.subTasks directly
    const [editingSubTaskId, setEditingSubTaskId] = useState(null); // ID của subtask đang sửa
    const [subTaskName, setSubTaskName] = useState("");
    const [taskDescription, setTaskDescription] = useState(task.description || "");
    const { projectId } = useParams();  // Get project ID from params

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
        if (task) {
            fetchUser();
            fetchComments();
            fetchSubTasks();
        }
    }, [task]);

    console.log(user);
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
                await axios.post(`http://localhost:9999/projects/${projectId}/tasks/${task._id}/comments/create`, { content: newComment },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
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
                await axios.post(`http://localhost:9999/projects/${projectId}/tasks/${task._id}/subTasks/create`, { subTaskName: newSubTask },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
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
            const response = await axios.get(`http://localhost:9999/projects/${projectId}/tasks/${task._id}/comments/get-all`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setComments(response.data || []);  // Ensure it's always an array
        } catch (error) {
            console.error("Error fetching comments", error);
            setComments([]);  // Fallback to empty array if an error occurs
        }
    };

    // Re-fetch subtasks
    const fetchSubTasks = async () => {
        try {
            const response = await axios.get(`http://localhost:9999/projects/${projectId}/tasks/${task._id}/subTasks/get-all`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSubTasks(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching subtasks", error);
            setSubTasks([]);  // Fallback to empty array if an error occurs
        }
    };

    const handleUpdateDescription = async () => {
        try {
            const { data } = await axios.put(
                `http://localhost:9999/projects/${projectId}/tasks/${task._id}/edit`,
                { description: taskDescription },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            onUpdateTask(data); // Gọi hàm cập nhật task trong ListTask
        } catch (error) {
            console.error("Error updating description", error);
        }
    };

    const handleEditSubTaskName = (subTask) => {
        setEditingSubTaskId(subTask._id);
        setSubTaskName(subTask.subTaskName); // Đặt tên subtask vào input
    };

    const handleSaveSubTaskName = async (subTask) => {
        if (!subTaskName.trim()) {
            alert("Subtask name cannot be empty!");
            return;
        }

        try {
            await axios.put(
                `http://localhost:9999/projects/${projectId}/tasks/${task._id}/subTasks/${subTask._id}/edit`,
                { subTaskName }, // Chỉ gửi subTaskName để cập nhật
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const updatedSubTasks = subTasks.map(st =>
                st._id === subTask._id ? { ...st, subTaskName } : st
            );
            setSubTasks(updatedSubTasks);
        } catch (error) {
            console.error("Error updating subtask name:", error);
        }

        setEditingSubTaskId(null);
    };

    const handleCancelSubTaskName = () => {
        setEditingSubTaskId(null);
        setSubTaskName(""); // Reset input
    };

    const handleUpdateSubTask = async (subTask, updates) => {
        try {
            if (!projectId || !task?._id || !subTask?._id) {
                console.error("Missing projectId, taskId, or subTaskId");
                return;
            }

            const updateData = {};
            if (updates.status) updateData.status = updates.status;
            if (updates.priority) updateData.priority = updates.priority;

            if (Object.keys(updateData).length === 0) {
                console.error("No valid fields to update");
                return;
            }

            await axios.put(
                `http://localhost:9999/projects/${projectId}/tasks/${task._id}/subTasks/${subTask._id}/edit`,
                updateData, // Chỉ gửi những giá trị cần cập nhật
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            fetchSubTasks(); // Cập nhật lại danh sách subtask sau khi sửa
        } catch (error) {
            console.error("Error updating subtask", error.response?.data || error);
        }
    };


    const handleDeleteSubTask = async (subTask) => {
        try {
            await axios.delete(`http://localhost:9999/projects/${projectId}/tasks/${task._id}/subTasks/${subTask._id}/delete`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            fetchSubTasks(); // Re-fetch subtasks after deletion
        } catch (error) {
            console.error("Error deleting subtask", error);
        }
    };

    const getSubtaskProgress = () => {
        if (subTasks.length === 0) return { completed: 0, inProgress: 0, pending: 0 };

        const total = subTasks.length;
        const completed = (subTasks.filter(sub => sub.status === "Completed").length / total) * 100;
        const inProgress = (subTasks.filter(sub => sub.status === "In Progress").length / total) * 100;
        const pending = (subTasks.filter(sub => sub.status === "Pending").length / total) * 100;

        return { completed, inProgress, pending };
    };

    const { completed, inProgress, pending } = getSubtaskProgress();

    const renderTooltip = (status, completed, total) => {
        switch (status) {
            case "completed":
                return (
                    <Tooltip id="progress-tooltip">
                        <div style={{ fontSize: "12px" }}>
                            Completed: {completed} of {total} issues
                        </div>
                    </Tooltip>
                );
            case "inProgress":
                return (
                    <Tooltip id="progress-tooltip">
                        <div style={{ fontSize: "12px" }}>
                            In Progress: {completed} of {total} issues
                        </div>
                    </Tooltip>
                );
            case "pending":
                return (
                    <Tooltip id="progress-tooltip">
                        <div style={{ fontSize: "12px" }}>
                            Pending: {completed} of {total} issues
                        </div>
                    </Tooltip>
                );
            default:
                return null;
        }
    };

    useEffect(() => {
        setTaskDescription(task.description || "");
    }, [task]);


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
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        rows={3}
                        placeholder="Edit description"
                    />
                    <Button variant="primary" className="mt-2 float-right" onClick={handleUpdateDescription}>
                        Save Description
                    </Button>

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
                                    style={{ height: '38px', marginBottom: 0 }} // Remove bottom margin
                                />
                            </Col>
                            <Col xs={4} className="d-flex">
                                <Button
                                    variant="primary"
                                    onClick={addSubTask}
                                    className="w-100"
                                    style={{ height: '38px', marginTop: 0 }} // Remove top margin
                                >
                                    Add Subtask
                                </Button>
                            </Col>
                        </Row>

                        <Row className="align-items-center" style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
                            <Col md={10} style={{ alignItems: "center", justifyContent: "center", marginTop: "11px" }} >
                                <div style={{ marginBottom: "10px" }}>
                                    <div style={{ display: "flex", height: "10px", borderRadius: "5px", overflow: "hidden", border: "1px solid #ccc", width: "100%" }}>

                                        {/* Thanh tiến độ - Completed */}
                                        <OverlayTrigger
                                            placement="bottom"
                                            overlay={renderTooltip("completed", 1, 3)} // Giả sử 1 vấn đề hoàn thành trong tổng 3
                                        >
                                            <div
                                                style={{
                                                    width: `${completed}%`,
                                                    backgroundColor: "green",
                                                    transition: "width 0.5s ease",
                                                }}
                                            ></div>
                                        </OverlayTrigger>

                                        {/* Thanh tiến độ - In Progress */}
                                        <OverlayTrigger
                                            placement="bottom"
                                            overlay={renderTooltip("inProgress", 2, 3)} // Giả sử 2 vấn đề đang trong tiến trình
                                        >
                                            <div
                                                style={{
                                                    width: `${inProgress}%`,
                                                    backgroundColor: "blue",
                                                    transition: "width 0.5s ease",
                                                }}
                                            ></div>
                                        </OverlayTrigger>

                                        {/* Thanh tiến độ - Pending */}
                                        <OverlayTrigger
                                            placement="bottom"
                                            overlay={renderTooltip("pending", 0, 3)} // Giả sử 0 vấn đề đang chờ
                                        >
                                            <div
                                                style={{
                                                    width: `${pending}%`,
                                                    backgroundColor: "gray",
                                                    transition: "width 0.5s ease",
                                                }}
                                            ></div>
                                        </OverlayTrigger>
                                    </div>
                                </div>
                            </Col>
                            <Col md={2} style={{ display: "flex", alignItems: "center" }}>
                                <span
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        color: "green",
                                        textAlign: "start",
                                        margin: "0",
                                    }}
                                >
                                    Completed: {Math.round(completed)}%
                                </span>
                            </Col>
                        </Row>

                        <div style={{ overflowY: "auto", maxHeight: "300px", border: "1px solid black", borderRadius: "10px" }}>

                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {subTasks && subTasks.length > 0 ? (
                                    subTasks.map((subtask) => (
                                        <li key={subtask._id} style={{ borderBottom: "1px solid black" }}>
                                            <Row className="align-items-center" style={{ padding: "10px" }}>
                                                {/* SubTask Name */}
                                                <Col xs={1}>
                                                    <h>{subtask.subTaskNumber}</h>
                                                </Col>
                                                <Col xs={7}>
                                                    {editingSubTaskId === subtask._id ? (
                                                        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                                                            <input
                                                                type="text"
                                                                value={subTaskName}
                                                                onChange={(e) => setSubTaskName(e.target.value)}
                                                                style={{
                                                                    margin: 0,

                                                                }}
                                                            />
                                                            <button style={{ backgroundColor: "blue", color: "white", border: "none", borderRadius: "5px", padding: "5px" }} onClick={() => handleSaveSubTaskName(subtask)}>✔</button>
                                                            <button style={{ backgroundColor: "gray", border: "none", borderRadius: "5px", padding: "5px" }} onClick={handleCancelSubTaskName}>✖</button>
                                                        </div>
                                                    ) : (
                                                        <h6 onClick={() => handleEditSubTaskName(subtask)}>{subtask.subTaskName}</h6>
                                                    )}
                                                </Col>


                                                {/* Priority */}
                                                <Col xs={1}>
                                                    <Form.Control
                                                        as="select"
                                                        value={subtask.priority}
                                                        onChange={(e) => handleUpdateSubTask(subtask, { priority: e.target.value })}
                                                        style={{
                                                            border: 'none',
                                                            color: subtask.priority === 'Low' ? 'green' : subtask.priority === 'Medium' ? 'yellow' : 'red',
                                                        }}
                                                    >
                                                        <option value="Low" style={{ writingMode: 'vertical-lr', transform: 'rotate(0deg)', color: 'green' }}> | </option>
                                                        <option value="Medium" style={{ writingMode: 'vertical-lr', transform: 'rotate(0deg)', color: 'yellow' }}> || </option>
                                                        <option value="High" style={{ writingMode: 'vertical-lr', transform: 'rotate(0deg)', color: 'red' }}> ||| </option>
                                                    </Form.Control>
                                                </Col>

                                                {/* Status */}
                                                <Col xs={2}>
                                                    <Form.Control
                                                        as="select"
                                                        value={subtask.status}
                                                        onChange={(e) => handleUpdateSubTask(subtask, { status: e.target.value })}
                                                        style={{
                                                            border: 'none',
                                                            color: subtask.status === 'Pending' ? 'black' : subtask.status === 'In Progress' ? 'blue' : 'green',
                                                        }}
                                                    >
                                                        <option value="Pending" style={{ color: 'black' }}>Pending</option>
                                                        <option value="In Progress" style={{ color: 'blue' }}>Progress</option>
                                                        <option value="Completed" style={{ color: 'green' }}>Completed</option>
                                                    </Form.Control>
                                                </Col>

                                                {/* Action buttons */}
                                                <Col xs={1}>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => handleDeleteSubTask(subtask)}
                                                    >
                                                        X
                                                    </Button>
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

                        <Row>
                            <Col md={1} style={{ display: "flex", alignItems: "center" }}>
                                <img src={user.avatar} alt="avatar" width="50" />
                            </Col>
                            <Col md={11} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <Form.Control
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add comment"
                                    style={{
                                        margin: 0,          // Loại bỏ margin mặc định
                                        padding: "8px",     // Thiết lập padding đồng đều cho input
                                        height: "38px",     // Đảm bảo input có chiều cao cố định
                                    }}
                                />
                                <Button variant="success" onClick={addComment} style={{ margin: "none", height: "38px" }}>Save</Button>
                                <Button variant="secondary" onClick={() => setNewComment("")} style={{ margin: "none", height: "38px" }}>Cancel</Button>
                            </Col>
                            <h>đây là user id: {user._id}</h>
                        </Row>

                    )}

                    {/* Comments Section */}
                    <h5>Comments</h5>
                    <div style={{ maxHeight: "300px", overflowY: "auto" }}> {/* Đặt max-height và cho phép cuộn */}
                        <ul style={{ listStyleType: "none", padding: 0 }}>
                            {comments.slice().reverse().map((c, index) => (
                                <li key={index} style={{ marginBottom: "10px" }}>
                                    <Row className="align-items-center" style={{ marginBottom: "10px" }}>
                                        {/* Avatar */}
                                        <Col xs="auto">
                                            <img
                                                src={c.avatar || "default-avatar-url"} // Thay bằng URL ảnh đại diện của bạn
                                                alt="Avatar"
                                                style={{
                                                    width: "40px",  // Kích thước ảnh đại diện
                                                    height: "40px",
                                                    borderRadius: "50%", // Làm cho ảnh tròn
                                                }}
                                            />
                                        </Col>

                                        {/* Comment Content */}
                                        <Col>
                                            <div style={{
                                                backgroundColor: "#f0f0f0", // Màu nền comment
                                                padding: "10px",  // Khoảng cách trong comment
                                                borderRadius: "10px",  // Viền bo tròn
                                                maxWidth: "500px",  // Giới hạn chiều rộng
                                                wordWrap: "break-word",  // Ngắt chữ khi quá dài
                                                display: "flex",

                                            }}>
                                                <p>{c.content}</p>
                                            </div>
                                        </Col>
                                    </Row>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* Right Section (can be filled with additional content later) */}
                <div style={{ width: "30%" }}>
                    {/* You can add right section content later */}
                </div>
            </Modal.Body>
        </Modal >
    );
};

export default TaskDetail;
