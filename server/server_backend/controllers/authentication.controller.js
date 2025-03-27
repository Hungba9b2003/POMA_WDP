const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const db = require("../models/index");

// Hàm gửi email
async function sendEmail(type, email, link) {
  try {
    console.log("Sending email to:", email);
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let subject, htmlContent;

    if (type === "verify") {
      subject = "🔹 Xác nhận tài khoản của bạn";
      htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #4CAF50; text-align: center;">Chào mừng bạn đến với dịch vụ của chúng tôi! 🎉</h2>
            <p style="font-size: 16px; text-align: center;">Cảm ơn bạn đã đăng ký. Vui lòng nhấn vào nút bên dưới để xác minh tài khoản:</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${link}" style="background-color: #4CAF50; color: white; padding: 10px 20px; font-size: 18px; text-decoration: none; border-radius: 5px;">
                Xác minh tài khoản
              </a>
            </div>
            <p style="font-size: 14px; text-align: center; color: #777;">Nếu bạn không đăng ký tài khoản, hãy bỏ qua email này.</p>
            <hr>
            <p style="text-align: center; font-size: 12px; color: #888;">© 2025 Công ty của bạn. Mọi quyền được bảo lưu.</p>
          </div>`;
    } else if (type === "reset") {
      subject = "🔹 Đặt lại mật khẩu";
      htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #FF5733; text-align: center;">Yêu cầu đặt lại mật khẩu 🔐</h2>
            <p style="font-size: 16px; text-align: center;">Chúng tôi nhận được yêu cầu đặt lại mật khẩu của bạn. Nhấn vào nút bên dưới để tiếp tục:</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${link}" style="background-color: #FF5733; color: white; padding: 10px 20px; font-size: 18px; text-decoration: none; border-radius: 5px;">
                Đặt lại mật khẩu
              </a>
            </div>
            <p style="font-size: 14px; text-align: center; color: #777;">Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
            <hr>
            <p style="text-align: center; font-size: 12px; color: #888;">© 2025 Công ty của bạn. Mọi quyền được bảo lưu.</p>
          </div>`;
    } else if (type === "join") {
      subject = "🔹Mời vào nhóm";
      htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #FF5733; text-align: center;">Tham gia nhóm</h2>
            <p style="font-size: 16px; text-align: center;">Bạn được mời tham gia dự án mới. Nhấn vào nút bên dưới để tiếp tục:</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${link}" style="background-color: #FF5733; color: white; padding: 10px 20px; font-size: 18px; text-decoration: none; border-radius: 5px;">
                Tham gia
              </a>
            </div>
            <p style="font-size: 14px; text-align: center; color: #777;">Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
            <hr>
            <p style="text-align: center; font-size: 12px; color: #888;">© 2025 Công ty của bạn. Mọi quyền được bảo lưu.</p>
          </div>`;
    } else {
      throw new Error("Invalid email type");
    }

    const mailOptions = {
      from: `"POMA" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// Hàm đăng nhập
async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await db.Users.findOne({ "account.email": email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    if (!/^(?=.*[A-Z]).{8,}$/.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and contain at least one uppercase letter",
      });
    }

    if (user.status === "inactive") {
      return res.status(401).json({ message: "Please verify your account!" });
    }
    if (user.status === "banned") {
      return res.status(401).json({ message: "You have been banned" });
    }

    const isMatch = await bcrypt.compare(password, user.account.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password or email!" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ status: "Login successful!", user, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
}

// Hàm đăng ký
async function register(req, res, next) {
  try {
    const { username, email, password, repassword, phone } = req.body;

    if (!username || !email || !password || !repassword || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== repassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Kiểm tra định dạng mật khẩu
    if (!/^(?=.*[A-Z]).{8,}$/.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and contain at least one uppercase letter",
      });
    }

    const existingUserName = await db.Users.findOne({ username });
    if (existingUserName) {
      return res.status(409).json({ message: "Username already in use" });
    }

    const existingUserEmail = await db.Users.findOne({
      "account.email": email,
    });
    if (existingUserEmail) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new db.Users({
      username,
      account: {
        email,
        password: hashedPassword,
      },
      profile: {
        phoneNumber: phone,
      },
      status: "inactive",
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const verificationLink = `http://${process.env.HOSTNAME}:${process.env.PORT_FRONT_END}/login/verify/${newUser._id}/${token}`;

    // Gửi email
    await sendEmail("verify", email, verificationLink);

    res.status(201).json({
      status: "Success",
      message:
        "User registered successfully. Check your email for verification link!",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

// Hàm lấy người dùng
async function getUserById(req, res) {
  const { id } = req.body;
  try {
    const user = await db.Users.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

//lấy bằng email
// Controller function to get user by email
async function getUserByEmail(req, res) {
  const { email } = req.body;
  try {
    const user = await db.Users.findOne({ "account.email": email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get user by email error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

//hàm xác minh
async function verifyAccount(req, res) {
  const { id, token } = req.params;

  try {
    const user = await db.Users.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const secret = process.env.JWT_SECRET;
    jwt.verify(token, secret);

    // Cập nhật trạng thái thành active
    user.status = "active";
    await user.save();

    res.json({ message: "Account verified successfully!" });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
}

// Hàm quên mật khẩu
async function forgotPassword(req, res) {
  const { email } = req.body;
  try {
    const oldUser = await db.Users.findOne({ "account.email": email });
    if (!oldUser) {
      return res.status(404).json({
        status: "User or Email not found!",
        message: "User or Email not found!",
      });
    }

    const secret = process.env.JWT_SECRET + oldUser.account.password;
    const token = jwt.sign(
      { email: oldUser.account.email, id: oldUser._id },
      secret,
      { expiresIn: "10m" }
    );

    // Cập nhật token mới vào DB
    await db.Users.updateOne(
      { _id: oldUser._id },
      { $set: { resetToken: token } },
      { strict: false }
    );

    const link = `http://localhost:3000/login/resetPassword/${oldUser._id}/${token}`;
    await sendEmail("reset", email, link);
    res.json({ status: "Email sent, check your inbox!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Something went wrong!" });
  }
}

// Hàm đặt lại mật khẩu
async function resetPassword(req, res) {
  const { id, token } = req.params;
  const { password, confirmPassword } = req.body;
  console.log("password: " + password);
  try {
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: "Invalid",
        message: "Passwords do not match",
      });
    }

    const oldUser = await db.Users.findById(id);
    if (oldUser.resetToken != token) {
      return res.status(400).json({
        status: "Invalid",
        message: "Reset form has been disabled! PLease send email again",
      });
    }
    if (!oldUser) {
      return res
        .status(404)
        .json({ status: "User Not Exists!", message: "User Not Exists!" });
    }

    const secret = process.env.JWT_SECRET + oldUser.account.password;
    try {
      const decoded = jwt.verify(token, secret);
      console.log("Token hợp lệ:", decoded);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          status: "error",
          message: "Expired reset form! please send email again ",
        });
      } else {
        return res.status(401).json({
          status: "error",
          message: err.message,
        });
      }
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = await db.Users.findOne({ _id: id });
    const newStatus = user.status === "deactive" ? "active" : user.status;

    await db.Users.updateOne(
      { _id: id },
      {
        $set: {
          "account.password": encryptedPassword,
          status: newStatus,
        },
      }
    );

    res.status(200).json({
      status: "Successful",
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Something went wrong!" });
  }
}

const authenticationController = {
  sendEmail,
  login,
  register,
  getUserById,
  forgotPassword,
  resetPassword,
  verifyAccount,
  getUserByEmail,
};

module.exports = authenticationController;
