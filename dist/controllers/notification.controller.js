"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotifications = getNotifications;
exports.markNotificationAsRead = markNotificationAsRead;
exports.clearAllNotifications = clearAllNotifications;
const notification_service_1 = require("../services/notification.service");
const mongoose_1 = __importDefault(require("mongoose"));
function getNotifications(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const limit = req.query.limit ? parseInt(req.query.limit) : 20;
            const offset = req.query.offset ? parseInt(req.query.offset) : 0;
            const onlyUnread = req.query.unread === "true";
            const notifications = yield notification_service_1.notificationService.getUserNotifications(userId, limit, offset, onlyUnread);
            res.status(200).json(notifications);
        }
        catch (error) {
            res
                .status(500)
                .json({ message: "Error getting notifications", error: error.message });
        }
    });
}
function markNotificationAsRead(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const notificationId = req.params.id;
            const userId = req.user.id;
            if (!mongoose_1.default.Types.ObjectId.isValid(notificationId)) {
                res.status(400).json({ message: "Invalid notification ID" });
                return;
            }
            const success = yield notification_service_1.notificationService.markAsRead(notificationId, userId);
            if (success) {
                res.status(200).json({ message: "Notification marked as read" });
            }
            else {
                res
                    .status(404)
                    .json({ message: "Notification not found or not owned by user" });
            }
        }
        catch (error) {
            res.status(500).json({
                message: "Error marking notification as read",
                error: error.message,
            });
        }
    });
}
function clearAllNotifications(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.status(501).json({ message: "Not implemented yet" });
    });
}
//# sourceMappingURL=notification.controller.js.map