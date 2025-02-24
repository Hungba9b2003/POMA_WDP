
const createHttpErrors = require("http-errors");
const db = require("../models");
const sendEmail = require("./authentication.controller").sendEmail;


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

async function setProjectMemberRole(req, res, next) {
    try {
        const { projectId, memberId } = req.params;
        // const { id } = req.payload;
        const { id } = req.body;
        const { role } = req.body;

        const project = await db.Projects.findOne({ _id: projectId });
        if (!project) {
            throw createHttpErrors(404, "Project not found");
        }
        const owner = project.members.find(member => member._id.toString() === id && member.role === 'owner');
        if (!owner) {
            throw createHttpErrors(403, "Only the project owner can edit member role");
        }
        const member = project.members.find(member => member._id.toString() === memberId);
        if (!member) {
            throw createHttpErrors(404, "Member not found");
        }
        if (memberId === owner._id.toString()) {
            throw createHttpErrors(403, "You cannot change your own role");
        }
        const otherOwners = project.members.filter(member => member.role === 'owner' && member._id.toString() !== memberId);
        if (role === 'owner' && otherOwners.length > 0) {
            throw createHttpErrors(400, "Cannot assign owner role as there is already an owner");
        }

        await db.Projects.updateOne(
            { _id: projectId, "members._id": memberId },
            { $set: { "members.$.role": role } }
        );
        res.status(200).json({ message: "Member role updated successfully", memberId, newRole: role });
    } catch (error) {
        next(error);
    }
}



async function deleteProjectMember(req, res, next) {
    try {
        const { projectId, memberId } = req.params;
        // const { id } = req.payload;
        const { id } = req.body;

        const project = await db.Projects.findOne({ _id: projectId });
        if (!project) {
            throw createHttpErrors(404, "Project not found");
        }

        const owner = project.members.find(member => member._id.toString() === id && member.role === 'owner');
        if (!owner) {
            throw createHttpErrors(403, "Only the project owner can delete a member");
        }

        const memberToDelete = project.members.find(member => member._id.toString() === memberId);
        if (!memberToDelete) {
            throw createHttpErrors(404, "Member not found");
        }

        if (memberId === id) {
            throw createHttpErrors(403, "The owner cannot remove themselves from the group");
        }

        project.members = project.members.filter(member => member._id.toString() !== memberId);
        await project.save();

        const user = await db.Users.findById(memberId);
        if (user) {
            user.projects = user.projects.filter(project => project.toString() !== projectId);
            await user.save();
        }

        res.status(200).json({ message: "Member removed from the project successfully" });
    } catch (error) {
        next(error);
    }
}


async function getUserRole(req, res, next) {
    try {
        const { projectId } = req.params;
        // const { id } = req.payload;
        const { id } = req.body;

        const project = await db.Projects.findOne({ _id: projectId });

        if (!project) {
            throw createHttpErrors(404, "Project not found");
        }
        const member = project.members.find(member => member._id.toString() === id);

        if (!member) {
            throw createHttpErrors(404, "User not found in the specified project");
        }
        res.status(200).json({
            id: member._id,
            role: member.role,
        });

    } catch (error) {
        next(error);
    }
}

async function getInviteMembers(req, res, next) {
    try {
        const { projectId } = req.params;
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Kiểm tra xem project có tồn tại không
        const project = await db.Projects.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const user = await db.Users.findOne({ "account.email": email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Tạo link tham gia nhóm (có thể thay đổi thành URL frontend)
        //const inviteLink = ``;
        const inviteLink = `http://localhost:9999/users/confirm-invite/${projectId}/${user._id}`;

        // Gửi email mời vào nhóm
        await sendEmail("join", email, inviteLink);

        res.status(200).json({
            message: "Invitation email sent successfully",
            projectId,
            email,
            inviteLink,
        });
    } catch (error) {
        console.error("Error sending invitation email:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


async function updatePremium(req, res, next) {
    try {
        const { projectId } = req.params;
        const { status } = req.body;

        // Kiểm tra đầu vào
        if (status != 1) {
            return res.status(400).json({ message: "Invalid isPremium value. Must be true or false." });
        }

        // Tìm project theo ID
        const project = await db.Projects.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Cập nhật giá trị isPremium
        project.isPremium = true;
        await project.save();

        res.status(200).json({
            message: "Project premium status updated successfully",
            project
        });
    } catch (error) {
        console.error("Error updating project premium status:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


const ProjectController = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    getProjectMembers,
    setProjectMemberRole,
    deleteProjectMember,
    getUserRole,
    updatePremium,
    getInviteMembers
}

module.exports = ProjectController
