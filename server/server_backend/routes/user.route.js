const express = require("express");
const userRouter = express.Router();
const bodyParser = require("body-parser");

const db = require("../models/index");
const { AuthMiddleware } = require("../middlewares");
const { UserController } = require("../controllers");
userRouter.use(bodyParser.json());

const {} = require("../controllers/user.controller");
//lấy profile
userRouter.get(
  "/get-profile",
  AuthMiddleware.verifyAccessToken,
  UserController.getProfile
);
//update profile
userRouter.put(
  "/update-profile",
  AuthMiddleware.verifyAccessToken,
  UserController.updateProfile
);
// đổi mật khẩu
userRouter.put(
  "/change-password",
  AuthMiddleware.verifyAccessToken,
  UserController.changePassword
);
// lấy danh sách người dùng
userRouter.get("/all-users", AuthMiddleware.verifyAccessToken);
// đổi trạng thái tài khoản người dùng
userRouter.put("/change-status/:id", AuthMiddleware.verifyAccessToken);

//api cho admin
//lấy danh sách người dùng
userRouter.get("/all-users");

module.exports = userRouter;
