import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { FaUsers, FaTasks } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import { GrWorkshop } from "react-icons/gr";
import { Card } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { IoSettingsSharp } from "react-icons/io5";

const Sidebar = () => {
  const location = useLocation();
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const navigate = useNavigate();
  //console.log("Project ID from URL:", projectId);

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
  const menuItems = projectId
    ? [
        {
          path: `/project/${projectId}/summary`,
          label: "Summary",
          icon: <TbWorld />,
        },
        {
          path: `/project/${projectId}/workspace`,
          label: "Workspace",
          icon: <GrWorkshop />,
        },
        {
          path: `/project/${projectId}/members`,
          label: "Member",
          icon: <FaUsers />,
        },
        {
          path: `/project/${projectId}/listTask`,
          label: "List Tasks",
          icon: <FaTasks />,
        },
        {
          path: `/project/${projectId}/setting`,
          label: "Setting",
          icon: <IoSettingsSharp />,
        },
      ]
    : [];

  // useEffect để fetch project info
  useEffect(() => {
    if (!projectId) return; // Nếu không có projectId, không thực hiện fetch

    const fetchProjectInfo = async () => {
      try {
        //console.log(`Fetching project: ${projectId}`);
        const response = await axios.get(
          `http://localhost:9999/projects/${projectId}/get-project`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProject(response.data.project);
      } catch (error) {
        console.error("Error fetching project info:", error);
      }
    };

    fetchProjectInfo();
  }, [projectId]); // Trigger khi projectId thay đổi

  // Kiểm tra nếu project chưa có dữ liệu thì render "Loading..."
  if (!project) {
    return <div></div>; // Chỉ hiển thị Loading nếu project vẫn là null
  }

  const handleGoToPro = () => {
    // Điều hướng đến trang nâng cấp
    navigate(`/project/${project._id}/membership`);
  };

  return (
    <div
      className="d-flex flex-column"
      style={{
        width: "250px",
        height: "100vh",
        borderRight: "1px solid #ccc",
        backgroundColor: "rgb(255, 228, 242)",
        zIndex: 999,
        padding: "10px",
      }}
    >
      <h4
        className="text-dark text-center mb-4"
        style={{ borderBottom: "2px solid black" }}
      >
        {project.projectName}
        {project.isPremium && (
          <span className="ms-2" style={{ color: "gold" }}>
            💎
          </span>
        )}
      </h4>
      <nav className="flex-column">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`d-flex align-items-center gap-2 p-2 rounded text-decoration-none ${
              location.pathname === item.path
                ? "bg-primary text-white"
                : "text-dark"
            }`}
          >
            {item.icon} {item.label}
          </Link>
        ))}
      </nav>
      <Card
        className="mt-auto p-3 text-center"
        style={{
          background: "linear-gradient(135deg, #A855F7, #EC4899)",
          color: "white",
        }}
      >
        {project.isPremium ? (
          // Nếu project đã premium
          <>
            <p className="mb-1">Project already premium</p>
            <button className="btn btn-light btn-sm">💎</button>
          </>
        ) : (
          // Nếu project chưa premium
          <>
            <p className="mb-1">Upgrade to PRO to get access all features!</p>
            <button className="btn btn-light btn-sm" onClick={handleGoToPro}>
              Go to Pro
            </button>
          </>
        )}
      </Card>
      <div className="d-flex align-items-center gap-2 mt-3">
        <img
          src="https://placehold.co/40"
          alt="avatar"
          className="rounded-circle"
        />
        <div>
          <p className="mb-0">Olala</p>
          <small>Project Manager</small>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
