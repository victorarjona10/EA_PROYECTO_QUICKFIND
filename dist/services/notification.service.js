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
exports.notificationService = exports.NotificationService = void 0;
const socket_1 = require("../socket");
const user_service_1 = require("./user.service");
const company_service_1 = require("./company.service");
const notification_1 = require("../models/notification");
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("../models/user");
class NotificationService {
    constructor() {
        this.userService = new user_service_1.UserService();
        this.companyService = new company_service_1.CompanyService();
        this.userSockets = new Map();
        this.listenersInitialized = false;
    }
    initializeListeners() {
        if (!this.listenersInitialized) {
            this.setupSocketListeners();
            this.listenersInitialized = true;
        }
    }
    setupSocketListeners() {
        try {
            const io = (0, socket_1.getIO)();
            io.on("connection", (socket) => {
                console.log(`New client connected: ${socket.id}`);
                socket.on("authenticate", (userId) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    console.log(`User ${userId} authenticated on socket ${socket.id}`);
                    if (!this.userSockets.has(userId)) {
                        this.userSockets.set(userId, []);
                    }
                    (_a = this.userSockets.get(userId)) === null || _a === void 0 ? void 0 : _a.push(socket.id);
                    socket.emit("authenticated", { success: true });
                    yield this.sendPendingNotifications(userId, socket.id);
                }));
                socket.on("disconnect", () => {
                    console.log(`Client disconnected: ${socket.id}`);
                    this.userSockets.forEach((socketIds, userId) => {
                        const updatedSocketIds = socketIds.filter((id) => id !== socket.id);
                        if (updatedSocketIds.length === 0) {
                            this.userSockets.delete(userId);
                        }
                        else {
                            this.userSockets.set(userId, updatedSocketIds);
                        }
                    });
                });
            });
            console.log("Socket listeners initialized successfully");
        }
        catch (error) {
            console.error("Failed to initialize socket listeners:", error);
        }
    }
    sendPendingNotifications(userId, socketId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notifications = yield notification_1.NotificationModel.find({
                    recipient_id: new mongoose_1.default.Types.ObjectId(userId),
                    read: false,
                })
                    .sort({ created_at: -1 })
                    .limit(10);
                if (notifications.length > 0) {
                    console.log(`Sending ${notifications.length} pending notifications to user ${userId}`);
                    for (const notification of notifications) {
                        const io = (0, socket_1.getIO)();
                        io.to(socketId).emit("notification", {
                            id: notification._id.toString(),
                            type: notification.type,
                            message: notification.message,
                            created_at: notification.created_at,
                            read: notification.read,
                        });
                    }
                }
            }
            catch (error) {
                console.error("Error sending pending notifications:", error);
            }
        });
    }
    sendNotification(order, type, newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const company = yield this.companyService.getCompanyById(order.company_id.toString());
                if (!company) {
                    console.error("Company not found for notification");
                    return;
                }
                const user = yield user_1.UserModel.findById(order.user_id).lean();
                if (!user) {
                    console.error("User not found for notification");
                    return;
                }
                const ownerId = company.ownerId.toString();
                const userIdStr = user._id.toString();
                console.log("IDs extraídos:", { ownerId, userIdStr });
                let message;
                let senderId;
                let recipientId;
                if (type === "new_order") {
                    recipientId = ownerId;
                    senderId = userIdStr;
                    message = `Nuevo pedido de ${user.name} para ${company.name}`;
                }
                else {
                    recipientId = userIdStr;
                    senderId = ownerId;
                    if (newStatus === "Procesado") {
                        message = `Tu pedido en ${company.name} ha sido procesado correctamente.`;
                    }
                    else if (newStatus === "Cancelado") {
                        message = `Tu pedido en ${company.name} ha sido cancelado.`;
                    }
                    else {
                        message = `El estado de tu pedido en ${company.name} ha cambiado a: ${newStatus || "actualizado"}`;
                    }
                }
                const notification = new notification_1.NotificationModel({
                    recipient_id: new mongoose_1.default.Types.ObjectId(recipientId),
                    sender_id: new mongoose_1.default.Types.ObjectId(senderId),
                    related_id: new mongoose_1.default.Types.ObjectId(order._id.toString()),
                    type,
                    message,
                    read: false,
                    created_at: new Date(),
                });
                yield notification.save();
                console.log(`Notification saved to database with ID: ${notification._id}`);
                if (this.userSockets.has(recipientId)) {
                    const socketIds = this.userSockets.get(recipientId) || [];
                    for (const socketId of socketIds) {
                        const io = (0, socket_1.getIO)();
                        const socketNotification = {
                            id: notification._id.toString(),
                            type: notification.type,
                            message: notification.message,
                            created_at: notification.created_at,
                            read: false,
                            order: {
                                id: order._id.toString(),
                                status: type === "new_order" ? order.status : newStatus,
                            },
                            company: {
                                id: company._id.toString(),
                                name: company.name,
                            },
                            user: {
                                id: userIdStr,
                                name: user.name,
                            },
                        };
                        io.to(socketId).emit("notification", socketNotification);
                        console.log(`Notification sent to socket ${socketId} for recipient ${recipientId}`);
                    }
                }
                else {
                    console.log(`Recipient ${recipientId} not connected, notification stored for later delivery`);
                }
            }
            catch (error) {
                console.error("Error sending notification:", error);
            }
        });
    }
    markAsRead(notificationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield notification_1.NotificationModel.updateOne({
                    _id: new mongoose_1.default.Types.ObjectId(notificationId),
                    recipient_id: new mongoose_1.default.Types.ObjectId(userId),
                }, { read: true });
                return result.modifiedCount > 0;
            }
            catch (error) {
                console.error("Error marking notification as read:", error);
                return false;
            }
        });
    }
    getUserNotifications(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, limit = 20, offset = 0, onlyUnread = false) {
            try {
                const query = { recipient_id: new mongoose_1.default.Types.ObjectId(userId) };
                if (onlyUnread) {
                    query.read = false;
                }
                const notifications = yield notification_1.NotificationModel.find(query)
                    .sort({ created_at: -1 })
                    .skip(offset)
                    .limit(limit);
                return notifications;
            }
            catch (error) {
                console.error("Error getting user notifications:", error);
                return [];
            }
        });
    }
    deleteOldNotifications() {
        return __awaiter(this, arguments, void 0, function* (daysOld = 30) {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);
            try {
                const result = yield notification_1.NotificationModel.deleteMany({
                    created_at: { $lt: cutoffDate },
                });
                console.log(`Deleted ${result.deletedCount} old notifications`);
                return result.deletedCount;
            }
            catch (error) {
                console.error("Error deleting old notifications:", error);
                return 0;
            }
        });
    }
    readNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield notification_1.NotificationModel.updateMany({ recipient_id: new mongoose_1.default.Types.ObjectId(userId), read: false }, { $set: { read: true } });
        });
    }
}
exports.NotificationService = NotificationService;
exports.notificationService = new NotificationService();
//# sourceMappingURL=notification.service.js.map