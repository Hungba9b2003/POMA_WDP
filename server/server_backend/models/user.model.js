const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    account: {
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/.+\@.+\..+/, "asaf"] // Email validation
        },
        password: {
            type: String,
            required: true,
            minlength: 6 // Password validation, adjust as needed
            // nếu lưu với password hash thì validate ở đâu
        }
    },
    profile: {
        phoneNumber: {
            type: String,
            match: /^(0|\+)[0-9]{9,12}$/, // Phone number validation (10 digits) 
            // thiếu điều kiện so
            required: true
        },
        avatar: {
            type: String,
            default: '/images/avatar/imageDefault.jpg' // Default avatar URL, update with a valid URL
        }
    },
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project'
    }],
    notifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'notification'
    }],
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['inactive', 'active', 'banned'],
        default: 'inactive'
    }
}, {
    timestamps: true
});

const User = mongoose.model('user', userSchema);
module.exports = User;
