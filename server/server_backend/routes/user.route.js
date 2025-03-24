const express = require("express");
const userRouter = express.Router();
const bodyParser = require("body-parser");

const db = require("../models/index");
const { AuthMiddleware } = require("../middlewares");
const { UserController } = require("../controllers");
userRouter.use(bodyParser.json());

const { } = require("../controllers/user.controller");
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
userRouter.get("/all-users", UserController.getAllUser);
// đổi trạng thái tài khoản người dùng
userRouter.put("/change-status/:id", UserController.changeStatus);
userRouter.post(
  "/join-project",
  UserController.joinByCode
);

userRouter.post(
  "/confirm-invite/:projectId/:userId",
  UserController.confirmInvite
);

userRouter.get(
  "/get-user",
  //AuthMiddleware.verifyAccessToken,
  UserController.getUser
);

//api cho admin
//lấy danh sách người dùng

module.exports = userRouter;
