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
exports.chatService = exports.ChatService = void 0;
const chatMessage_1 = __importDefault(require("../models/chatMessage"));
const mongoose_1 = __importDefault(require("mongoose"));
class ChatService {
    saveMessage(messageData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newMessage = new chatMessage_1.default({
                    room: messageData.room,
                    author: new mongoose_1.default.Types.ObjectId(messageData.author),
                    message: messageData.message,
                    time: messageData.time ? new Date(messageData.time) : new Date()
                });
                return yield newMessage.save();
            }
            catch (error) {
                console.error("Error saving chat message:", error);
                throw error;
            }
        });
    }
    getMessagesByRoom(roomId_1) {
        return __awaiter(this, arguments, void 0, function* (roomId, limit = 50) {
            try {
                return yield chatMessage_1.default.find({ room: roomId })
                    .sort({ time: -1 })
                    .limit(limit)
                    .lean();
            }
            catch (error) {
                console.error("Error getting chat messages:", error);
                throw error;
            }
        });
    }
    getCompanyChats(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roomRegex = new RegExp(`(^${companyId}-|^.+-${companyId}$)`);
                const rooms = yield chatMessage_1.default.distinct('room', { room: roomRegex });
                return rooms;
            }
            catch (error) {
                console.error("Error getting company chats:", error);
                throw error;
            }
        });
    }
}
exports.ChatService = ChatService;
exports.chatService = new ChatService();
//# sourceMappingURL=chat.service.js.map