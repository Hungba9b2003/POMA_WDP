import React, { useState } from "react";
import { Card } from "react-bootstrap";
import TaskDetail from "./TaskDetail";


const TaskCard = ({ task }) => {
    const [selectedTask, setSelectedTask] = useState(null);
    const [showModal, setShowModal] = useState(false);


    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTask(null);
    };


    return (
        <div>
            <Card className="mb-2 p-2" onClick={() => handleTaskClick(task)}>
                <small># {task.taskNumber}</small>
                <strong>{task.taskName}</strong>
                <p className="text-muted">{task.description}</p>
            </Card>
            {selectedTask && (
                <TaskDetail
                    task={selectedTask}
                    showModal={showModal}
                    onClose={handleCloseModal}
                />
            )}
        </div>

    );
};

export default TaskCard;
