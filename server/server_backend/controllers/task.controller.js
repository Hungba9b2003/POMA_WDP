const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");



//const authenticationController = require("./authentication.controller");
async function getAllTasks(req, res, next) {
    try {
        const { projectId } = req.params;
        const project = await db.Projects.findOne({ _id: projectId }).populate('tasks');
        if (!project) {
            return res.status(404).json({ error: { status: 404, message: "Project not found" } })

        }
        const { tasks } = project;
        res.status(200).json(tasks)

    } catch (error) {
        next(error)
    }
}

async function createTask(req, res, next) {
    try {
        const { id } = req.body;
        // const { id } = req.payload;
        const { projectId } = req.params;
        const project = await db.Projects.findOne({ _id: projectId });
        // const role = project.memberRole(id);
        // console.log(role);
        if (!project) {
            return res.status(404).json({ error: { status: 404, message: "Project not found" } })
        }
        const newTask = {
            taskNumber: project.tasks.length+1,
            taskName: req.body.taskName,
            description: req.body.description,
            reviewer: id,
            assignee: id,
            deadline: req.body.deadline,
            status: req.body.status,
        }
        const newTasks =await db.Tasks.create(newTask);
        console.log(newTasks._id)
        const updatedProject = await db.Projects.findByIdAndUpdate(
            projectId,
            { $push: { tasks: newTasks._id } }, 
            { new: true, runValidators: true }
        );
        console.log(updatedProject);
        if (!updatedProject) {
            return res.status(500).json({ error: "Failed to update project with new task" });
        }

        res.status(201).json(newTasks);



    } catch (error) {
        next(error)
    }
}

async function editTask(req, res, next) {
    try {
        const { projectId, taskId } = req.params;
        const project = await db.Projects.findOne({ _id: projectId });
        if (!project) {
            return res.status(404).json({ error: { status: 404, message: "Project not found" } })

        }
        const task = project.tasks.find(t => t._id == taskId)
        if (!task) {
            return res.status(404).json({ error: { status: 404, message: "Task not found" } })

        }
        if (!req.body) {
            return res.status(400).json({ error: { status: 400, message: "Input is reqiured" } })

        }
        const updateTask = {
            taskName: req.body.taskName ? req.body.taskName : task.taskName,
            description: req.body.description ? req.body.description : task.description,
            reviewer: req.body.reviewer ? req.body.reviewer : task.reviewer,
            assignee: req.body.assignee ? req.body.assignee : task.assignee,
            deadline: req.body.deadline ? req.body.deadline : task.deadline,
            status: req.body?.status,
            updatedAt: new Date()
        }
        await db.Tasks.updateOne(
            {
                _id: taskId,
            },
            {
                $set: {
                    "taskName": updateTask.taskName,
                    "description": updateTask.description,
                    "assignee": updateTask.assignee,
                    "reviewer": updateTask.reviewer,
                    "deadline": updateTask.deadline,
                    "status": updateTask.status,
                    "updatedAt": updateTask.updatedAt
                }
            },
            {
                runValidators: true,
                isNew: false
            })
        res.status(200).json(updateTask)
    } catch (error) {
        next(error)

    }
}

async function deleteTask(req, res, next) {
    try {
        const { projectId, taskId } = req.params;
        const project = await db.Projects.findOne({ _id: projectId });
        if (!project) {
            return res.status(404).json({ error: { status: 404, message: "Project not found" } })


        }
        const task = project.tasks.find(t => t._id.equals(taskId));
        if (!task) {
            return res.status(404).json({ error: { status: 404, message: "Task not found" } })

        }

        await db.Projects.findByIdAndUpdate(
            projectId,
            { $pull: { tasks: taskId } },
            { new: true }
        );
        
        await db.Tasks.deleteOne({ _id: taskId })

        res.status(200).json("Delete task successfully")
    } catch (error) {
        next(error)
    }
}

async function addSubTask(req, res, next) {
    try {
        const { projectId, taskId } = req.params;
        const project = await db.Projects.findOne({ _id: projectId });
        if (!project) {
            return res.status(404).json({ error: { status: 404, message: "Project not found" } })

        }
        const task = project.tasks.find(t => t._id == taskId)
        if (!task) {
            return res.status(404).json({ error: { status: 404, message: "Task not found" } })

        }
        if (!req.body.subTaskName) {
            return res.status(404).json({ error: { status: 404, message: "Sub task not found" } })

        }
        const newSubTask = {
            subTaskName: req.body.subTaskName
        }
        await db.Projects.updateOne(
            {
                _id: projectId, "tasks._id": taskId

            },
            {
                $push: { "tasks.$.subTasks": newSubTask }
            },
            {
                runValidators: true,
                new: true
            }
        )

        const saveProject = await db.Projects.findOne({ _id: projectId })
        const subTasks = saveProject.tasks.find(t => t._id == taskId).subTasks
        res.status(201).json(subTasks[subTasks.length - 1])

    } catch (error) {
        next(error)
    }
}

async function getAllSubTasks(req, res, next) {
    try {
        const { projectId, taskId } = req.params;
        const project = await db.Projects.findOne({ _id: projectId });
        if (!project) {
            return res.status(404).json({ error: { status: 404, message: "Project not found" } })

        }
        const task = project.tasks.find(t => t._id == taskId)
        if (!task) {
            return res.status(404).json({ error: { status: 404, message: "Task not found" } })

        }

        const { subTasks } = task;
        res.status(200).json(subTasks)

    } catch (error) {
        next(error)
    }
}

async function editSubTask(req, res, next) {
    try {
        const { projectId, taskId, subTaskId } = req.params;
        const project = await db.Projects.findOne({ _id: projectId });
        if (!project) {
            return res.status(404).json({ error: { status: 404, message: "Project not found" } })

        }
        const task = project.tasks.find(t => t._id == taskId)
        if (!task) {
            return res.status(404).json({ error: { status: 404, message: "Task not found" } })

        }
        const subTask = task.subTasks.find(st => st._id == subTaskId)
        if (!subTask) {
            return res.status(404).json({ error: { status: 404, message: "Sub task not found" } })

        }
        const updateSubTask = {
            subTaskName: req.body.subTaskName ? req.body.subTaskName : subTask.subTaskName,
            assignee: req.body.assignee ? req.body.assignee : subTask.assignee,
            priority: req.body.priority ? req.body.priority : subTask.priority,
            status: req.body.status ? req.body.status : subTask.status,
            updatedAt: new Date()
        }

        await db.Projects.updateOne(
            {
                _id: projectId,
                "tasks._id": taskId,
                "tasks.subTasks._id": subTaskId
            },
            {
                $set: {
                    "tasks.$.subTasks.$[subtask].subTaskName": updateSubTask.subTaskName,
                    "tasks.$.subTasks.$[subtask].assignee": updateSubTask.assignee,
                    "tasks.$.subTasks.$[subtask].priority": updateSubTask.priority,
                    "tasks.$.subTasks.$[subtask].status": updateSubTask.status,
                    "tasks.$.subTasks.$[subtask].updatedAt": updateSubTask.updatedAt
                }
            },
            {
                arrayFilters: [{ "subtask._id": subTaskId }],
                runValidators: true
            })
            .then((rs) => res.status(200).json(updateSubTask));
    } catch (error) {
        next(error)
    }
}

async function deleteSubTask(req, res, next) {
    try {
        const { projectId, taskId, subTaskId } = req.params;
        const project = await db.Projects.findOne({ _id: projectId });
        if (!project) {
            return res.status(404).json({ error: { status: 404, message: "Project not found" } })

        }
        const task = project.tasks.find(t => t._id == taskId)
        if (!task) {
            return res.status(404).json({ error: { status: 404, message: "Task not found" } })

        }
        const subTask = task.subTasks.find(st => st._id == subTaskId)
        if (!subTask) {
            return res.status(404).json({ error: { status: 404, message: "Sub task not found" } })

        }

        await db.Projects.updateOne(
            {
                _id: projectId, "tasks._id": taskId
            }
            , {
                $pull: { "tasks.$.subTasks": { _id: subTaskId } }
            }
        ).then((rs) => res.status(200).json(subTaskId))
            .catch((err) => { console.log(err); })


    } catch (error) {
        next(error)
    }
}
// Lấy tất cả comment của một task trong một project
async function getAllComments(req, res, next) {
    try {
        const { projectId, taskId } = req.params;

        const project = await db.Projects.findById(projectId).populate('tasks'); // Dùng populate để lấy các task
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        const task = project.tasks.find(t => t._id.equals(taskId));
        console.log(project.tasks);
        if (!task) {
            return res.status(404).json({ error: "Task not found in this project" });
        }

        const taskDetails = await db.Tasks.findById(taskId); // Lấy chi tiết của task từ task collection
        res.status(200).json(taskDetails.comments || []);
    } catch (error) {
        next(error);
    }
}

// Thêm comment vào một task trong một project
async function addComment(req, res, next) {
    try {
        const { projectId, taskId } = req.params;
        const { content } = req.body;
        const userId = req.body.userId;

        if (!content?.trim()) {
            return res.status(400).json({ error: "Comment content is required" });
        }

        const project = await db.Projects.findById(projectId).populate('tasks');
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        const task = project.tasks.find(t => t._id.toString() == taskId);
        if (!task) {
            return res.status(404).json({ error: "Task not found in this project" });
        }

        const newComment = { user: userId, content, createdAt: new Date() };
        const taskDetails = await db.Tasks.findByIdAndUpdate(
            taskId,
            { $push: { comments: newComment } },
            { new: true }
        );

        if (!taskDetails) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.status(201).json({ message: "Comment added successfully" });
    } catch (error) {
        next(error);
    }
}

// Sửa comment trong task của project
async function editComment(req, res, next) {
    try {
        const { projectId, taskId, commentId } = req.params;
        const { content } = req.body;

        const project = await db.Projects.findById(projectId).populate('tasks');
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        const task = project.tasks.find(t => t._id.toString() === taskId);
        if (!task) {
            return res.status(404).json({ error: "Task not found in this project" });
        }

        const taskDetails = await db.Tasks.findOneAndUpdate(
            { _id: taskId, "comments._id": commentId },
            {
                $set: {
                    "comments.$.content": content,
                    "comments.$.updatedAt": new Date()
                }
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

        const project = await db.Projects.findById(projectId).populate('tasks');
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        const task = project.tasks.find(t => t._id.toString() === taskId);
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

const TaskController = {
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
    deleteSubTask
};

module.exports = TaskController;
