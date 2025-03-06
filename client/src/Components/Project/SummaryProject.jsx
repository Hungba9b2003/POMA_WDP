import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const SummaryProject = () => {
  const statusData = {
    labels: ["To Do", "In Progress", "Done"],
    datasets: [
      {
        data: [12, 8, 15],
        backgroundColor: ["#FF8B8B", "#FFC38B", "#4CAF50"],
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

  const workloadData = {
    labels: ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D"],
    datasets: [
      {
        label: "Số công việc",
        data: [4, 6, 3, 5],
        backgroundColor: "#0052cc",
      },
    ],
  };

  const taskTypeData = {
    labels: ["Subtask", "Task", "Epic"],
    datasets: [
      {
        data: [20, 15, 5],
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
      },
    ],
  };

  return (
    <div style={{ padding: "20px", background: "#f4f5f7" }}>
      <div style={{ marginBottom: "30px" }}>
        <h1
          style={{ fontSize: "24px", color: "#172b4d", marginBottom: "10px" }}
        >
          Project: Summary
        </h1>
        <p style={{ color: "#5e6c84", fontSize: "16px" }}>
          Tổng quan về tiến độ và phân bổ công việc của dự án
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {[
          "Công việc hoàn thành",
          "Số lần chỉnh sửa",
          "Danh sách đã tạo",
          "Sắp đến hạn",
        ].map((title, index) => (
          <div
            key={index}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
            }}
          >
            <h3 style={{ color: "#172b4d", marginBottom: "10px" }}>{title}</h3>
            <p
              style={{ fontSize: "24px", color: "#0052cc", fontWeight: "bold" }}
            >
              {[15, 45, 8, 5][index]}
            </p>
          </div>
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
            Trạng thái công việc
          </h3>
          <div style={{ width: "250px", height: "250px", margin: "auto" }}>
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
          <h3 style={{ color: "#172b4d", marginBottom: "20px" }}>Đóng góp</h3>
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
