const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    taskNumber: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
    },
    taskName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: "Deadline must be in the future.",
      },
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "In Progress", "Completed"],
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        content: {
          type: String,
          required: true,
          trim: true,
          minlength: 1,
          maxlength: 500,
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    subTasks: [
      {
        subTaskNumber: {
          type: Number,
          required: true,
          min: 1,
        },
        subTaskName: {
          type: String,
          required: true,
          trim: true,
          minlength: 3,
          maxlength: 100,
        },
        assignee: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        priority: {
          type: String,
          required: true,
          enum: ["Low", "Medium", "High"],
        },
        status: {
          type: String,
          required: true,
          enum: ["Pending", "In Progress", "Completed"],
        },
      },
    ],
  },
  { timestamps: true }
);

const Task = mongoose.model("task", taskSchema);
module.exports = Task;
