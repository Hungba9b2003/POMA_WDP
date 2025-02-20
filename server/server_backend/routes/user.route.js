const express = require("express");
const userRouter = express.Router();
const bodyParser = require("body-parser");

const db = require("../models/index");
const { AuthMiddleware } = require("../middlewares");
userRouter.use(bodyParser.json());


const {getProfile, updateProfile, getAllUser, changePassword } = require("../controllers/user.controller");

//lấy profile 
userRouter.get("/get-profile", getProfile);
//update profile
userRouter.put("/update-profile", updateProfile);
// đổi mật khẩu
userRouter.put("/change-password", changePassword);
// lấy danh sách người dùng
userRouter.get("/all-users", getAllUser);
// đổi trạng thái tài khoản người dùng
userRouter.put("/change-status/:id", AuthMiddleware.verifyAccessToken,);


//api cho admin
//lấy danh sách người dùng
userRouter.get("/all-users",);

module.exports = userRouter
