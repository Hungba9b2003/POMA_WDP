const express = require("express");
const projectRouter = express.Router();
const bodyParser = require("body-parser");
const db = require("../models/index");
const { AuthMiddleware, ProjectMiddleware } = require("../middlewares");
//import cả controller của task lẫn projetc vào đây
const {ProjectController} = require("../controllers/index")

projectRouter.use(bodyParser.json());

// api xử lý logic bên project.controller
projectRouter.post(
    "/:projectId/updatePremium",
)
// tao dự án
projectRouter.post(
    "/create",ProjectController.createProject
)
//lấy toàn bộ dự án
projectRouter.get(
    "/get-project",ProjectController.getAllProjects
)
// tìm dự án
projectRouter.get(
    "/:projectId/get-project",ProjectController.getProjectById
)
// chỉnh sửa thông tin dự án chỉ đinh
projectRouter.put(
    "/:projectId/edit",ProjectController.updateProject
)
// delete dự án
projectRouter.delete(
    "/:projectId/delete",ProjectController.deleteProject
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
    "/:projectId/get-member",ProjectController.getProjectMembers
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
    "/:projectId/tasks/get-all",ProjectController.getAllTask
)
// tạo task
projectRouter.post(
    "/:projectId/tasks/create",ProjectController.createTask
)
// chỉnh sửa task
projectRouter.put(
    "/:projectId/tasks/:taskId/edit",ProjectController.editTask
)
// xoá task
projectRouter.delete(
    "/:projectId/tasks/:taskId/delete",ProjectController.deleteTask
)



//Subtask bên trong Task có list subtask, xem model nếu không rõ

//lấy subtask
projectRouter.get(
    "/:projectId/tasks/:taskId/subTasks/get-all",ProjectController.getAllSubTask
)
// tạo subtas
projectRouter.post(
    "/:projectId/tasks/:taskId/subTasks/create",ProjectController.addSubTask
)
// chỉnh sửa subtask
projectRouter.put(
    "/:projectId/tasks/:taskId/subTasks/:subTaskId/edit",ProjectController.editSubTask
)
// xoá subtask
projectRouter.delete(
    "/:projectId/tasks/:taskId/subTasks/:subTaskId/delete",ProjectController.deleteSubTask
)

// Comment
projectRouter.get(
    "/:projectId/tasks/:taskId/comments/get-all",
)
projectRouter.post(
    "/:projectId/tasks/:taskId/comments/create",
)
projectRouter.put(
    "/:projectId/tasks/:taskId/comments/:commentId/edit",
)
projectRouter.delete(
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
