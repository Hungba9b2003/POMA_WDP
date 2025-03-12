const createHttpErrors = require("http-errors");
const db = require("../models");
const { populate } = require("../models/notification.model");
const sendEmail = require("./authentication.controller").sendEmail;

function generateProjectCode(length = 6) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

async function createProject(req, res, next) {
  try {
    const { projectName } = req.body;
    const { id } = req.body;
    const projectCode = generateProjectCode();
    const existingProject = await db.Projects.findOne({ projectName });
    if (existingProject) {
      return res.status(400).json({
        message: "Project name already exists, please choose another name.",
      });
    }

    const defaultClassifications = ["Pending", "In Progress", "Completed"];
    const members = [
      {
        _id: id,
        role: "owner",
      },
    ];
    const newProject = new db.Projects({
      projectName,
      projectCode,
      classifications: defaultClassifications,
      members,
    });

    const nProject = await newProject.save();
    const nProjectId = nProject._id;

    const updatedUser = await db.Users.findOneAndUpdate(
      { _id: id },
      { $push: { projects: nProjectId } },
      { new: true }
    );

    if (!updatedUser) {
      throw createHttpErrors(400, "Failed to update user with project ID");
    }

    res
      .status(201)
      .json({ message: "Project created successfully", Project: newProject });
  } catch (error) {
    next(error);
  }
}

async function getAllProjects(req, res, next) {
  try {
    const { id } = req.body;
    const projects = await db.Projects.find({
      members: { $elemMatch: { _id: id } },
    });
    if (!projects) {
      throw createHttpErrors(404, "Project not found");
    }

    res.status(200).json(projects);
  } catch (error) {
    next(error);
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
}

async function getProjectByIdSummary(req, res, next) {
  try {
    const { projectId } = req.params;
    const project = await db.Projects.findById(projectId)
      .populate({ path: "tasks" })
      .populate({ path: "members._id" })
      .populate({
        path: "tasks",
        populate: [{ path: "assignee" }, { path: "subTasks.assignee" }],
      })
      .exec();
    console.log(project);
    if (!project) return next(createHttpErrors.NotFound("Project not found"));

    res.json({ project });
  } catch (error) {
    next(createHttpErrors.InternalServerError(error.message));
  }
}

async function updateProject(req, res, next) {
  try {
    const { projectId } = req.params;
    const { id, newColumn, removeColumn } = req.body; // Nhận removeColumn từ request body
    const { projectName, projectCode, projectAvatar } = req.body;

    const project = await db.Projects.findOne({ _id: projectId })
      .populate("tasks")
      .exec();
    if (!project) {
      throw createHttpErrors(404, "Project not found");
    }

    const member = project.members.find(
      (member) => member._id.toString() === id
    );
    if (!member) {
      throw createHttpErrors(
        403,
        "You don't have permission to edit this project"
      );
    }

    const updateProject = {};

    if (member.role === "owner") {
      if (projectName) updateProject.projectName = projectName;

      if (projectCode) {
        const existingProjectByCode = await db.Projects.findOne({
          projectCode,
          _id: { $ne: projectId },
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

      // Thêm column
      if (newColumn) {
        if (project.classifications.includes(newColumn)) {
          return res.status(400).json({ message: "Column already exists" });
        }
        project.classifications.push(newColumn);
        updateProject.classifications = project.classifications;
      }

      if (removeColumn) {
        const tasksToDelete = project.tasks
          .filter((task) => task.status === removeColumn)
          .map((task) => task._id);
        if (tasksToDelete.length > 0) {
          const deleteResult = await db.Tasks.deleteMany({
            _id: { $in: tasksToDelete },
          });
        }

        project.tasks = project.tasks.filter(
          (task) => task.status !== removeColumn
        );
        updateProject.tasks = project.tasks;

        project.classifications = project.classifications.filter(
          (col) => col !== removeColumn
        );
        updateProject.classifications = project.classifications;
      }
    } else {
      throw createHttpErrors(
        403,
        "Only the project owner can edit project details"
      );
    }

    await db.Projects.updateOne(
      { _id: projectId },
      { $set: updateProject },
      { runValidators: true }
    );
    const saveProject = await db.Projects.findOne({ _id: projectId });

    res.status(200).json(saveProject);
  } catch (error) {
    next(error);
  }
}

async function deleteProject(req, res, next) {
  try {
    const { projectId } = req.params;
    const { id } = req.body; //payload
    const project = await db.Projects.findOne({ _id: projectId });

    if (!project) {
      throw createHttpErrors(404, "Project not found");
    }

    const isOwner = project.members.some(
      (member) => member._id.toString() === id && member.role === "owner"
    );
    if (!isOwner) {
      throw createHttpErrors(
        403,
        "Only the project owner can delete this project"
      );
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

const updateProjectStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await db.Projects.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    project.status = project.status === "active" ? "inactive" : "active";
    await project.save();

    res
      .status(200)
      .json({ message: "Project status updated successfully", project });
  } catch (error) {
    console.error("Error updating project status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

async function getProjectMembers(req, res, next) {
  try {
    const { projectId } = req.params;

    const project = await db.Projects.findOne({ _id: projectId })
      .populate({
        path: 'members._id',
        model: 'user',
      });

    if (!project) {
      throw createHttpErrors(404, "Project not found");
    }

    const memberInfo = project.members.map(member => ({
      id: member._id ? member._id._id : null,
      name: member._id ? member._id.username : null,
      role: member.role,
      avatar: member._id ? member._id.profile.avatar : null
    }));

    res.status(200).json({ memberInfo });

  } catch (error) {
    next(error);
  }
}

async function setProjectMemberRole(req, res, next) {
  try {
    const { projectId, memberId } = req.params;
    const { role } = req.body;

    console.log("role", role);
    console.log("project member", projectId, memberId);

    // Find the project
    const project = await db.Projects.findOne({ _id: projectId });
    if (!project) {
      throw createHttpErrors(404, "Project not found");
    }

    // Find the member to update
    const member = project.members.find(
      (member) => member._id.toString() === memberId
    );
    if (!member) {
      throw createHttpErrors(404, "Member not found");
    }

    // Prevent the owner from changing their own role (optional step if needed)
    // if (memberId === project.ownerId) {
    //   throw createHttpErrors(403, "You cannot change your own role");
    // }

    // Check if there's already an owner and prevent assigning owner role to another member
    const otherOwners = project.members.filter(
      (member) => member.role === "owner" && member._id.toString() !== memberId
    );
    if (role === "owner" && otherOwners.length > 0) {
      throw createHttpErrors(
        400,
        "Cannot assign owner role as there is already an owner"
      );
    }

    // Update the member's role
    await db.Projects.updateOne(
      { _id: projectId, "members._id": memberId },
      { $set: { "members.$.role": role } }
    );

    // Return the response
    res.status(200).json({
      message: "Member role updated successfully",
      memberId,
      newRole: role,
    });
  } catch (error) {
    next(error);
  }
}



async function deleteProjectMember(req, res, next) {
  try {
    const { projectId, memberId } = req.params;

    // Tìm dự án
    const project = await db.Projects.findById(projectId).populate("members");
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Kiểm tra xem thành viên cần xóa có tồn tại không
    const memberToDelete = project.members.find(
      (member) => member._id.toString() === memberId
    );
    if (!memberToDelete) {
      return res.status(404).json({ error: "Member not found" });
    }

    // Xóa thành viên khỏi danh sách dự án
    project.members = project.members.filter(
      (member) => member._id.toString() !== memberId
    );
    await project.save();

    // Xóa dự án khỏi danh sách của thành viên đó
    await db.Users.findByIdAndUpdate(memberId, {
      $pull: { projects: projectId },
    });

    return res.status(200).json({ message: "Member removed successfully" });
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
    const member = project.members.find(
      (member) => member._id.toString() === id
    );

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
    const { status, projectId } = req.body;

    // Kiểm tra đầu vào
    if (status != 1) {
      return res
        .status(400)
        .json({ message: "Invalid isPremium value. Must be true or false." });
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
      project,
    });
  } catch (error) {
    console.error("Error updating project premium status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
const countProjects = async (req, res, next) => {
  try {
    const totalProjects = await db.Projects.countDocuments(); // Đếm tất cả dự án

    res.status(200).json({ success: true, totalProjects });
  } catch (error) {
    console.error("Error counting projects:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const countPremiumProjects = async (req, res, next) => {
  try {
    const premiumProjects = await db.Projects.countDocuments({
      isPremium: true,
    }); // Đếm dự án có Premium

    res.status(200).json({ success: true, premiumProjects });
  } catch (error) {
    console.error("Error counting premium projects:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const leaveProjects = async (req, res, next) => {
  try {
    const { userId, projectId } = req.body;

    const project = await db.Projects.findById(projectId);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // Kiểm tra xem user có trong nhóm
    const memberIndex = project.members.findIndex(
      (member) => member._id.toString() === userId
    );
    if (memberIndex === -1) {
      return res
        .status(400)
        .json({ success: false, message: "User is not in this project" });
    }

    // Xóa user khỏi danh sách members
    project.members.splice(memberIndex, 1);
    await project.save();

    res
      .status(200)
      .json({ success: true, message: "Left the project successfully" });
  } catch (error) {
    console.error("Error leaving project:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

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



const ProjectController = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateProjectStatus,
  getProjectMembers,
  setProjectMemberRole,
  deleteProjectMember,
  getUserRole,
  updatePremium,
  getInviteMembers,
  countProjects,
  countPremiumProjects,
  leaveProjects,
  createTeam,
  joinProjectByCode,
  getProjectByIdSummary,
};

module.exports = ProjectController;
