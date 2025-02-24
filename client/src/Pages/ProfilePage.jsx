import React from "react";
import styles from "../Styles/Profile/Profile.module.css";

import { Outlet } from "react-router-dom";
function ProfilePage() {
  return (
    <div>
      <div className={styles.mainContainer}>
        <Outlet />
      </div>
    </div>
  );
}

export default ProfilePage;
