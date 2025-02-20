const db = require("../models");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const getProfile = async (req, res) => {
    try {
        // const userId = req.payload.id; // Lấy ID từ token (middleware gán vào req.user)
        const userId = req.body.userId;
        console.log(userId);
        const user = await db.Users.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const userId = req.body.userId; // Lấy ID từ payload JWT
        const { username, email, phoneNumber, avatar } = req.body;

        // Kiểm tra nếu không có dữ liệu gửi lên
        if (!username && !email && !phoneNumber && !avatar) {
            return res.status(400).json({ success: false, message: "No data provided for update" });
        }

        // Tạo object cập nhật, chỉ thêm các trường có giá trị
        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData["account.email"] = email;
        if (phoneNumber) updateData["profile.phoneNumber"] = phoneNumber;
        if (avatar) updateData["profile.avatar"] = avatar;

        // Cập nhật thông tin user
        const updatedUser = await db.Users.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-account.password"); // Không trả về password

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        console.error("Error updating profile:", error);
        next(error);
    }
};

const getAllUser = async (req, res, next) => {
    try {
        const users = await db.Users.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).json({ error: { status: 500, message: "Failed to fetch users" } });
        // next(error); 
    }
};
const updateStatus = async (req, res, next) => {
    try {
        const userId = req.params.id; // Lấy ID từ URL
        const { status } = req.body;

        // Danh sách trạng thái hợp lệ
        const validStatuses = ["inactive", "active", "banned"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }

        // Cập nhật trạng thái của user
        const updatedUser = await db.Users.findByIdAndUpdate(
            userId,
            { $set: { status } },
            { new: true, runValidators: true }
        ).select("-account.password"); // Không trả về mật khẩu

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "Status updated successfully", data: updatedUser });
    } catch (error) {
        console.error("Error updating status:", error);
        next(error);
    }
};

module.exports = { getProfile, updateProfile, getAllUser, updateStatus };
