import React, { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { useNavigate, Link } from "react-router-dom";
import { Alert } from "react-bootstrap";
import axios from "axios";
import loginImage from "../../assets/login/images/image1.jpg";
import styles from "../../Styles/Login/Login.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function ForgotPassword() {
  const { API } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const navigate = useNavigate();
  const forgotPass_API = `${API}/authentication/forgot-password`;

  const requestPasswordReset = async (email) => {
    try {
      // Sử dụng axios.post thay vì axios.get và truyền email trong body
      const { data } = await axios.post(forgotPass_API, { email });
      return data;
    } catch (error) {
      throw error;
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await requestPasswordReset(email);
      console.log(result);
      if (result.status === "Email sent, check your inbox!") {
        setShowSuccessAlert(true);
        setMessage("Please check your email to reset your password");
        setTimeout(() => {
          setShowSuccessAlert(false);
          navigate("/login/loginForm");
        }, 3000);
      }
    } catch (error) {
      console.log(error.message);
      const errorMessage = error.response?.data?.message;
      setMessage(errorMessage || "An error occurred while resetting password");

      //   setMessage("Email does not exist in the system");
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
            background: "linear-gradient(90deg, #28a745, #218838)",
            color: "white",
            padding: "20px 40px",
            borderRadius: "8px",
            zIndex: 1000,
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            fontSize: "18px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            opacity: 0,
            animation: "fadeInBounce 0.8s ease-out forwards",
          }}
        >
          ✅ Password reset request successful!
        </div>
      )}

      <style>
        {`
    @keyframes fadeInBounce {
      0% {
        opacity: 0;
        transform: translateX(-50%) translateY(-30px);
      }
      50% {
        opacity: 0.7;
        transform: translateX(-50%) translateY(5px);
      }
      100% {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }
  `}
      </style>

      <div style={{ flex: 1 }}>
        <div className={styles.logo}>POMA</div>

        <div className={styles.loginSection}>
          <h1 className={styles.title}>Forgot Password</h1>
          <p className={styles.subtitle}>Enter your email to reset password</p>

          <form onSubmit={onSubmit}>
            {message && (
              <Alert variant="info" className={styles.message}>
                {message}
              </Alert>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <div style={{ position: "relative" }}>
                <i
                  className="fas fa-envelope"
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-80%)",
                    color: "#666",
                  }}
                ></i>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  style={{ paddingLeft: "35px" }}
                  required
                />
              </div>
            </div>

            <button type="submit" className={styles.loginButton}>
              Send Request
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

export default ForgotPassword;
