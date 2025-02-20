const express = require("express");
const authRouter = express.Router();
const { AuthController } = require("../controllers");
const { AuthMiddleware } = require("../middlewares");

// Middleware để phân tích body JSON
authRouter.use(express.json());

// Đăng nhập
authRouter.post("/login", AuthController.login);

// Đăng ký
authRouter.post("/register", AuthController.register);

// Quên mật khẩu
authRouter.post("/forgot-password", AuthController.forgotPassword);

//lấy người dùng bằng id
authRouter.get(
  "/get-user",
  AuthMiddleware.verifyAccessToken,
  AuthController.getUserById
);

//lấy bằng email
authRouter.get("/getByEmail", AuthController.getUserByEmail);

// đặt lại mật khẩu
authRouter.post("/reset-password/:id/:token", AuthController.resetPassword);
//token để reset,verify với token để đăng nhâp đăng đang là 2 cái khác nhau

// Xác minh tài khoản
authRouter.get("/verify/:id/:token", AuthController.verifyAccount);

module.exports = authRouter;
