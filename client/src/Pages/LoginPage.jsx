import React from "react";
import styles from "../Styles/Login/Login.module.css";
import { Outlet } from "react-router-dom";

import { HelmetProvider } from "react-helmet-async";

function Login() {
  return (
    <>
      <HelmetProvider >
        <link
          href="https://fonts.googleapis.com/css2?family=Jaro&display=swap"
          rel="stylesheet"
        />
      </HelmetProvider >
      <div className={styles.login_bg}>
        <Outlet />
      </div>
    </>
  );
}

export default Login;
