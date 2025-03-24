import React, { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Alert } from "react-bootstrap";
import axios from "axios";
import loginImage from "../../assets/login/images/image1.jpg";
import styles from "../../Styles/Login/Login.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function ResetPassword() {
  const { authentication_API } = useContext(AppContext);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const navigate = useNavigate();
  const { id, token } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const resetPass_API = `${authentication_API}/reset-password/${id}/${token}`;

  const resetPassword = async () => {
    try {
      const { data } = await axios.post(resetPass_API, {
        password,
        confirmPassword,
      });
      return data;
    } catch (error) {
      if (error.response) {
        // Lấy lỗi từ backend
        return error.response.data;
      }
      return { status: "error", message: "Network error, please try again!" };
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters!");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    const result = await resetPassword();
    console.log(result.status);
    if (result.status === "Invalid") {
      setMessage(result.message);
    } else if (result.status === "Successful") {
      setShowSuccessAlert(true);
      setMessage(result.message);
      setTimeout(() => {
        setShowSuccessAlert(false);
        navigate("/login/loginForm");
      }, 3000);
    } else {
      setMessage(result.message || "An error occurred, please try again!");
    }
  };

  return (
    <div
      className={styles.container}
      style={{ display: "flex", alignItems: "center", gap: "50px" }}
    >
      {showSuccessAlert && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "15px 30px",
            borderRadius: "5px",
            zIndex: 1000,
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            animation: "slideDown 0.5s ease-out",
          }}
        >
          Password changed successfully!
        </div>
      )}
      <div style={{ flex: 1 }}>
        <div className={styles.logo}>POMA</div>

        <div className={styles.loginSection}>
          <h1 className={styles.title}>Reset Password</h1>
          <p className={styles.subtitle}>Enter your new password</p>

          <form onSubmit={onSubmit}>
            {message && (
              <Alert variant="info" className={styles.message}>
                {message}
              </Alert>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <div style={{ position: "relative" }}>
                <i
                  className="fas fa-lock"
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#666",
                  }}
                ></i>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: "35px" }}
                  required
                />
                <i
                  className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#666",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="repassword">Confirm Password</label>
              <div style={{ position: "relative" }}>
                <i
                  className="fas fa-lock"
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#666",
                  }}
                ></i>
                <input
                  type={showRePassword ? "text" : "password"}
                  id="repassword"
                  value={confirmPassword}
                  placeholder="Confirm your password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ paddingLeft: "35px" }}
                  required
                />
                <i
                  className={showRePassword ? "fas fa-eye-slash" : "fas fa-eye"}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#666",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowRePassword(!showRePassword)}
                ></i>
              </div>
            </div>

            <button type="submit" className={styles.loginButton}>
              Reset Password
            </button>

            <div className={styles.registerSection}>
              <p>
                Back to{" "}
                <Link to="/login/loginForm" style={{ textDecoration: "none" }}>
                  <span
                    style={{
                      fontWeight: "500",
                      color: "rgb(235 185 188)",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.color = "rgb(200, 150, 155)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.color = "rgb(235 185 188)")
                    }
                  >
                    Login
                  </span>
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <img
          src={loginImage}
          alt="login"
          style={{
            width: "120%",
            marginLeft: "-15%",
            height: "auto",
            maxHeight: "500px",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
      </div>
    </div>
  );
}

export default ResetPassword;
