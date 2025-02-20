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

const changePassword = async (req, res, next) => {
    const userId = req.body.userId;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    try {
        // Check if the user exists and validate the old password
        const user = await db.Users.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the old password is correct
        const isMatch = await bcrypt.compare(oldPassword, user.account.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        // Validate the new password and confirmation
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "New password and confirmation do not match" });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password in a single operation
        await db.Users.findOneAndUpdate(
            { _id: userId }, // Filter by user ID
            { 'account.password': hashedNewPassword }, // Update the password
            { new: true } // Return the updated document
        );

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        next(error); // Pass errors to the error handling middleware
    }
};

module.exports = { getProfile, updateProfile, getAllUser, changePassword };
