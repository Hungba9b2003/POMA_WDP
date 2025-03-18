import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const RoleTest = () => {
    const [userId, setUserId] = useState('');

    // Hàm lấy userId từ token
    const getUserIdFromToken = () => {
        const token = localStorage.getItem("token");
        if (!token) return "Unknown";
        try {
            const decodedToken = jwtDecode(token);
            console.log("Decoded Token:", decodedToken);
            return decodedToken.userId || decodedToken.id || "Unknown";
        } catch (error) {
            console.error("Lỗi giải mã token:", error);
            return "Unknown";
        }
    };

    useEffect(() => {
        setUserId(getUserIdFromToken());
    }, []);

    return (
        <div>
            <h3>User ID: {userId}</h3>
        </div>
    );
};

export default RoleTest;
