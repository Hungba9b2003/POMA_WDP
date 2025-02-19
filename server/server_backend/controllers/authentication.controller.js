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
    const user = await db.Users.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: "User not found!" });
    }

    if (user.status === "inactive") {
      return res.status(401).json({ status: "Please verify your account!" });
    }
    if (user.status === "banned") {
      return res.status(401).json({ status: "You have been banned" });
    }

    const isMatch = await bcrypt.compare(password, user.account.password);
    if (!isMatch) {
      return res.status(401).json({ status: "Invalid password!" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
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
    const { username, email, password, rePassword, phoneNumber } = req.body;

    if (!username || !email || !password || !rePassword || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== rePassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // // Kiểm tra định dạng mật khẩu
    // if (!/^(?=.*[A-Z]).{8,}$/.test(password)) {
    //   return res.status(400).json({
    //     message:
    //       "Password must be at least 8 characters and contain at least one uppercase letter",
    //   });
    // }

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
        phoneNumber,
      },
      status: "inactive",
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const verificationLink = `http://localhost:9999/authentication/verify/${newUser._id}/${token}`;

    // Gửi email
    await sendEmail("verify", email, verificationLink);

    res.status(201).json({
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
  const { username, email } = req.body;
  try {
    const oldUser = await db.Users.findOne({
      username,
      "account.email": email,
    });
    if (!oldUser) {
      return res.status(404).json({ status: "User or Email not found!" });
    }

    const secret = process.env.JWT_SECRET + oldUser.account.password;
    const token = jwt.sign(
      { email: oldUser.account.email, id: oldUser._id },
      secret,
      {
        expiresIn: "10m",
      }
    );

    const link = `http://localhost:3000/resetPassword/${oldUser._id}/${token}`;

    // Gửi email thay đổi mật khẩu
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

  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ status: "Passwords do not match!" });
    }

    const oldUser = await db.Users.findById(id);
    if (!oldUser) {
      return res.status(404).json({ status: "User Not Exists!" });
    }

    const secret = process.env.JWT_SECRET + oldUser.account.password;
    jwt.verify(token, secret);

    const encryptedPassword = await bcrypt.hash(password, 10);
    await db.Users.updateOne(
      { _id: id },
      { $set: { "account.password": encryptedPassword } }
    );

    res.json({ status: "Password change successful!" });
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
