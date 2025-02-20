
const createHttpErrors = require("http-errors");
const db = require("../models");



function generateProjectCode(length = 6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

async function createProject(req, res, next) {
    try {
        const { projectName } = req.body;
        const { id } = req.body;//payload
        const projectCode = generateProjectCode();
        const existingProject = await db.Projects.findOne({ projectName });
        if (existingProject) {
            return res.status(400).json({ message: "Project name already exists, please choose another name." });
        }

        const defaultClassifications = ['todo', 'inprogress', 'done'];
        const members = [
            {
                _id: id,
                role: 'owner'
            }
        ];
        const newProject = new db.Projects({
            projectName,
            projectCode,
            classifications: defaultClassifications,
            members
        });

        const nProject = await newProject.save();
        const nProjectId = nProject._id;
        console.log(nProjectId);

        const updatedUser = await db.Users.findOneAndUpdate(
            { _id: id },
            { $push: { projects: nProjectId } },
            { new: true } 
        );
        
        if (!updatedUser) {
            throw createHttpErrors(400, "Failed to update user with project ID");
        }

        res.status(201).json({ message: "Project created successfully", Project: newProject });
    } catch (error) {
        next(error);
    }
}


async function getAllProjects(req, res, next) {
    try {
        const { id } = req.body;//payload
        const projects = await db.Projects.find({ members: { $elemMatch: { _id: id } } });
        if (!projects) {
            throw createHttpErrors(404, "Project not found")
        }

        res.status(200).json(projects)

    } catch (error) {
        next(error)
    }
}

async function getProjectById(req, res, next) {
    try {
        const { projectId } = req.params;
        const project = await db.Projects.findById(projectId);
        
        if (!project) return next(createHttpErrors.NotFound("Project not found"));
        
        res.json({ project });
    } catch (error) {
        next(createHttpErrors.InternalServerError(error.message));
    }
};

async function updateProject(req, res, next) {
    try {
        const { projectId } = req.params;
        const { id } = req.body;//payload
        const { projectName, projectCode, projectAvatar } = req.body;

        const project = await db.Projects.findOne({ _id: projectId });
        if (!project) {
            throw createHttpErrors(404, "Project not found");
        }

        const member = project.members.find(member => member._id.toString() === id);
        if (!member) {
            throw createHttpErrors(403, "You don't have permission to edit this project");
        }

        const updateProject = {};

        if (member.role === 'owner') {
            if (projectName) updateProject.projectName = projectName;

            if (projectCode) {
                const existingProjectByCode = await db.Projects.findOne({
                    projectCode,
                    _id: { $ne: projectId }
                });
                if (existingProjectByCode) {
                    res.status(409).json({ error: "Project code already exists" });
                    return;
                }
                updateProject.projectCode = projectCode;
            }

            if (projectAvatar) {
                updateProject.projectAvatar = projectAvatar;
            }
        } 
        else if (member.role === 'member') {
            if (projectName || projectCode || projectAvatar) {
                throw createHttpErrors(403, "Only the project owner can edit the project name, project code, and avatar");
            }
        }

        await db.Projects.updateOne({ _id: projectId }, { $set: updateProject }, { runValidators: true });
        const saveProject = await db.Projects.findOne({ _id: projectId });

        res.status(200).json(saveProject);

    } catch (error) {
        next(error);
    }
}

async function deleteProject(req, res, next) {
    try {
        const { projectId } = req.params;
        const { id } = req.body;//payload
        const project = await db.Projects.findOne({ _id: projectId });

        if (!project) {
            throw createHttpErrors(404, "Project not found");
        }
        
        const isOwner = project.members.some(member => member._id.toString() === id && member.role === 'owner');
        if (!isOwner) {
            throw createHttpErrors(403, "Only the project owner can delete this project");
        }
        
        await db.Users.updateMany(
            { projects: projectId }, 
            { $pull: { projects: projectId } } 
        );

        await db.Projects.deleteOne({ _id: projectId });
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        next(error);
    }
}

async function getProjectMembers(req, res, next) {
    try {
        const { projectId } = req.params;

        const project = await db.Projects.findOne({ _id: projectId })
            .populate({
                path: 'members._id',
                model: 'user',
                select: 'username'
            });

        if (!project) {
            throw createHttpErrors(404, "Project not found");
        }
        const memberInfo = project.members.map(member => ({
            id: member._id ? member._id._id : null,
            name: member._id ? member._id.username : null,
            role: member.role
        }));

        res.status(200).json({ memberInfo });

    } catch (error) {
        next(error);
    }
}


const ProjectController={
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    getProjectMembers,
}

module.exports = ProjectController
