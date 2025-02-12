const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const morgan = require("morgan");
const bcrypt = require('bcrypt');
const db = require('../models');

/** Middleware kiểm tra xem user có trong project hay không */
async function isInProject(req, res, next) {
    try {
        const { projectId } = req.params;
        const { id } = req.payload;

        const projectMember = await db.Users.findOne({ _id: id, projects: { $in: projectId } });

        if (!projectMember) {
            return res.status(400).json({ error: { status: 400, message: "The user is not in project" } });
        }
        console.log(projectMember);
        next();
    } catch (error) {
        next(error);
    }
}

/** Middleware kiểm tra user không phải viewer trong project */
async function isNotViewer(req, res, next) {
    try {
        const { projectId } = req.params;
        const { id } = req.payload;
        if (!id) {
            return res.status(404).json({ error: { status: 404, message: "Not found Id" } });
        }
        const project = await db.Projects.findOne({ _id: projectId });

        if (project.members.find(m => m._id == id).projectRole == "viewer") {
            return res.status(400).json({ error: { status: 400, message: "Project viewer cannot edit" } });
        }
        next();
    } catch (error) {
        next(error);
    }
}

/** Middleware kiểm tra user có phải thành viên của project không */
async function isMember(req, res, next) {
    try {
        const { projectId } = req.params;
        const { id } = req.payload;
        const project = await db.Projects.findOne({ _id: projectId });

        if (project.members.find(m => m._id == id).projectRole != "member") {
            return res.status(400).json({ error: { status: 400, message: "The user is not a project member" } });
        }
        next();
    } catch (error) {
        next(error);
    }
}

/** Middleware kiểm tra user có phải chủ sở hữu project không */
async function isOwner(req, res, next) {
    try {
        const { projectId } = req.params;
        const { id } = req.payload;
        const project = await db.Projects.findOne({ _id: projectId });

        if (project.members.find(m => m._id == id).projectRole != "owner") {
            return res.status(400).json({ error: { status: 400, message: "The user is not a project owner" } });
        }
        next();
    } catch (error) {
        next(error);
    }
}

/** Middleware kiểm tra số lượng cột task trong project có vượt quá giới hạn không */
async function isOverColumn(req, res, next) {
    try {
        const { projectId } = req.params;
        const project = await db.Projects.findOne({ _id: projectId });
        const isPremium = project.isPremium;

        if (!isPremium && project.classifications.length >= 5) {
            return res.status(400).json({ error: { status: 400, message: "You must upgrade project to create more column tasks!" } });
        }
        next();
    } catch (error) {
        next(error);
    }
}

/** Middleware kiểm tra số lượng thành viên trong project có vượt quá giới hạn không */
async function isOverMember(req, res, next) {
    try {
        const { projectId } = req.params;
        const project = await db.Projects.findOne({ _id: projectId });
        const isPremium = project.isPremium;
        const action = req.body.action;

        if (!isPremium) {
            if (action === "inviteMember" && project.members.length >= 5) {
                return res.status(400).json({ error: { status: 400, message: "You must upgrade project to invite more members!" } });
            } else if (action === "addTask" && project.classifications.length >= 3) {
                return res.status(400).json({ error: { status: 400, message: "You must upgrade project to create more columns for tasks!" } });
            }
        }
        next();
    } catch (error) {
        next(error);
    }
}

/** Middleware kiểm tra user có thể tham gia project bằng mã code không */
async function isOverMemberByCode(req, res, next) {
    try {
        const { projectCode } = req.body;
        const project = await db.Projects.findOne({ projectCode: projectCode });
        const isPremium = project.isPremium;
        const { id } = req.payload;
        const isMember = project.members.some(member => member._id.toString() === id);

        if (!isPremium) {
            if (isMember) {
                return res.status(400).json({ error: { status: 400, message: "You are already in this project! " } });
            } else if (project.members.length >= 5) {
                return res.status(400).json({ error: { status: 400, message: "You must upgrade project to invite more members! " } });
            }
        }
        next();
    } catch (error) {
        next(error);
    }
}

/** Middleware giới hạn chức năng nếu project không phải premium */
async function restrictFunction(req, res, next) {
    try {
        const { projectId } = req.params;
        const project = await db.Projects.findOne({ _id: projectId });
        const isPremium = project.isPremium;

        if (!isPremium) {
            req.body.assignee = "";
            req.body.priority = "";
            req.body.status = "";
            return res.status(400).json({ error: { status: 400, message: "You must upgrade project to unlock functions!" } });
        }
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    isInProject,
    isMember,
    isOwner,
    isNotViewer,
    isOverColumn,
    isOverMember,
    restrictFunction,
    isOverMemberByCode
};
