import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Col,
  Row,
  Image,
  Dropdown,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import axios from "axios";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  FaEdit,
  FaTrashAlt,
  FaRegCalendarAlt,
  FaCalendarTimes,
  FaCalendarCheck,
} from "react-icons/fa"; // Các biểu tượng bút và thùng rác
import moment from "moment"; // Để tính thời gian đã trôi qua

const TaskDetail = ({ task, showModal, onClose, onUpdateTask, isPremium }) => {
    const [user, setUser] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState(task.comments || []);  // Use task.comments directly
    const [newSubTask, setNewSubTask] = useState("");
    const [subTasks, setSubTasks] = useState(task.subTasks || []);  // Use task.subTasks directly
    const [editingSubTaskId, setEditingSubTaskId] = useState(null); // ID của subtask đang sửa
    const [subTaskName, setSubTaskName] = useState("");
    const [taskDescription, setTaskDescription] = useState(task.description || "");
    const [editingCommentId, setEditingCommentId] = useState(null); // Trạng thái bình luận đang chỉnh sửa
    const [editedContent, setEditedContent] = useState(""); // Nội dung chỉnh sửa
    const [projectMembers, setProjectMembers] = useState([]);
    const [isOwner, setIsOwner] = useState(false);
    const [assigneeName, setAssigneeName] = useState(task.assignee?.username || null);
    const [reviewerName, setReviewerName] = useState(task.reviewer?.username || null);
    const [assigneeAvatar, setAssigneeAvatar] = useState(task.assignee?.profile?.avatar || null);
    const [reviewerAvatar, setReviewerAvatar] = useState(task.reviewer?.profile?.avatar || null);
    const [deadline, setDeadline] = useState(task.deadline || null);
    const [taskStatus, setTaskStatus] = useState(task.status || "");
    const [isEditing, setIsEditing] = useState(false);
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
            fetchComments();
            fetchSubTasks();
            fetchUser();
        }
    }, [task]);

    // Fetch user profile
    const fetchUser = async () => {
        try {
            const response = await axios.get(`http://localhost:9999/users/get-profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user profile:", error);
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
    //console.log(projectMembers.find(member => member.id === id));
    const handleEdit = (commentId, content) => {
        setEditingCommentId(commentId); // Bắt đầu chỉnh sửa bình luận
        setEditedContent(content); // Đặt nội dung chỉnh sửa
    };

    // Handle khi người dùng nhấn "Save"
    const handleSave = async (commentId) => {
        try {
            await axios.put(
                `http://localhost:9999/projects/${projectId}/tasks/${task._id}/comments/${commentId}/edit`,
                { content: editedContent },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEditingCommentId(null); // Dừng chỉnh sửa sau khi lưu
            setEditedContent(""); // Reset nội dung
            fetchComments(); // Fetch lại bình luận sau khi chỉnh sửa
        } catch (error) {
            console.error("Error editing comment:", error);
        }
    };

    const handleDelete = async (commentId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
        if (confirmDelete) {
            try {
                // Gọi API DELETE để xóa bình luận
                await axios.delete(
                    `http://localhost:9999/projects/${projectId}/tasks/${task._id}/comments/${commentId}/delete`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                fetchComments();  // Fetch lại bình luận sau khi xóa thành công
            } catch (error) {
                console.error("Error deleting comment:", error);
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
            if (updates.assignee) updateData.assignee = updates.assignee;
            console.log(updates);

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

    const fetchProjectMembers = async () => {
        try {
            const response = await fetch(`http://localhost:9999/projects/${projectId}/get-member`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();

        // Sử dụng 'id' thay vì '_id' để so sánh
        setProjectMembers(data.memberInfo || []);

                // Kiểm tra xem có thành viên nào có role là 'owner' và id trùng với id hiện tại không
                setIsOwner(data.memberInfo.some(member => member.id.toString() === id.toString() && member.role === 'owner'));

            } else {
                setProjectMembers([]); // Nếu API lỗi, vẫn đảm bảo là mảng
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách thành viên:", error);
            setProjectMembers([]);
        }
    };

  useEffect(() => {
    setTaskDescription(task.description || "");
    setAssigneeName(task.assignee?.username || "Unknown");
    setAssigneeAvatar(task.assignee?.profile?.avatar || null);
    setReviewerName(task.reviewer?.username || "Unknown");
    setReviewerAvatar(task.reviewer?.profile?.avatar || null);
  }, [task]);

  useEffect(() => {
    fetchProjectMembers();
  }, [projectId, token, id]);

  const handleChangeAssignee = async (newAssigneeId) => {
    if (!isOwner || !isPremium) {
      console.warn("You don't have permission to change the assignee.");
      alert("Only the owner of a premium project can change the assignee.");
      return;
    }
    const handleChangeAssignee = async (newAssigneeId) => {
        if (!isOwner || !isPremium) {
            console.warn("You don't have permission to change the assignee.");
            alert("Only the owner of a premium project can change the assignee.");
            return;
        }

        const selectedAssignee = projectMembers.find(member => member.id === newAssigneeId);
        console.log("Selected assignee:", selectedAssignee);
        if (!selectedAssignee) {
            console.error("Selected assignee not found in projectMembers");
            return;
        }

    console.log("Updating assignee with ID:", newAssigneeId); // Debugging log

    setAssigneeName(selectedAssignee.name);
    setAssigneeAvatar(selectedAssignee.avatar);

        try {
            const response = await axios.put(
                `http://localhost:9999/projects/${projectId}/tasks/${task._id}/edit`,
                { assignee: newAssigneeId },  // 👈 Chỉ gửi ID, không phải object
                { headers: { Authorization: `Bearer ${token}` } }
            );

      console.log("API Response:", response.data); // Debugging log

      if (response.data) {
        onUpdateTask(response.data); // Cập nhật task trong ListTask
      }
    } catch (error) {
      console.error("Error updating assignee", error.response?.data || error);
      setAssigneeName(task.assignee?.username || "Unassigned");
      setAssigneeAvatar(task.assignee?.profile?.avatar || null);
    }
  };

    const handleChangeReviewer = async (newReviewerId) => {

        if (!isOwner || !isPremium) {
            console.warn("You don't have permission to change the assignee.");
            alert("Only the owner of a premium project can change the assignee.");
            return;
        }

        const selectedReviewer = projectMembers.find(member => member.id === newReviewerId);
        setReviewerName(selectedReviewer.name);
        setReviewerAvatar(selectedReviewer.avatar);
        try {
            const response = await axios.put(
                `http://localhost:9999/projects/${projectId}/tasks/${task._id}/edit`,
                { reviewer: newReviewerId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data) {
                onUpdateTask(response.data);// Cập nhật toàn bộ task
            }
        } catch (error) {
            console.error("Error updating reviewer", error);
            setReviewerName(task.reviewer?.username || "Unknown");
            setReviewerAvatar(task.reviewer?.profile?.avatar || null);
        }
    };

    const handleUpdateTaskStatus = async (newStatus) => {
        console.log("Updating task status to:", newStatus);
        setTaskStatus(newStatus);
        try {
            const { data } = await axios.put(
                `http://localhost:9999/projects/${projectId}/tasks/${task._id}/edit`,
                { status: newStatus },
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
    }

    const checkDeadlineStatus = (deadline) => {
        const currentDate = new Date(); // Ngày hiện tại
        const deadlineDate = new Date(deadline); // Deadline từ task

        if (deadlineDate < currentDate) {
            return "overdue"; // Nếu deadline đã qua, trả về "overdue"
        } else {
            return "upcoming"; // Nếu deadline chưa đến, trả về "upcoming"
        }
    };

    const handleUpdateDeadline = async (newDeadline) => {
        if (checkDeadlineStatus(newDeadline) === "overdue") {
            alert("Deadline you chose has passed. Please choose another one.");
            return;
        }
        setDeadline(newDeadline);
        try {
            const { data } = await axios.put(
                `http://localhost:9999/projects/${projectId}/tasks/${task._id}/edit`,
                { deadline: newDeadline },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            onUpdateTask(data); // Cập nhật task trong parent component
        } catch (error) {
            console.error("Error updating deadline", error);
        }
    };
    const deadlineStatus = checkDeadlineStatus(deadline);

    return (
        <Modal show={showModal} onHide={onClose} size="xl">
            <Modal.Header closeButton>
                <Modal.Title style={{ fontWeight: "bold" }}>{task.taskName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Left Section: 7 part */}
                <Row>
                    <Col md={8}>
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
                                        Done :{Math.round(completed)}%
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
                                                    <Col xs={6}>
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

                                                    <Col xs={1} className="d-flex justify-content-center align-items-center">
                                                        <Dropdown>
                                                            <Dropdown.Toggle variant="link" id="dropdown-assignee-subtask">
                                                                {/* Hiển thị chỉ avatar trong trạng thái bình thường */}
                                                                <Image
                                                                    src={subtask.assignee?.profile?.avatar || "default-avatar-url"}
                                                                    roundedCircle
                                                                    width={30}
                                                                    height={30}
                                                                    style={{ cursor: 'pointer' }}
                                                                />
                                                            </Dropdown.Toggle>

                                                            <Dropdown.Menu>
                                                                {projectMembers.map(member => {
                                                                    // Điều kiện chỉ cho phép owner hoặc assignee của task chọn subtask
                                                                    if (
                                                                        (isOwner && member.role !== "owner") ||  // Owner có thể chọn bất kỳ ai trừ chính mình
                                                                        (task.assignee._id === member._id && member.role !== "owner") // Assignee của task không thể chọn owner
                                                                    ) {
                                                                        return (
                                                                            <Dropdown.Item
                                                                                key={member._id}
                                                                                onClick={() => handleUpdateSubTask(subtask, { assignee: member.id })} // Gọi trực tiếp editSubTask
                                                                            >
                                                                                <Row className="d-flex align-items-center">
                                                                                    <Col xs={2}>
                                                                                        <Image
                                                                                            src={member?.avatar || "default-avatar-url"}
                                                                                            roundedCircle
                                                                                            width={30}
                                                                                            height={30}
                                                                                        />
                                                                                    </Col>
                                                                                    <Col xs={9} style={{ marginLeft: '10px' }}>
                                                                                        {member?.name}
                                                                                    </Col>
                                                                                </Row>
                                                                            </Dropdown.Item>
                                                                        );
                                                                    }
                                                                    return null;
                                                                })}
                                                            </Dropdown.Menu>
                                                        </Dropdown>
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
                            </Row>

                        )}

                        {/* Comments Section */}
                        <h5>Comments</h5>
                        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                            <ul style={{ listStyleType: "none", padding: 0 }}>
                                {comments.slice().reverse().map((c, index) => (
                                    <li key={index} style={{ marginBottom: "20px" }}>
                                        <Row className="align-items-center">
                                            {/* Avatar - Cột 1 */}
                                            <Col xs={1}>
                                                <img
                                                    src={c.user?.profile?.avatar || "default-avatar-url"}
                                                    alt="Avatar"
                                                    style={{
                                                        width: "50px",
                                                        height: "50px",
                                                        borderRadius: "50%",
                                                    }}
                                                />
                                            </Col>

                                            {/* Nội dung bình luận - Cột 2 */}
                                            <Col xs={11}>
                                                {/* Hàng 1: Tên người bình luận */}
                                                <Row>
                                                    <strong>{c.user?.username}</strong>
                                                </Row>

                                                {/* Hàng 2: Nội dung bình luận và các nút Edit/Delete */}
                                                <Row>
                                                    <Col xs={10}>
                                                        {editingCommentId === c._id ? (
                                                            <textarea
                                                                value={editedContent}
                                                                onChange={(e) => setEditedContent(e.target.value)}
                                                                style={{
                                                                    width: "100%",
                                                                    height: "60px",
                                                                    padding: "10px",
                                                                    borderRadius: "5px",
                                                                }}
                                                            />
                                                        ) : (
                                                            <p>{c.content}</p>
                                                        )}
                                                    </Col>

                                                    <Col xs={1} className="text-center">
                                                        {editingCommentId === c._id ? (
                                                            <button onClick={() => handleSave(c._id)}>Save</button>
                                                        ) : (
                                                            <FaEdit
                                                                style={{ color: "gold", cursor: "pointer" }}
                                                                onClick={() => handleEdit(c._id, c.content)}
                                                            />
                                                        )}
                                                    </Col>

                                                    <Col xs={1} className="text-center">
                                                        <FaTrashAlt
                                                            style={{ color: "red", cursor: "pointer" }}
                                                            onClick={() => handleDelete(c._id)}
                                                        />
                                                    </Col>
                                                </Row>

                                                {/* Hàng 3: Thời gian bình luận */}
                                                <Row>
                                                    <small>{moment(c.createdAt).fromNow()}</small> {/* Hiển thị thời gian tương đối */}
                                                </Row>
                                                {/* Thêm dòng gạch dưới mỗi bình luận */}
                                                <hr style={{ borderTop: '2px solid black', marginBottom: '10px' }} />

                                            </Col>
                                        </Row>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Col>
                    <Col md={4}>
                        <Row style={{ width: "100%", maxWidth: "330px" }}>
                            <Form.Control
                                as="select"
                                value={taskStatus}
                                onChange={(e) => handleUpdateTaskStatus(e.target.value)}
                                style={{
                                    border: "1px solid black",
                                    borderRadius: "5px",
                                    width: "120px",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    color: taskStatus === "Pending" ? "black" : taskStatus === "In Progress" ? "blue" : "green",
                                }}
                            >
                                <option value="Pending" style={{ fontWeight: "bold", color: "black" }}>
                                    Pending
                                </option>
                                <option value="In Progress" style={{ fontWeight: "bold", color: "blue" }}>
                                    In Progress
                                </option>
                                <option value="Completed" style={{ fontWeight: "bold", color: "green" }}>
                                    Completed
                                </option>
                            </Form.Control>
                        </Row>

                        <Row className="d-flex align-items-center">
                            <Col md={2}>
                                <strong>Assignee:</strong>
                            </Col>
                            <Col md={8}>
                                <Dropdown>
                                    <Dropdown.Toggle variant="link" id="dropdown-assignee">
                                        <Image
                                            src={assigneeAvatar}
                                            roundedCircle
                                            width={30}
                                            height={30}
                                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                                        />
                                        <span style={{ marginLeft: '10px' }}>
                                            {assigneeName}
                                        </span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {projectMembers.map(member => (
                                            <Dropdown.Item
                                                key={member.id}
                                                onClick={() => handleChangeAssignee(member.id)} // Cập nhật assignee
                                            >
                                                <Image
                                                    src={member?.avatar}
                                                    roundedCircle
                                                    width={30}
                                                    height={30}
                                                    style={{ marginRight: '10px' }}
                                                />
                                                {member.name}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                        </Row>

                        <Row className="d-flex align-items-center">
                            <Col md={2}>
                                <strong>Reviewer:</strong>
                            </Col>
                            <Col md={8}>
                                <Dropdown>
                                    <Dropdown.Toggle variant="link" id="dropdown-reviewer">
                                        <Image
                                            src={reviewerAvatar} // Sử dụng Optional chaining
                                            roundedCircle
                                            width={30}
                                            height={30}
                                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                                        />
                                        <span style={{ marginLeft: '10px' }}>
                                            {reviewerName}
                                        </span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {projectMembers.map(member => (
                                            <Dropdown.Item
                                                key={member.id}
                                                onClick={() => handleChangeReviewer(member.id)} // Thực hiện thay đổi reviewer
                                            >
                                                <Image
                                                    src={member.avatar} // Avatar của member
                                                    roundedCircle
                                                    width={30}
                                                    height={30}
                                                    style={{ marginRight: '10px' }}
                                                />
                                                {member.name}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4}>
                                <strong>Deadline:</strong>
                            </Col>
                            <Col md={8}>
                                {/* Hiển thị ngày deadline với màu sắc và icon dựa trên trạng thái */}
                                <span
                                    style={{
                                        fontSize: "0.9rem",
                                        color: deadlineStatus === "overdue" ? "red" : deadlineStatus === "upcoming" ? "green" : "gray",
                                    }}
                                >
                                    {deadline ? new Date(deadline).toLocaleDateString() : "Not set"}
                                </span>

                                {/* Thêm icon tương ứng với trạng thái deadline */}
                                <Button
                                    variant="link"
                                    onClick={() => setIsEditing(true)} // Khi nhấn vào biểu tượng, mở chế độ chỉnh sửa
                                >
                                    {deadlineStatus === "overdue" ? (
                                        <FaCalendarTimes style={{ color: "red" }} />
                                    ) : deadlineStatus === "upcoming" ? (
                                        <FaCalendarCheck style={{ color: "green" }} />
                                    ) : (
                                        <FaRegCalendarAlt />
                                    )}
                                </Button>

                                {/* Input cho phép chỉnh sửa deadline nếu có sự kiện chỉnh sửa */}
                                {isEditing && (
                                    <Form.Control
                                        type="date"
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)} // Cập nhật trạng thái deadline khi thay đổi
                                        onBlur={() => handleUpdateDeadline(deadline)} // Gọi API khi mất focus
                                        style={{ marginTop: "10px" }}
                                    />
                                )}
                            </Col>
                        </Row>

                        <Row style={{ marginLeft: "10px" }}>
                            <Col md={4}>
                                <span style={{ fontSize: "0.9rem" }}>
                                    <FaRegCalendarAlt /> Created At
                                </span>
                            </Col>
                            <Col md={8}>
                                <span style={{ fontSize: "0.9rem", color: "gray" }}>
                                    {task?.createdAt ? new Date(task?.createdAt).toLocaleString() : "Not available"}
                                </span>
                            </Col>
                        </Row>
                        <Row style={{ marginLeft: "10px" }}>
                            <Col md={4}>
                                <span style={{ fontSize: "0.9rem" }}>
                                    <FaRegCalendarAlt /> Updated At
                                </span>
                            </Col>
                            <Col md={8}>
                                <span style={{ fontSize: "0.9rem", color: "gray" }}>
                                    {task?.updatedAt ? new Date(task?.updatedAt).toLocaleString() : "Not available"}
                                </span>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal >
    );
};

export default TaskDetail;
