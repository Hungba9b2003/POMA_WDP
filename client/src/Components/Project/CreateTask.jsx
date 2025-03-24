import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const CreateTask = ({ show, handleClose, projectId, setTasks }) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  let id = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      id = decoded?.id || null;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  const [taskData, setTaskData] = useState({
    taskName: "",
    description: "",
    deadline: "",
    status: "",
  });

  const [classifications, setClassifications] = useState([]); // Lưu danh sách classifications
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClassifications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9999/projects/${projectId}/get-project`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 200 && response.data.project) {
          setClassifications(response.data.project.classifications);
          setTaskData((prev) => ({
            ...prev,
            status: response.data.project.classifications[0] || "",
          }));
        }
      } catch (error) {
        console.error("Lỗi khi lấy classifications:", error);
      }
    };

    if (show) fetchClassifications();
  }, [projectId, show]);

  const handleCreateTask = async () => {
    setError("");

    if (!taskData.taskName) {
      setError("Vui lòng nhập tên task!");
      return;
    }

    if (!taskData.deadline) {
      setError("Vui lòng chọn deadline!");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (taskData.deadline < today) {
      setError("Deadline phải là ngày tương lai!");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:9999/projects/${projectId}/tasks/create`,
        { ...taskData, id }, // Dữ liệu gửi đi
        { headers: { Authorization: `Bearer ${token}` } } // Headers
      );

      if (response.status === 201) {
        alert("Tạo task thành công!");
        setTasks((prevTasks) => [...prevTasks, response.data]);
        handleClose();
        setTaskData({
          taskName: "",
          description: "",
          deadline: "",
          status: classifications[0] || "",
        });
      }
    } catch (error) {
      console.error("Lỗi khi tạo task:", error.response?.data || error.message);
      alert(
        `Tạo task thất bại! Lỗi: ${
          error.response?.data?.error?.message || "Không rõ nguyên nhân"
        }`
      );
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Task Name</Form.Label>
            <Form.Control
              type="text"
              value={taskData.taskName}
              onChange={(e) =>
                setTaskData({ ...taskData, taskName: e.target.value })
              }
              placeholder="Enter task name"
            />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={taskData.description}
              onChange={(e) =>
                setTaskData({ ...taskData, description: e.target.value })
              }
              placeholder="Enter task description"
            />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Deadline</Form.Label>
            <Form.Control
              type="date"
              value={taskData.deadline}
              onChange={(e) =>
                setTaskData({ ...taskData, deadline: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={taskData.status}
              onChange={(e) =>
                setTaskData({ ...taskData, status: e.target.value })
              }
            >
              {classifications.map((classification, index) => (
                <option key={index} value={classification}>
                  {classification}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          {error && <p className="text-danger mt-2">{error}</p>}{" "}
          {/* Hiển thị lỗi nếu có */}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleCreateTask}>
          Create Task
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateTask;
