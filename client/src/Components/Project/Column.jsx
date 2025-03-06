import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import TaskCard from "./TaskCard";
import CreateTask from "./CreateTask";

const Column = ({ title, tasks, setTasks, projectId }) => {
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <Card className="p-3">
            <h5>{title}</h5>
            {tasks.map((task) => (
                <TaskCard key={task._id} task={task} />
            ))}
            <Button 
                variant="outline-primary" 
                className="mt-2" 
                onClick={handleOpenModal}
            >
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
