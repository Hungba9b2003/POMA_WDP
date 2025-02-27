import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { FaUsers, FaTasks } from 'react-icons/fa';
import { TbWorld } from "react-icons/tb";
import { GrWorkshop } from "react-icons/gr";
import { Card } from 'react-bootstrap';
import axios from 'axios';

const Sidebar = () => {
    const location = useLocation();
    const { projectId } = useParams();
    const [project, setProject] = useState(null);

    //console.log("Project ID from URL:", projectId);

    const menuItems = projectId
        ? [
            { path: `/projects/${projectId}/summary`, label: 'Summary', icon: <TbWorld /> },
            { path: `/projects/${projectId}/workspace`, label: 'Workspace', icon: <GrWorkshop /> },
            { path: `/projects/${projectId}/members`, label: 'Member', icon: <FaUsers /> },
            { path: `/projects/${projectId}/tasks`, label: 'List Tasks', icon: <FaTasks /> },
        ]
        : [];

    // useEffect để fetch project info
    useEffect(() => {
        if (!projectId) return; // Nếu không có projectId, không thực hiện fetch

        const fetchProjectInfo = async () => {
            try {
                //console.log(`Fetching project: ${projectId}`);
                const response = await axios.get(`http://localhost:9999/projects/${projectId}/get-project`);
                setProject(response.data.project); // Cập nhật project state
            } catch (error) {
                //console.error("Error fetching project info:", error);
            }
        };

        fetchProjectInfo();
    }, [projectId]); // Trigger khi projectId thay đổi

    // Kiểm tra nếu project chưa có dữ liệu thì render "Loading..."
    if (!project) {
        return <div></div>; // Chỉ hiển thị Loading nếu project vẫn là null
    }


    return (
        <div className="d-flex flex-column vh-100 p-3" style={{ width: '250px', borderRight: '1px solid #ccc' }}>
            <h4 className="text-dark text-center mb-4">
                {project.projectName}
                {project.isPremium && <span className="ms-2" style={{ color: 'gold' }}>💎</span>}
            </h4>
            <nav className="flex-column">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`d-flex align-items-center gap-2 p-2 rounded text-decoration-none ${location.pathname === item.path ? 'bg-primary text-white' : 'text-dark'}`}
                    >
                        {item.icon} {item.label}
                    </Link>
                ))}
            </nav>
            <Card className="mt-auto p-3 text-center" style={{ background: 'linear-gradient(135deg, #A855F7, #EC4899)', color: 'white' }}>
                <p className="mb-1">Upgrade to PRO to get access all features!</p>
                <button className="btn btn-light btn-sm">Get Pro Now!</button>
            </Card>
            <div className="d-flex align-items-center gap-2 mt-3">
                <img src="https://placehold.co/40" alt="avatar" className="rounded-circle" />
                <div>
                    <p className="mb-0">Olala</p>
                    <small>Project Manager</small>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
