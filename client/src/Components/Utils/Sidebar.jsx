import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCog, FaUsers, FaTasks, FaArrowCircleDown } from 'react-icons/fa';
import { TbWorld } from "react-icons/tb";
import { GrWorkshop } from "react-icons/gr";
import { Card } from 'react-bootstrap';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { path: '#', label: 'Summary', icon: <TbWorld /> },
        { path: '#', label: 'Workspace', icon: <GrWorkshop /> },
        { path: '#', label: 'Member', icon: <FaUsers /> },
        { path: '#', label: 'List Tasks', icon: <FaTasks /> },

    ];

    return (
        <div className="d-flex flex-column vh-100 p-3" style={{ width: '250px', borderRight: '1px solid #ccc' }}>
            <h4 className="text-dark text-center mb-4">Project name </h4>
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
                <img src="https://via.placeholder.com/40" alt="avatar" className="rounded-circle" />
                <div>
                    <p className="mb-0">Olala</p>
                    <small>Project Manager</small>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
