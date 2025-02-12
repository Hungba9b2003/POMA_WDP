const express = require("express");
const authRouter = express.Router();
const { AuthMiddleware } = require("../middlewares");

// Middleware để phân tích body JSON
authRouter.use(express.json());

// Đăng nhập
authRouter.post("/login",);

// Đăng ký
authRouter.post("/register",);

// Quên mật khẩu
authRouter.post("/forgot-password",);

//lấy bằng email
authRouter.post("/getByEmail",);

// đặt lại mật khẩu
authRouter.post("/reset-password/:id/:token",);
//token để reset,verify với token để đăng nhâp đăng đang là 2 cái khác nhau

// Xác minh tài khoản
authRouter.get("/verify/:id/:token",);

module.exports = authRouter;
