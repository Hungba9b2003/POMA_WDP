const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/index");

// Lấy danh sách user
async function getAllUsers(req, res) {
  try {
    const userId = req.payload.id;
    // console.log(userId);
    const users = await db.Users.find({ _id: { $ne: userId } });
    res.json({ status: "Success", users });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ error: error.message });
  }
}

async function getAllProject(req, res) {
  try {
    // console.log(userId);
    const projects = await db.Projects.find().populate(
      "members._id",
      "username _id"
    );
    res.json({ status: "Success", projects });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ error: error.message });
  }
}
// Cập nhật trạng thái user (ban / unban)
async function updateUserStatus(req, res) {
  const { userId, status } = req.body;
  const allowedStatuses = ["active", "banned"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const user = await db.Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = status;
    await user.save();

    res.json({ message: `User status updated to ${status}`, user });
  } catch (error) {
    console.error("Update user status error:", error);
    res.status(500).json({ error: error.message });
  }
}

const adminController = {
  getAllUsers,
  updateUserStatus,
  getAllProject,
};

module.exports = adminController;
