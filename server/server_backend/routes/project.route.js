const express = require("express");
const projectRouter = express.Router();
const bodyParser = require("body-parser");
const db = require("../models/index");
const { AuthMiddleware } = require("../middlewares");
const { TaskController } = require("../controllers");
//import cả controller của task lẫn projetc vào đây
const { ProjectController } = require("../controllers/index")

projectRouter.use(bodyParser.json());

// api xử lý logic bên project.controller
projectRouter.post("/:projectId/updatePremium", ProjectController.updatePremium);
// tao dự án
projectRouter.post(
    "/create", ProjectController.createProject,
)
//lấy toàn bộ dự án của user
projectRouter.post(
    "/get-project", AuthMiddleware.verifyAccessToken, ProjectController.getAllProjects,)

// tìm dự án
projectRouter.get(
    "/:projectId/get-project", ProjectController.getProjectById
)
// chỉnh sửa thông tin dự án chỉ đinh
projectRouter.put(
    "/:projectId/edit", ProjectController.updateProject
)
// delete dự án
projectRouter.delete(
    "/:projectId/delete", ProjectController.deleteProject
)
// update status dự án
projectRouter.put(
    "/update-status/:projectId", AuthMiddleware.verifyAccessToken, ProjectController.updateProjectStatus)
// vào project bằng code
projectRouter.post("/join-by-code");
//vào dự án bằng link email
projectRouter.post("/:projectId/invite");
// rời dự án
projectRouter.delete("/:projectId/out");
// lấy danh sách thành viên dự án
projectRouter.get(
    "/:projectId/get-member", AuthMiddleware.verifyAccessToken, ProjectController.getProjectMembers
)
// set group member role
projectRouter.put("/:projectId/member/:memberId/set-role", ProjectController.setProjectMemberRole);
// đá thành viên ra khỏi dự án
projectRouter.delete("/:projectId/member/:memberId/delete", ProjectController.deleteProjectMember);
// lấy thông tin thành viên đang có trong dự án
projectRouter.get("/user/:projectId/get-user-role", ProjectController.getUserRole);

//CRUD không gian làm việc, hiển thị các task theo từng cột, dùng thuộc tính status phân cột
projectRouter.post("/:projectId/create-workspace");

projectRouter.put("/:projectId/edit-workspace");

projectRouter.delete("/:projectId/delete-workspace");

// api xử lý logic bên task.controller
// lấy task
projectRouter.get("/:projectId/tasks/get-all", TaskController.getAllTasks);
// tạo task
projectRouter.post("/:projectId/tasks/create", AuthMiddleware.verifyAccessToken, TaskController.createTask);
// chỉnh sửa task
projectRouter.put("/:projectId/tasks/:taskId/edit", AuthMiddleware.verifyAccessToken, TaskController.editTask);
// xoá task
projectRouter.delete("/:projectId/tasks/:taskId/delete", AuthMiddleware.verifyAccessToken, TaskController.deleteTask);

//Subtask bên trong Task có list subtask, xem model nếu không rõ

//lấy subtask
projectRouter.get("/:projectId/tasks/:taskId/subTasks/get-all", AuthMiddleware.verifyAccessToken, TaskController.getAllSubTasks);
// tạo subtas
projectRouter.post("/:projectId/tasks/:taskId/subTasks/create", AuthMiddleware.verifyAccessToken, TaskController.addSubTask);
// chỉnh sửa subtask
projectRouter.put("/:projectId/tasks/:taskId/subTasks/:subTaskId/edit", AuthMiddleware.verifyAccessToken, TaskController.editSubTask);
// xoá subtask
projectRouter.delete("/:projectId/tasks/:taskId/subTasks/:subTaskId/delete", AuthMiddleware.verifyAccessToken, TaskController.deleteSubTask);

// Lấy tất cả comment của task trong project
projectRouter.get(
    "/:projectId/tasks/:taskId/comments/get-all", TaskController.getAllComments
);

// Thêm comment vào task trong project
projectRouter.post(
    "/:projectId/tasks/:taskId/comments/create", AuthMiddleware.verifyAccessToken, TaskController.addComment
);

// Sửa comment trong task của project
projectRouter.put(
    "/:projectId/tasks/:taskId/comments/:commentId/edit", AuthMiddleware.verifyAccessToken, TaskController.editComment
);

// Xóa comment trong task của project
projectRouter.delete(
    "/:projectId/tasks/:taskId/comments/:commentId/delete", AuthMiddleware.verifyAccessToken, TaskController.deleteComment
);

projectRouter.get("/:projectId/inviteMember", ProjectController.getInviteMembers);

// api cho admin
//tổng số project
projectRouter.get("/count", ProjectController.countProjects);
//tổng số project premium
projectRouter.get("/count-premium", ProjectController.countPremiumProjects);

projectRouter.post("/leave", ProjectController.leaveProjects);


module.exports = projectRouter;
