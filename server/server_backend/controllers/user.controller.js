const mongoose = require("mongoose");
const db = require("../models/index");
const bcrypt = require("bcrypt");

const getProfile = async (req, res, next) => {
  const {userId} = req.body;
  try {
    console.log(userId);
    const user = await db.Users.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  const userId = req.payload.id;
  try {
    const newProfile = {
      username: req.body.username,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      avatar: req.body.avatar,
    };

    console.log("Received profile data:", newProfile); // Kiểm tra dữ liệu nhận từ frontend

    const user = await db.Users.findByIdAndUpdate(
      userId,
      {
        $set: {
          "profile.phoneNumber": newProfile.phoneNumber,
          username: newProfile.username,
          "account.email": newProfile.email,
          "profile.avatar": newProfile.avatar,
        },
      },
      { new: true, runValidators: true }
    );

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating profile:", error);
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  const userId = req.payload.id; // Get the user ID from the request payload
  const { oldPassword, newPassword, confirmPassword } = req.body; // Destructure the request body

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
      return res
        .status(400)
        .json({ message: "New password and confirmation do not match" });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in a single operation
    await db.Users.findOneAndUpdate(
      { _id: userId }, // Filter by user ID
      { "account.password": hashedNewPassword }, // Update the password
      { new: true } // Return the updated document
    );

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    next(error); // Pass errors to the error handling middleware
  }
};
const changeStatus = async (req, res, next) => {
    try {
        const userId = req.payload.id; // Lấy ID từ URL
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


module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  changeStatus,
  getAllUser,
};
