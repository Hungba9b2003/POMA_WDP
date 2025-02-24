import React, { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { useNavigate, Link } from "react-router-dom";
import { Alert } from "react-bootstrap";
import axios from "axios";
import loginImage from "../../assets/login/images/image1.jpg";
import styles from "../../Styles/Login/Login.module.css";

function RegisterForm() {
  const { authentication_API } = useContext(AppContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [message, setMessage] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const register_API = `${authentication_API}/register`;

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage("Please wait...");
    if (password !== repassword) {
      setMessage("Mật khẩu không khớp!");
      return;
    }

    try {
      const { data } = await axios.post(register_API, {
        username,
        email,
        phone,
        password,
        repassword,
      });
      console.log(data);
      if (data.status === "Success") {
        setShowSuccessAlert(true);
        setTimeout(() => {
          setShowSuccessAlert(false);
          navigate("/login/loginForm");
        }, 3000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      setMessage(errorMessage || "Đã xảy ra lỗi trong quá trình đăng ký");
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
          Registration successful! Please check your email to verify your
          account.
        </div>
      )}
      <div style={{ flex: 1 }}>
        <div className={styles.logo}>POMA</div>

        <div className={styles.loginSection}>
          <h1 className={styles.title}>Register</h1>
          <p className={styles.subtitle}>Create new account 🚀</p>

          <form onSubmit={onSubmit}>
            {message && (
              <Alert variant="danger" className={styles.message}>
                {message}
              </Alert>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="username">Username</label>
              <div style={{ position: "relative" }}>
                <i
                  className="fas fa-user"
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
                  placeholder="Enter your username"
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ paddingLeft: "35px" }}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
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
                  type="email"
                  id="email"
                  value={email}
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: "35px" }}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="phone">Phone Number</label>
              <div style={{ position: "relative" }}>
                <i
                  className="fas fa-phone"
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#666",
                  }}
                ></i>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  placeholder="Enter your phone number"
                  onChange={(e) => setPhone(e.target.value)}
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
                  value={repassword}
                  placeholder="Confirm your password"
                  onChange={(e) => setRepassword(e.target.value)}
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
              Register
            </button>

            <div className={styles.registerSection}>
              <p>
                Already have an account?{" "}
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
          alt="register"
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
export default RegisterForm;
