const db = require("../models/index");

const getProfile = async (req, res) => {
    try {
        const userId = req.payload.id; // Lấy ID từ token (middleware gán vào req.user)
        const user = await db.Users.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

module.exports = { getProfile };
