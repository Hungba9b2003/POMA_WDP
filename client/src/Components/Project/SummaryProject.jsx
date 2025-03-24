import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { CheckCircle, Edit, List, Clock } from "lucide-react";
import { Bar, Pie } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const SummaryProject = () => {
  const { projectId } = useParams();
  const [projectInfo, setProjectInfo] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    fetchTasks();
  }, [projectId]);
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9999/projects/${projectId}/getProjectByIdSummary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.project);

      setProjectInfo(response.data.project);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };
  // const labels = projectInfo.classifications
  //   ? [...projectInfo.classifications]
  //   : [];
  const countTasksByStatus = (tasks, classifications) => {
    const countMap = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});

    return classifications.map((status) => countMap[status] || 0);
  };
  const statusData = {
    labels: projectInfo.classifications ? [...projectInfo.classifications] : [],
    datasets: [
      {
        data: projectInfo.tasks
          ? countTasksByStatus(projectInfo.tasks, projectInfo.classifications)
          : [],
        backgroundColor: [
          "#FF8B8B",
          "#FFC38B",
          "#4CAF50",
          "#36A2EB",
          "#FFCE56",
          "#FF6384",
        ],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          boxWidth: 20,
          padding: 10,
        },
      },
    },
  };
  const members = projectInfo.tasks || [];
  const assigneeCount = {};
  members.forEach((task) => {
    // Kiểm tra nếu task có assignee
    if (task.assignee) {
      assigneeCount[task.assignee.username] =
        (assigneeCount[task.assignee.username] || 0) + 1;
    }

    // Kiểm tra nếu task có subTasks
    if (Array.isArray(task.subTasks)) {
      task.subTasks.forEach((subTask) => {
        if (subTask.assignee) {
          assigneeCount[subTask.assignee.username] =
            (assigneeCount[subTask.assignee.username] || 0) + 1;
        }
      });
    }
  });
  console.log(assigneeCount);
  // const countTasks = (tasks, classifications) => {
  //   const countMap = tasks.reduce((acc, task) => {
  //     acc[task.status] = (acc[task.status] || 0) + 1;
  //     return acc;
  //   }, {});
  const totalTasks = Object.values(assigneeCount).reduce(
    (sum, count) => sum + count,
    0
  );
  const workloadData = {
    labels: projectInfo.members
      ? projectInfo.members.map((member) => {
          const taskCount = assigneeCount[member._id.username] || 0;
          const percentage =
            totalTasks > 0 ? ((taskCount / totalTasks) * 100).toFixed(2) : 0;
          return `${member._id.username} ( ${percentage}% )`;
        })
      : "",
    datasets: [
      {
        label: "Number of task assignments",
        data: projectInfo.members
          ? projectInfo.members.map(
              (member) => assigneeCount[member._id.username] || 0
            )
          : [],
        backgroundColor: "#0052cc",
      },
    ],
  };

  // const memberNames = projectInfo.members.map((member) => member.user);
  // console.log(memberNames + "e");

  const taskCount = projectInfo.tasks ? projectInfo.tasks.length : 0;
  const subTaskCount = projectInfo.tasks
    ? projectInfo.tasks.reduce((acc, task) => acc + task.subTasks.length, 0)
    : 0;
  const taskTypeData = {
    labels: ["Subtask", "Task", "Epic"],
    datasets: [
      {
        data: [subTaskCount, taskCount, 0],
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
      },
    ],
  };

  function StatCard({ title, value, icon }) {
    return (
      <div
        style={{
          background: "white",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {icon}
          <h4 style={{ color: "#172b4d", margin: "0" }}>{title}</h4>
        </div>
        <p
          style={{
            fontSize: "24px",
            color: "#0052cc",
            fontWeight: "bold",
            marginTop: "auto",
          }}
        >
          {value}
        </p>
      </div>
    );
  }
  const now = new Date().getTime();
  const next24Hours = now + 24 * 60 * 60 * 1000;
  const tasks = projectInfo.tasks || []; // Đảm bảo tasks luôn là một mảng

  const completedTasks = tasks.filter((task) =>
    task.status.toLowerCase().startsWith("completed")
  ).length;

  // Không cần filter lại lần nữa
  const expiringTasks = tasks.filter((task) => {
    if (!task.deadline) return false; // Kiểm tra nếu deadline không tồn tại
    const taskDeadline = new Date(task.deadline).getTime();
    return taskDeadline > now && taskDeadline <= next24Hours;
  }).length;
  const pendingTasks = tasks.length - completedTasks;
  const stats = [
    {
      title: "Completed Tasks",
      value: completedTasks || 0,
      icon: <CheckCircle size={24} color="#0052cc" />,
    },
    {
      title: "Pending Tasks",
      value: pendingTasks || 0,
      icon: <Edit size={24} color="#0052cc" />,
    },
    {
      title: "Lists Created",
      value: projectInfo.classifications?.length || 0,
      icon: <List size={24} color="#0052cc" />,
    },
    {
      title: "Due Soon",
      value: expiringTasks || 0,
      icon: <Clock size={24} color="#0052cc" />,
    },
  ];

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "",
        background: "#f4f5f7",
        marginLeft: "",
      }}
    >
      <div style={{ marginBottom: "30px" }}>
        <h1
          style={{ fontSize: "24px", color: "#172b4d", marginBottom: "10px" }}
        >
          Project: Summary
        </h1>
        <p style={{ color: "#5e6c84", fontSize: "16px" }}>Team workload</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {stats.map((item, index) => (
          <StatCard key={index} {...item} />
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
          }}
        >
          <h3 style={{ color: "#172b4d", marginBottom: "20px" }}>
            Status overview
          </h3>
          <div
            style={{
              width: "250px",
              height: "250px",
              margin: "auto",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/project/${projectId}/workspace`)}
          >
            <Pie data={statusData} options={options} style={{}} />
          </div>
        </div>
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
          }}
        >
          <h3 style={{ color: "#172b4d", marginBottom: "20px" }}>
            Hoạt động gần đây
          </h3>
          <div>
            <p>• Nguyễn Văn A đã hoàn thành task ABC</p>
            <p>• Trần Thị B đã tạo mới Epic XYZ</p>
            <p>• Lê Văn C đã cập nhật tiến độ task DEF</p>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
          }}
        >
          <h3 style={{ color: "#172b4d", marginBottom: "20px" }}>
            Team workload
          </h3>
          <div style={{ width: "250px", height: "250px", margin: "auto" }}>
            <Pie data={taskTypeData} options={options} />
          </div>
        </div>
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
          }}
        >
          <h3 style={{ color: "#172b4d", marginBottom: "20px" }}>
            Phân bổ công việc theo thành viên
          </h3>
          <Bar
            data={workloadData}
            options={{ scales: { y: { beginAtZero: true } } }}
          />
        </div>
      </div>
    </div>
  );
};

export default SummaryProject;
