"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = void 0;
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    recipient_id: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    sender_id: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    related_id: { type: mongoose_1.Schema.Types.ObjectId },
    type: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
});
exports.NotificationModel = (0, mongoose_1.model)("Notification", notificationSchema);
//# sourceMappingURL=notification.js.map