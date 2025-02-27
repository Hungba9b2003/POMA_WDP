import React from 'react';
import { useParams } from 'react-router-dom';

export default function Workspace() {
    const { projectId } = useParams();
    console.log("Project ID from useParams:", projectId);  // Kiểm tra giá trị của projectId

    return (
        <div>Đây là Workspace của project {projectId}</div>
    );
}
