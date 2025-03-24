import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = sessionStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decodedToken = JSON.parse(atob(token.split(".")[1])); // Giải mã payload của JWT
        const userRole = decodedToken.role;

        if (!allowedRoles.includes(userRole)) {
            return <Navigate to="/" replace />;
        }

        return children;
    } catch (error) {
        console.error("Invalid token:", error);
        sessionStorage.removeItem("token");
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;
