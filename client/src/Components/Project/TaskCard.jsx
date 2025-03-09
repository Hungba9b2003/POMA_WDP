import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import TaskDetail from "./TaskDetail";
import axios from "axios";
import { useParams } from "react-router-dom";

const TaskCard = ({ task, setactiveCard, index, setactiveCardId }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const { projectId } = useParams();
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const handleTaskUpdate = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      )
    );
  };

  const fetchProject = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9999/projects/${projectId}/get-project`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (
        response.data.project &&
        response.data.project.isPremium !== undefined
      ) {
        setIsPremium(response.data.project.isPremium);
      } else {
        console.warn("isPremium not found in response data");
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    }
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
    <div
      style={{ cursor: "pointer" }}
      draggable
      onDragStart={() => {
        setactiveCardId(task);
        setactiveCard(index);
      }}
      onDragEnd={() => setactiveCard(null)}
    >
      <Card className="mb-2 p-2" onClick={() => handleTaskClick(task)}>
        {/* <small># {task.taskNumber}</small> */}
        <strong>{task.taskName}</strong>
        <p className="text-muted">{task.description}</p>
      </Card>
      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          showModal={showModal}
          onClose={handleCloseModal}
          onUpdateTask={handleTaskUpdate}
          isPremium={isPremium}
        />
      )}
    </div>
  );
};

export default TaskCard;
