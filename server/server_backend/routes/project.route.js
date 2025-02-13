const express = require("express");
const projectRouter = express.Router();
const bodyParser = require("body-parser");
const db = require("../models/index");
const { AuthMiddleware, GroupMiddleware } = require("../middlewares");
//import cả controller của task lẫn projetc vào đây


projectRouter.use(bodyParser.json());

// api xử lý logic bên project.controller
projectRouter.post(
    "/:projectId/updatePremium",
)
// tao dự án
projectRouter.post(
    "/create",
)
//lấy toàn bộ dự án
projectRouter.get(
    "/get-project",
)
// tìm dự án
projectRouter.get(
    "/:projectId/get-project",
)
// chỉnh sửa thông tin dự án chỉ đinh
projectRouter.put(
    "/:projectId/edit",
)
// delete dự án
projectRouter.delete(
    "/:projectId/delete",
)
// vào project bằng code
projectRouter.post(
    "/join-by-code",
)
//vào dự án bằng link email
projectRouter.post('/:projectId/invite',
);
// rời dự án
projectRouter.delete(
    "/:projectId/out",
)
// lấy danh sách thành viên dự án
projectRouter.get(
    "/:projectId/get-member",
)
// set group member role
projectRouter.put(
    "/:projectId/member/:memberId/set-role",
)
// đá thành viên ra khỏi dự án
projectRouter.delete
    ("/:projectId/member/:memberId/delete",

    )
// lấy thông tin thành viên đang có trong dự án
projectRouter.get(
    "/user/:projectId/get-user-role",
)



//CRUD không gian làm việc, hiển thị các task theo từng cột, dùng thuộc tính status phân cột
projectRouter.post(
    "/:projectId/create-workspace",
)

projectRouter.put(
    "/:projectId/edit-workspace",
)

projectRouter.delete(
    "/:projectId/delete-workspace",
)



// api xử lý logic bên task.controller
// lấy task 
projectRouter.get(
    "/:projectId/tasks/get-all",
)
// tạo task
projectRouter.post(
    "/:projectId/tasks/create",
)
// chỉnh sửa task
projectRouter.put(
    "/:projectId/tasks/:taskId/edit",
)
// xoá task
projectRouter.delete(
    "/:projectId/tasks/:taskId/delete",
)



//Subtask bên trong Task có list subtask, xem model nếu không rõ

//lấy subtask
projectRouter.get(
    "/:projectId/tasks/:taskId/subTasks/get-all",
)
// tạo subtas
projectRouter.post(
    "/:projectId/tasks/:taskId/subTasks/create",
)
// chỉnh sửa subtask
projectRouter.put(
    "/:projectId/tasks/:taskId/subTasks/:subTaskId/edit",
)
// xoá subtask
projectRouter.delete(
    "/:projectId/tasks/:taskId/subTasks/:subTaskId/delete",
)

// Comment
groupRouter.get(
    "/:projectId/tasks/:taskId/comments/get-all",
)
groupRouter.post(
    "/:projectId/tasks/:taskId/comments/create",
)
groupRouter.put(
    "/:projectId/tasks/:taskId/comments/:commentId/edit",
)
groupRouter.delete(
    "/:projectId/tasks/:taskId/comments/:commentId/delete",
)



// api cho admin
//tổng số project
projectRouter.get(
    "/count",
)
//tổng số project premium
projectRouter.get(
    "/count-premium",
)


module.exports = projectRouter
