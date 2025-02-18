const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    account: {
      email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: {
          validator: function (v) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
          },
          message: "Invalid email format",
        },
      },
      password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"],
        validate: {
          validator: function (v) {
            return /^(?=.*[A-Z]).{8,}$/.test(v);
          },
          message:
            "Password must be at least 8 characters and contain at least one uppercase letter",
        },
      },
    },
    profile: {
      phoneNumber: {
        type: String,
        match: /^(0|\+)[0-9]{9,12}$/, // Phone number validation (10 digits)
        // thiếu điều kiện so
        required: true,
      },
      avatar: {
        type: String,
        default: "/images/avatar/imageDefault.jpg", // Default avatar URL, update with a valid URL
      },
    },
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "project",
      },
    ],
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "notification",
      },
    ],
    role: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: function (v) {
          return /^(0|\+84)[0-9]{9,12}$/.test(v);
        },
        message:
          "Invalid phone number format ( It must start with 0 or +84 and be 10-12 digits long )",
      },
    },
    avatar: {
      type: String,
      default: "/images/avatar/imageDefault.jpg",
    },

    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "project",
      },
    ],
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "notification",
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["inactive", "active", "banned"],
      default: "inactive",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
