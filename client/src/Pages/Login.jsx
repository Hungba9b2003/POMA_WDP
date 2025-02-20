import React from "react";
import styles from "../Styles/Login/Login.module.css";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet";

function Login() {
  return (
    <>
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Jaro&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <div className={styles.login_bg}>
        <Outlet />
      </div>
    </>
  );
}

export default Login;
