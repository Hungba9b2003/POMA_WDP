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
        minlength: [6, "Password must be at least 6 characters"],
        // Không hash được nếu validate trong schema, nên check ở controller
      },
    },
    profile: {
      phoneNumber: {
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
