const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    //người nhan thông báo
    receivers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'group'
    },
    //nội dung thông báo
    content: {
        type: String,
        required: true,
        maxlength: 200 // Limit content to 200 characters
    },
    //đường dẫn đến noi có sự kiện thay đổi
    activityUrl: {
        type: String,
        required: false
    },
    //đã xem thông báo chưa
    isSeen: {
        type: Boolean,
        default: false // Default false for unseen notifications
    }
}, {
    timestamps: true
});

const Notification = mongoose.model('notification', notificationSchema);
module.exports = Notification;
