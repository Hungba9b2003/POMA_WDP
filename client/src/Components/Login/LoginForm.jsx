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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const [messageS, setMessageS] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
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

  const loginUser = async (email, password) => {
    try {
      const { data } = await axios.post(login_API, { email, password });
      return data;
    } catch (error) {
      throw error;
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setMessageS("");
    try {
      const result = await loginUser(email, password);
      console.log(result);
      if (result.status === "Login successful!" && result.token) {
        setMessageS("Login successful!");
        const expiresInDays = 30; // Thời gian hết hạn nếu chọn "Remember Me" (30 ngày)
        const expirationTime =
          new Date().getTime() + expiresInDays * 24 * 60 * 60 * 1000; // Tính timestamp hết hạn

        if (rememberMe) {
          localStorage.setItem("token", result.token);
          localStorage.setItem("token_expiration", expirationTime); // Lưu thời gian hết hạn
        } else {
          sessionStorage.setItem("token", result.token);
        }

        setUser(result.user);
        setShowSuccessAlert(true);
        console.log(result);
        setTimeout(() => {
          setShowSuccessAlert(false);
          navigate("/home");
        }, 2000);
      } else {
        setMessage("Login failed");
      }
    } catch (error) {
      setMessage(error.response?.data?.message);
    }
  };

  return (

    <div
      className={styles.container}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "50px",
        minWidth: "800px",
      }}
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
            {messageS && (
              <Alert variant="success" className={styles.message}>
                {messageS}
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
                    top: "40%",
                    transform: "translateY(-50%)",
                    color: "#666",
                  }}
                ></i>
                <input
                  type="text"
                  id="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    top: "40%",
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
                    top: "40%",
                    transform: "translateY(-50%)",
                    color: "#666",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
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

      <div className={styles.image_container} style={{ flex: 1 }}>
        <div>
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
    </div>
  );
}

export default LoginForm;
