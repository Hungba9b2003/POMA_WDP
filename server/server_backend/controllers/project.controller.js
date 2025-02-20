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

async function getAllTask(req, res, next) {
    try {
        const { projectId } = req.params;
        const project = await db.Projects.findOne({ _id: projectId });
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
            taskName: req.body.taskName,
            description: req.body.description,
            reviewer: id,
            deadline: req.body.deadline,
            status: req.body.status.toLowerCase(),
        }
        await db.Projects.findOneAndUpdate({ _id: projectId }, { $addToSet: { tasks: newTask } }, { runValidators: true })
        const saveProject = await db.Projects.findOne({ _id: projectId });

        res.status(201).json(saveProject.tasks[saveProject.tasks.length - 1])



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
            status: req.body.status?.toLowerCase(),
            updatedAt: new Date()
        }
        await db.Projects.updateOne(
            {
                _id: projectId, "tasks._id": taskId
            },
            {
                $set: {
                    "tasks.$.taskName": updateTask.taskName,
                    "tasks.$.description": updateTask.description,
                    "tasks.$.assignee": updateTask.assignee,
                    "tasks.$.reviewer": updateTask.reviewer,
                    "tasks.$.deadline": updateTask.deadline,
                    "tasks.$.status": updateTask.status,
                    "tasks.$.updatedAt": updateTask.updatedAt
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
        const task = project.tasks.find(t => t._id == taskId)
        if (!task) {
            return res.status(404).json({ error: { status: 404, message: "Task not found" } })

        }

        await db.Projects.updateOne(
            {
                _id: projectId
            }
            , {
                $pull: { tasks: { _id: taskId } }
            }
        )

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

async function getAllSubTask(req, res, next) {
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

const ProjectController={
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    getProjectMembers,
    getAllTask,
    createTask,
    editTask,
    deleteTask,
    addSubTask,
    getAllSubTask,
    editSubTask,
    deleteSubTask
}

module.exports = ProjectController