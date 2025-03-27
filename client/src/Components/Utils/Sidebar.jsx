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
  const [userInfo, setUserInfo] = useState(null);

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
  }, [projectId, token]); // Added token as dependency

  // Move this useEffect before any conditional returns
  useEffect(() => {
    if (token) {
      const fetchUserInfo = async () => {
        try {
          const response = await axios.get(
            "http://localhost:9999/users/get-profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // console.log(response.data);
          setUserInfo(response.data);
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
          if (error.response) {
            console.error("Lỗi phản hồi:", error.response);
          } else if (error.request) {
            console.error("Lỗi yêu cầu:", error.request);
          } else {
            console.error("Thông báo lỗi:", error.message);
          }
        }
      };
      fetchUserInfo();
    }
  }, [token]);

  const handleGoToPro = () => {
    // Điều hướng đến trang nâng cấp
    navigate(`/project/${project._id}/membership`);
  };

  // Kiểm tra nếu project chưa có dữ liệu thì render "Loading..."
  if (!project || !userInfo) {
    return <div></div>; // Loading state for both project and userInfo
  }

  return (
    <div
      className="d-flex flex-column top-0 start-0"
      style={{
        width: "280px",
        height: "calc(100vh - 60px)",
        borderRight: "1px solid #ccc",
        backgroundColor: "rgb(255, 228, 242)",
        zIndex: 999,
        padding: "10px",
        position: "sticky",
        top: 0,
        overflow: "auto",
        paddingBottom: "20px",
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
            className={`d-flex align-items-center gap-2 p-2 rounded text-decoration-none ${location.pathname === item.path
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
      <div className="d-flex align-items-center gap-2 mt-3" >
        <img
          src={userInfo?.profile.avatar || "https://placehold.co/40"}
          alt="avatar"
          className="rounded-circle"
          style={{ width: "40px", height: "40px", objectFit: "cover" }}
        />
        <div>
          <p className="mb-0">{userInfo.username}</p>
          <small>{userInfo.account.email}</small>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
