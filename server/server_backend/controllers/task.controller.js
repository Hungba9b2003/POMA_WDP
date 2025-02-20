const createHttpErrors = require("http-errors");
const db = require("../models");

async function getAllTasks(req, res, next) {
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

const taskController = {
    getAllTasks,
    createTask,
    editTask,
    deleteTask,
    addSubTask,
    getAllSubTask,
    editSubTask,
    deleteSubTask
}

module.exports = taskController;