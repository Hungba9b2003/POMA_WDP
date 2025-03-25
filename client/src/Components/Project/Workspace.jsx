import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import TaskCard from "./TaskCard";
import CreateTask from "./CreateTask";
import { RiDeleteBin6Line } from "react-icons/ri";
import DropArea from "./DropArea";
import { HiMiniPencilSquare } from "react-icons/hi2";
const Workspace = () => {
  const [columns, setColumns] = useState([
    "Pending",
    "In Progress",
    "Completed",
  ]);
  const [tasks, setTasks] = useState([]);
  const { projectId } = useParams();
  const [isPremium, setIsPremium] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [activeCard, setactiveCard] = useState(null);
  const [activeCardId, setactiveCardId] = useState(null);
  const [editableColumn, setEditableColumn] = useState("");
  const [selectedColumnIndex, setSelectedColumnIndex] = useState(null);

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  let id = null;

  const onDrop = (status, position, taskId) => {
    console.log(
      `${activeCard} is going into status: ${status}, position: ${position}`
    );
    if (activeCard == null || activeCard === undefined) return;

    // Lấy task cần di chuyển
    const taskToMove = tasks[activeCard];

    // Tạo bản sao danh sách và loại bỏ task cũ
    const updatedTasks = [...tasks];
    updatedTasks.splice(activeCard, 1); // Xóa phần tử cũ

    // Điều chỉnh vị trí chèn
    const adjustedPosition = activeCard < position ? position - 1 : position;

    // Chèn task vào vị trí mới
    updatedTasks.splice(adjustedPosition, 0, { ...taskToMove, status: status });
    setTasks(updatedTasks);

    // 🔥 Fix lấy taskId đúng khi swap
    let swapTaskId1, swapTaskId2;
    if (position === 0) {
      // Nếu kéo lên đầu danh sách, swap với thẻ đầu tiên cũ
      swapTaskId2 = tasks[0]?._id;
    }
    if (activeCard < position) {
      // Kéo xuống: Hoán đổi với thẻ phía trước
      swapTaskId1 = activeCardId._id;
      swapTaskId2 = tasks[position - 1]?._id;
    } else {
      // Kéo lên: Hoán đổi với thẻ ngay tại vị trí mới
      swapTaskId1 = activeCardId._id;
      swapTaskId2 = tasks[position]?._id;
    }

    console.log(`Swapping ${swapTaskId1} with ${swapTaskId2}`);

    if (swapTaskId1 && swapTaskId2) {
      // Gửi yêu cầu đổi vị trí taskNumber
      axios
        .put(`
          http://localhost:9999/projects/${projectId}/tasks/swap`,
          {
            position: position,
            taskId1: swapTaskId1,
            taskId2: swapTaskId2,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .catch((error) => console.error("Error swapping tasks:", error));
    }

    // Cập nhật status của task
    axios
      .put(
        `http://localhost:9999/projects/${projectId}/tasks/${activeCardId._id}/edit`,
        { status: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .catch((error) => console.error("Error updating task status:", error));
  };

  if (token) {
    try {
      const decoded = jwtDecode(token);
      id = decoded?.id || null;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  useEffect(() => {
    axios
      .get(`http://localhost:9999/projects/${projectId}/tasks/get-all`, {
        headers: { Authorization: `Bearer ${token} ` },
      })
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));

    axios
      .get(`http://localhost:9999/projects/${projectId}/get-project`, {
        headers: { Authorization: `Bearer ${token} ` },
      })
      .then((response) => {
        if (response.data.project.classifications) {
          setColumns(response.data.project.classifications);
        }
        setIsPremium(response.data.project.isPremium || false);
      })
      .catch((error) => console.error("Error fetching project data:", error));
  }, [projectId, token, id]);

  const addColumn = useCallback(async () => {
    if (!isPremium && columns.length >= 5) {
      alert(
        "You have reached the maximum number of columns for a free account!"
      );
      return;
    }
    const newColumn = prompt("Enter new column title:")?.trim();
    if (!newColumn) return;

    try {
      const response = await axios.put(
        `http://localhost:9999/projects/${projectId}/edit`,
        { newColumn, id }
      );
      setColumns(response.data.classifications);
    } catch (error) {
      console.error("Error adding column:", error);
      alert("Failed to add column!");
    }
  }, [projectId, id, isPremium, columns]);

  const deleteColumn = useCallback(
    async (title) => {
      if (!window.confirm(`Are you sure you want to delete column "${title}"?`))
        return;

      try {
        const response = await axios.put(
          `http://localhost:9999/projects/${projectId}/edit`,
          { id, removeColumn: title }
        );
        setColumns(response.data.classifications);
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task.column !== title)
        );
      } catch (error) {
        console.error("Error deleting column:", error);
        alert("Failed to delete column!");
      }
    },
    [projectId, id, setColumns, setTasks]
  );

  const handleOpenModal = (column) => {
    setSelectedColumn(column);
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  const handleEditColumn = (index, col) => {
    setSelectedColumnIndex(index);
    setEditableColumn(col);
  };

  const handleSaveColumn = async (oldName) => {
    if (!editableColumn) return;

    if (editableColumn === oldName) {
      setSelectedColumnIndex(null);
      return;
    }

    if (!id) {
      console.error("User ID not found in token!");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:9999/projects/${projectId}/edit`,
        {
          id,  
          renameColumn: {
            oldName,
            newName: editableColumn,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.classifications) {
        setColumns(response.data.classifications);
      } else {
        console.error("API response missing classifications:", response.data);
      }

      setSelectedColumnIndex(null);
    } catch (error) {
      console.error("Error updating column:", error);
      alert("Failed to update column name!");
    }
  };




  return (
    <Container fluid className="workspace-container">
      <h2 className="mb-4">CRM Board</h2>
      <div className="board-wrapper">
        <Row className="flex-nowrap board-container">
          {columns.map((col, index) => (
            <Col key={col} md={3} className="column">
              <Card className="p-3">
                <Row>
                  <Col>
                    {selectedColumnIndex === index ? (
                      <input
                        type="text"
                        value={editableColumn}
                        onChange={(e) => setEditableColumn(e.target.value)}
                        onBlur={() => handleSaveColumn(col)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveColumn(col);
                        }}

                        autoFocus
                      />
                    ) : (
                      <h5 onClick={() => handleEditColumn(index, col)} style={{ cursor: "pointer" }}>
                        {col} <HiMiniPencilSquare />
                      </h5>
                    )}
                  </Col>
                  <Col className="text-end">
                    <RiDeleteBin6Line
                      onClick={() => deleteColumn(col)}
                      style={{ cursor: "pointer", color: "red" }}
                    />
                  </Col>
                </Row>
                <DropArea onDrop={() => onDrop(col, 0, 0)} />
                {tasks.map(
                  (task, index) =>
                    task.status === col && (
                      <React.Fragment key={task._id || `task-${index}`}>
                        <TaskCard
                          key={task._id || `task-${index}`} // Đảm bảo key duy nhất
                          task={task}
                          index={index}
                          setactiveCard={setactiveCard}
                          onDrop={onDrop}
                          setactiveCardId={setactiveCardId}
                        />
                        <DropArea
                          key={`drop-${col}-${index}`}
                          onDrop={() => onDrop(col, index + 1, task._id)}
                        />
                      </React.Fragment>
                    )
                )}
                <Button
                  variant="outline-primary"
                  className="mt-2"
                  onClick={() => handleOpenModal(col)}
                >
                  + Create Task
                </Button>
              </Card>
            </Col>
          ))}
          <Col md="auto">
            <Button variant="light" onClick={addColumn} className="mt-4">
              +
            </Button>
          </Col>
        </Row>
      </div>
      <CreateTask
        show={showModal}
        handleClose={handleCloseModal}
        projectId={projectId}
        setTasks={setTasks}
      />
    </Container >
  );
};

export default Workspace;