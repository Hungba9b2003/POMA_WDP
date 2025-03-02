import React from "react";
import { Button, Card } from "react-bootstrap";
import TaskCard from "./TaskCard";

const Column = ({ title, tasks }) => {
    return (
        <Card className="p-3">
            <h5>{title}</h5>
            {tasks.map((task) => (
                <TaskCard key={task._id} task={task} />
            ))}
            <Button variant="outline-primary" className="mt-2">+ Create Task</Button>
        </Card>
    );
};

export default Column;
