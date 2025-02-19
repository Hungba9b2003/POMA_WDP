const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");



//const authenticationController = require("./authentication.controller");

// Lấy tất cả comment của một task trong một project
async function getAllComments(req, res, next) {
    try {
        const { projectId, taskId } = req.params;

        const project = await db.Project.findById(projectId).populate('tasks._id'); // Dùng populate để lấy các task
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        const task = project.tasks.find(t => t._id.equals(taskId));
        console.log(project.tasks);
        if (!task) {
            return res.status(404).json({ error: "Task not found in this project" });
        }

        const taskDetails = await db.Task.findById(taskId); // Lấy chi tiết của task từ task collection
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

        const project = await db.Project.findById(projectId).populate('tasks._id');
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        const task = project.tasks.find(t => t._id.equals(taskId));
        if (!task) {
            return res.status(404).json({ error: "Task not found in this project" });
        }

        const newComment = { user: userId, content, createdAt: new Date() };
        const taskDetails = await db.Task.findByIdAndUpdate(
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

        const project = await db.Project.findById(projectId).populate('tasks._id');
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        const task = project.tasks.find(t => t._id.equals(taskId));
        if (!task) {
            return res.status(404).json({ error: "Task not found in this project" });
        }

        const taskDetails = await db.Task.findOneAndUpdate(
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

        const project = await db.Project.findById(projectId).populate('tasks._id');
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        const task = project.tasks.find(t => t._id.equals(taskId));
        if (!task) {
            return res.status(404).json({ error: "Task not found in this project" });
        }

        const taskDetails = await db.Task.findOneAndUpdate(
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
    deleteComment
};

module.exports = TaskController;

