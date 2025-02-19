import React, { useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { AppContext } from "../../Context/AppContext";
import { useNavigate, Link } from "react-router-dom";
import { Alert } from "react-bootstrap";
import axios from "axios";
import loginImage from "../../assets/login/images/image1.jpg";
import styles from "../../Styles/Login/Login.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function LoginForm() {
  const { authentication_API, setUser } = useContext(AppContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const navigate = useNavigate();
  const login_API = `${authentication_API}/login`;

  const checkTokenExpiration = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const { exp } = jwtDecode(token);
      if (Date.now() >= exp * 1000) {
        localStorage.removeItem("token");
        setMessage("Session expired, please login again");
        setTimeout(() => navigate("/login/loginForm"), 2000);
      }
    }
  };

  useEffect(() => {
    checkTokenExpiration();
  }, []);

  const loginUser = async (username, password) => {
    try {
      const { data } = await axios.post(login_API, { username, password });
      return data;
    } catch (error) {
      throw error;
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await loginUser(username, password);

      if (result.status === "Login successful!" && result.token) {
        if (rememberMe) {
          localStorage.setItem("token", result.token);
        } else {
          sessionStorage.setItem("token", result.token);
        }
        setUser(result.user);
        setShowSuccessAlert(true);
        setTimeout(() => {
          setShowSuccessAlert(false);
          navigate("/home");
        }, 2000);
      } else {
        setMessage("Login failed");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.status;

      switch (errorMessage) {
        case "Please verify your account!":
          setMessage(
            "Please verify your account! Check your email for verification link."
          );
          break;
        case "User not found!":
          setMessage("Username or password is incorrect");
          break;
        case "You have been banned":
          setMessage("Your account has been banned");
          break;
        default:
          setMessage("An unexpected error occurred");
      }
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
          Login Successful!
        </div>
      )}
      <div style={{ flex: 1 }}>
        <div className={styles.logo}>POMA</div>

        <div className={styles.loginSection}>
          <h1 className={styles.title}>Login</h1>
          <p className={styles.subtitle}>Welcome back 👋</p>

          <form onSubmit={onSubmit}>
            {message && (
              <Alert variant="danger" className={styles.message}>
                {message}
              </Alert>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="username">Email</label>
              <div style={{ position: "relative" }}>
                <i
                  className="fas fa-envelope"
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#666",
                  }}
                ></i>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập email của bạn"
                  style={{ paddingLeft: "35px" }}
                  required
                />
              </div>
            </div>

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
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu của bạn"
                  style={{ paddingLeft: "35px" }}
                  required
                />
              </div>
            </div>

            <div className={styles.options}>
              <label className={styles.rememberMe}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <span>Remember me</span>
              </label>
              <Link to="/login/forgotPass" className={styles.forgotPassword}>
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className={styles.loginButton}>
              Login
            </button>

            <div className={styles.registerSection}>
              <p>
                Not registered yet?{" "}
                <Link
                  to="/login/registerForm"
                  style={{ textDecoration: "none" }}
                >
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
                    Register
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

export default LoginForm;
