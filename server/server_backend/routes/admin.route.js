const express = require("express");
const adminRouter = express.Router();
const { AdminController } = require("../controllers");
const { AuthMiddleware } = require("../middlewares");

// Middleware để phân tích body JSON
adminRouter.use(express.json());

adminRouter.get(
  "/getUserList",
  AuthMiddleware.verifyAccessToken,
  AuthMiddleware.verifyAdmin,
  AdminController.getAllUsers
);
adminRouter.post(
  "/updateUserStatus",
  AuthMiddleware.verifyAccessToken,
  AuthMiddleware.verifyAdmin,
  AdminController.updateUserStatus
);
adminRouter.get(
  "/getAllProjectList",
  // AuthMiddleware.verifyAccessToken,
  // AuthMiddleware.verifyAdmin,
  AdminController.getAllProject
);

module.exports = adminRouter;
