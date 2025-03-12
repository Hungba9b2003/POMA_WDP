const db = require("../models");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const morgan = require("morgan");
const createHttpErrors = require("http-errors");
const mongoose = require('mongoose');


//const authenticationController = require("./authentication.controller");
async function getAllTasks(req, res, next) {
  try {
    const { projectId } = req.params;

    // Lấy danh sách task từ project
    const project = await db.Projects.findById(projectId).lean();
    if (!project || !project.tasks.length) {
      return res
        .status(404)
        .json({ error: { status: 404, message: "No tasks found" } });
    }

    // Populate dữ liệu trong task
    const tasks = await db.Tasks.find({ _id: { $in: project.tasks } })
      .populate("assignee", "username profile.avatar") // Lấy thông tin người thực hiện
      .populate("reviewer", "username profile.avatar") // Lấy thông tin người review
      .populate("comments.user", "username profile.avatar") // Lấy thông tin user trong comments
      .populate("subTasks.assignee", "username profile.avatar") // Lấy thông tin user của subTasks
      .sort({ taskNumber: 1 })
      .lean(); // Chuyển đổi sang object thường

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
}

async function createTask(req, res, next) {
  try {
    const { id } = req.payload;
    const { projectId } = req.params;
    const project = await db.Projects.findOne({ _id: projectId });
    // const role = project.memberRole(id);
    // console.log(role);
    if (!project) {
      return res
        .status(404)
        .json({ error: { status: 404, message: "Project not found" } });
    }
    const newTask = {
      taskNumber: (project?.tasks?.length || 0) + 1, // Kiểm tra tránh lỗi undefined
      taskName: req.body.taskName,
      description: req.body.description,
      reviewer: id,
      assignee: id,
      deadline: req.body.deadline,
      status: req.body.status,
    };
    console.log(newTask);
    const newTasks = await db.Tasks.create(newTask);
    if (!newTasks) {
      return res.status(500).json({ error: "Task creation failed" });
    }
    const updatedProject = await db.Projects.findByIdAndUpdate(
      projectId,
      { $push: { tasks: newTasks._id } },
      { new: true, runValidators: true }
    );
    console.log(newTasks);
    if (!updatedProject) {
      return res
        .status(500)
        .json({ error: "Failed to update project with new task" });
    }

    res.status(201).json(newTasks);
  } catch (error) {
    next(error);
  }
}

async function editTask(req, res, next) {
    try {
        const { projectId, taskId } = req.params;
        const assigneeId = req.body.assignee;
        const project = await db.Projects.findOne({ _id: projectId });

        if (!project) {
            return res.status(404).json({ error: { status: 404, message: "Project not found" } });
        }

        const task = await db.Tasks.findOne({ _id: taskId })
            .populate('assignee', 'name email role avatar')  // Populate assignee
            .populate('reviewer', 'name email role avatar'); // Populate reviewer

    if (!task) {
      return res
        .status(404)
        .json({ error: { status: 404, message: "Task not found" } });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ error: { status: 400, message: "Input is required" } });
    }

        const updateFields = { updatedAt: new Date() };
        if (req.body.taskName) updateFields.taskName = req.body.taskName;
        if (req.body.description) updateFields.description = req.body.description;
        if (req.body.reviewer) updateFields.reviewer = req.body.reviewer;
        if (assigneeId) {
            updateFields.assignee = assigneeId;

            // Gọi hàm createTeam để tạo team mới cho assignee
            const newTeam = await createTeam(projectId, taskId, assigneeId);
            updateFields.team = newTeam;  // Thêm team vào updateFields (nếu cần)
        }

        if (req.body.deadline) updateFields.deadline = req.body.deadline;
        if (req.body.status) updateFields.status = req.body.status;

        // Cập nhật task với assignee mới
        await db.Tasks.updateOne(
            { _id: taskId },
            { $set: updateFields },
            { runValidators: true, isNew: false }
        );

    // Lấy lại task sau khi update để gửi về client
    const updatedTask = await db.Tasks.findOne({ _id: taskId })
      .populate("assignee")
      .populate("reviewer");

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
}

async function deleteTask(req, res, next) {
  try {
    const { projectId, taskId } = req.params;
    const project = await db.Projects.findOne({ _id: projectId });
    if (!project) {
      return res
        .status(404)
        .json({ error: { status: 404, message: "Project not found" } });
    }
    const task = project.tasks.find((t) => t._id.equals(taskId));
    if (!task) {
      return res
        .status(404)
        .json({ error: { status: 404, message: "Task not found" } });
    }

    await db.Projects.findByIdAndUpdate(
      projectId,
      { $pull: { tasks: taskId } },
      { new: true }
    );

    await db.Tasks.deleteOne({ _id: taskId });

    res.status(200).json("Delete task successfully");
  } catch (error) {
    next(error);
  }
}

async function addSubTask(req, res, next) {
  try {
    const { id } = req.body;
    const { projectId, taskId } = req.params;
    assigneeSubTask = req.payload.id;
    const project = await db.Projects.findOne({ _id: projectId }).populate(
      "tasks"
    );
    if (!project) {
      return res
        .status(404)
        .json({ error: { status: 404, message: "Project not found" } });
    }
    const task = project.tasks.find((t) => t._id == taskId);
    if (!task) {
      return res
        .status(404)
        .json({ error: { status: 404, message: "Task not found" } });
    }
    if (!req.body.subTaskName) {
      return res
        .status(404)
        .json({ error: { status: 404, message: "Sub task not found" } });
    }
    const newSubTask = {
      subTaskNumber: task.subTasks.length + 1,
      subTaskName: req.body.subTaskName,
      assignee: assigneeSubTask,
      description: req.body.description,
      priority: "Low",
      status: "Pending",
    };
    const subTasks = await db.Tasks.findByIdAndUpdate(
      taskId,
      { $push: { subTasks: newSubTask } },
      { new: true }
    );

    res.status(201).json(subTasks);
  } catch (error) {
    next(error);
  }
}

async function getAllSubTasks(req, res, next) {
  try {
    const { projectId, taskId } = req.params;
    const project = await db.Projects.findOne({ _id: projectId }).populate(
      "tasks"
    );
    if (!project) {
      return res
        .status(404)
        .json({ error: { status: 404, message: "Project not found" } });
    }
    const task = project.tasks.find((t) => t._id == taskId);
    if (!task) {
      return res
        .status(404)
        .json({ error: { status: 404, message: "Task not found" } });
    }

    const populatedSubTasks = await db.Tasks.findById(task._id).populate(
      "subTasks.assignee"
    );

    const { subTasks } = populatedSubTasks;

    res.status(200).json(subTasks);
  } catch (error) {
    next(error);
  }
}

async function editSubTask(req, res, next) {
  try {
    const { projectId, taskId, subTaskId } = req.params;
    const project = await db.Projects.findOne({ _id: projectId }).populate(
      "tasks"
    );

    if (!project) {
      return res
        .status(404)
        .json({ error: { status: 404, message: "Project not found" } });
    }

    const task = project.tasks.find((t) => t._id == taskId);
    if (!task) {
      return res
        .status(404)
        .json({ error: { status: 404, message: "Task not found" } });
    }

    const subTask = task.subTasks.find((st) => st._id == subTaskId);
    if (!subTask) {
      return res
        .status(404)
        .json({ error: { status: 404, message: "Sub task not found" } });
    }

    const updateSubTask = {
      subTaskName: req.body.subTaskName || subTask.subTaskName,
      assignee: req.body.assignee || subTask.assignee,
      description: req.body.description || subTask.description,
      priority: req.body.priority || subTask.priority, // Cập nhật priority
      status: req.body.status || subTask.status, // Cập nhật status
    };

    const updateFields = {};
    if (req.body.subTaskNumber !== undefined)
      updateFields["subTasks.$.subTaskNumber"] = req.body.subTaskNumber;
    if (req.body.subTaskName)
      updateFields["subTasks.$.subTaskName"] = req.body.subTaskName;
    if (req.body.assignee)
      updateFields["subTasks.$.assignee"] = req.body.assignee;
    if (req.body.description)
      updateFields["subTasks.$.description"] = req.body.description;
    if (req.body.priority !== undefined)
      updateFields["subTasks.$.priority"] = req.body.priority;
    if (req.body.status) updateFields["subTasks.$.status"] = req.body.status;

    await db.Tasks.updateOne(
      { _id: taskId, "subTasks._id": subTaskId },
      { $set: updateFields },
      { runValidators: true }
    );

    res.status(200).json(updateSubTask);
  } catch (error) {
    next(error);
  }
}

async function deleteSubTask(req, res, next) {
  try {
    const { projectId, taskId, subTaskId } = req.params;
    const project = await db.Projects.findOne({ _id: projectId }).populate(
      "tasks"
    );
    if (!project) {
      return res
        .status(404)
        .json({ error: { status: 404, message: "Project not found" } });
    }
    const task = project.tasks.find((t) => t._id == taskId);
    if (!task) {
      return res
        .status(404)
        .json({ error: { status: 404, message: "Task not found" } });
    }
    const subTask = task.subTasks.find((st) => st._id == subTaskId);
    if (!subTask) {
      return res
        .status(404)
        .json({ error: { status: 404, message: "Sub task not found" } });
    }

    await db.Tasks.updateOne(
      {
        _id: taskId,
      },
      {
        $pull: { subTasks: { _id: subTaskId } },
      }
    )
      .then((rs) => res.status(200).json(subTaskId))
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    next(error);
  }
}
// Lấy tất cả comment của một task trong một project
async function getAllComments(req, res, next) {
  try {
    const { projectId, taskId } = req.params;

    // Tìm project và populate các tasks
    const project = await db.Projects.findById(projectId).populate("tasks");
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Tìm task trong project
    const task = project.tasks.find((t) => t._id.equals(taskId));
    if (!task) {
      return res.status(404).json({ error: "Task not found in this project" });
    }

    // Tìm task chi tiết và populate thêm thông tin về user trong comments
    const taskDetails = await db.Tasks.findById(taskId).populate({
      path: "comments.user", // Populate user trong comments
      select: "username profile.avatar", // Chỉ lấy username và avatar
      model: "user", // Đảm bảo rằng bạn đang populate từ model 'user'
    });

    // Trả về danh sách comments hoặc mảng rỗng nếu không có
    res.status(200).json(taskDetails.comments || []);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

// Thêm comment vào một task trong một project
async function addComment(req, res, next) {
  try {
    const { projectId, taskId } = req.params;
    const { content } = req.body;
    const userId = req.payload.id;

    if (!content?.trim()) {
      return res.status(400).json({ error: "Comment content is required" });
    }

    // Tìm project và populate tasks
    const project = await db.Projects.findById(projectId).populate("tasks");
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Tìm task trong project
    const task = project.tasks.find((t) => t._id.toString() == taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found in this project" });
    }

    // Tạo comment mới
    const newComment = { user: userId, content, createdAt: new Date() };

    // Cập nhật task và thêm comment mới
    const taskDetails = await db.Tasks.findByIdAndUpdate(
      taskId,
      { $push: { comments: newComment } },
      { new: true }
    );

    if (!taskDetails) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Populate 'user' trong comment để lấy thông tin người dùng
    const populatedTask = await db.Tasks.findById(taskId).populate({
      path: "comments.user",
      select: "username profile.avatar", // Chọn các trường cần thiết
      model: "user",
    });

    res.status(201).json({
      message: "Comment added successfully",
      comments: populatedTask.comments, // Trả về các comments đã populate user
    });
  } catch (error) {
    next(error);
  }
}

// Sửa comment trong task của project
async function editComment(req, res, next) {
  try {
    const { projectId, taskId, commentId } = req.params;
    const { content } = req.body;

    const project = await db.Projects.findById(projectId).populate("tasks");
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const task = project.tasks.find((t) => t._id.toString() === taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found in this project" });
    }

    const taskDetails = await db.Tasks.findOneAndUpdate(
      { _id: taskId, "comments._id": commentId },
      {
        $set: {
          "comments.$.content": content,
          "comments.$.updatedAt": new Date(),
        },
      },
      { new: true }
    );

    if (!taskDetails) {
      return res.status(404).json({ error: "Task or Comment not found" });
    }

    res.status(200).json({ message: "Comment updated successfully" });
  } catch (error) {
    next(error);
  }
}

// Xóa comment trong task của project
async function deleteComment(req, res, next) {
  try {
    const { projectId, taskId, commentId } = req.params;

    const project = await db.Projects.findById(projectId).populate("tasks");
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const task = project.tasks.find((t) => t._id.toString() === taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found in this project" });
    }

    const taskDetails = await db.Tasks.findOneAndUpdate(
      { _id: taskId },
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );

    if (!taskDetails) {
      return res.status(404).json({ error: "Task or Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
}

async function swapTaskNumber(req, res, next) {
  try {
    const { taskId1, taskId2 } = req.body;

    const task1 = await db.Tasks.findById(taskId1);
    const task2 = await db.Tasks.findById(taskId2);

    if (!task1 || !task2) {
      return res.status(404).json({ message: "One or both tasks not found" });
    }

    // Bước 1: Đặt task1.taskNumber thành giá trị tạm (-1) và lưu lại
    const tempNumber1 = task1.taskNumber;
    const tempNumber2 = task2.taskNumber;
    console.log(tempNumber1, tempNumber2);
    await db.Tasks.findByIdAndUpdate(taskId1, { taskNumber: -1 });

    // Bước 2: Cập nhật taskNumber của task2 cho task1
    await db.Tasks.findByIdAndUpdate(taskId2, { taskNumber: tempNumber1 });

    // Bước 3: Cập nhật taskNumber cũ của task1 cho task2
    await db.Tasks.findByIdAndUpdate(taskId1, { taskNumber: tempNumber2 });

    res.json({ message: "Swapped successfully" });
  } catch (error) {
    console.error("Error swapping task numbers:", error);
    res.status(500).json({ error: error.message });
  }
}

async function createTeam(projectId, taskId, assigneeId) {
    try {
        // Tìm project và task tương ứng
        const project = await db.Projects.findOne({ _id: projectId });
        if (!project) {
            throw createHttpErrors(404, "Project not found");
        }

        const task = await db.Tasks.findOne({ _id: taskId });
        if (!task) {
            throw createHttpErrors(404, "Task not found");
        }

        // Kiểm tra xem assignee đã có nhóm nào chưa
        const existingTeam = project.members.some(member =>
            member.teams.some(team => team.teamLeader.toString() === assigneeId)
        );

        if (existingTeam) {
            throw createHttpErrors(400, "Assignee already has a team");
        }

        // Tạo team mới
        const newTeam = {
            idTeam: new mongoose.Types.ObjectId(),  // Tạo ID team mới
            teamName: task.taskName, // Đặt tên nhóm bằng tên task
            teamLeader: assigneeId, // Gán assignee làm team leader
        };

        // Cập nhật project với team mới cho assignee
        const updateProject = await db.Projects.updateOne(
            { _id: projectId },
            {
                $push: {
                    'members.$[member].teams': newTeam,
                },
            },
            {
                arrayFilters: [{ 'member._id': assigneeId }],
                new: true,
            }
        );

        if (!updateProject) {
            throw createHttpErrors(400, "Failed to update project with new team");
        }

        // Trả về team vừa tạo
        return newTeam;
    } catch (error) {
        throw error;
    }
}


const TaskController = {
  swapTaskNumber,
  getAllComments,
  addComment,
  editComment,
  deleteComment,
  getAllTasks,
  createTask,
  editTask,
  deleteTask,
  getAllSubTasks,
  addSubTask,
  editSubTask,
  deleteSubTask,
};

module.exports = TaskController;
