import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../Context/AppContext";
import "./../../Styles/Login/Verify.module.css";
export default function VerifyPage() {
  const { authentication_API, setUser } = useContext(AppContext);
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    async function verifyAccount() {
      try {
        const response = await axios.get(
          `${authentication_API}/verify/${id}/${token}`
        );
        if (response.data.message) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        setStatus("error");
      }
    }

    verifyAccount();
  }, [id, token]);

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    backgroundColor: "#f4f4f4",
    fontFamily: "Arial, sans-serif",
  };

  const cardStyle = {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "350px",
  };

  const buttonStyle = {
    marginTop: "1rem",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#007BFF",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
  };

  const successStyle = { color: "#28a745" };
  const errorStyle = { color: "#dc3545" };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2>Account Verification</h2>
        {status === "loading" && <p>Verifying your account...</p>}
        {status === "success" && (
          <div style={successStyle}>
            <h2 style={{ color: "green" }}>Account Verified Successfully!</h2>
            <p>You can now log in.</p>
          </div>
        )}
        {status === "error" && (
          <div style={errorStyle}>
            <h2 style={{ color: "red" }}>Verification Failed!</h2>
            <p>Invalid or expired token.</p>
          </div>
        )}
        <button
          style={buttonStyle}
          onClick={() => navigate("/login/loginForm")}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
