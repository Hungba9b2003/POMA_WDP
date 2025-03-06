const mongoose = require("mongoose");
const { create } = require("./notification.model");

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      unique: [true, "Group name existed"],
      required: [true, "Group name is required"],
      maxlength: 15,
    },
    //code để vào dự án
    projectCode: {
      type: String,
      unique: [true, "Group code existed"],
      required: [true, "Group code is required"],
      maxlength: 6,
    },
    projectAvatar: {
      type: String, // Store URL or path to the group image
      default: null, // Set default to null if no image is provided
    },
    classifications: [
      {
        type: String, // Add classifications array (add more detail based on your needs)
      },
    ],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "task" }],
    members: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        role: {
          type: String,
          enum: ["owner", "member", "viewer"],
          default: "member",
          required: [true, "Role is required"],
        },
        teams: [
          {
            //id nhóm
            idTeam: {
              type: mongoose.Schema.Types.ObjectId,
            },
            //tên nhóm
            teamName: {
              type: String,
            },
            teamLeader: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "user",
            },
          },
        ],
      },
    ],
    isPremium: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      required: true, //chỉ yêu cầu với nhóm trưởng
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("project", projectSchema);
module.exports = Project;
