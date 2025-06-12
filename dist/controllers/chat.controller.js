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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessagesByRoom = getMessagesByRoom;
exports.saveMessage = saveMessage;
exports.getCompanyChats = getCompanyChats;
const chat_service_1 = require("../services/chat.service");
function getMessagesByRoom(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { roomId } = req.params;
            const limit = req.query.limit ? parseInt(req.query.limit) : 50;
            if (!roomId) {
                res.status(400).json({ message: "Room ID is required" });
                return;
            }
            const messages = yield chat_service_1.chatService.getMessagesByRoom(roomId, limit);
            const formattedMessages = messages.map(msg => ({
                id: msg.id,
                text: msg.message,
                sender: msg.author.toString(),
                timestamp: msg.time
            }));
            res.status(200).json({ messages: formattedMessages });
        }
        catch (error) {
            console.error("Error getting chat history:", error);
            res.status(500).json({ message: "Error retrieving chat messages", error });
        }
    });
}
function saveMessage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { room, message, author } = req.body;
            if (!room || !message) {
                res.status(400).json({ message: "Room ID and message content are required" });
                return;
            }
            if (!author) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }
            const messageData = {
                room,
                author: author,
                message,
                time: new Date().toISOString()
            };
            const savedMessage = yield chat_service_1.chatService.saveMessage(messageData);
            res.status(201).json(savedMessage);
        }
        catch (error) {
            console.error("Error creating message:", error);
            res.status(500).json({ message: "Error creating message", error });
        }
    });
}
function getCompanyChats(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { companyId } = req.params;
            if (!companyId) {
                res.status(400).json({ message: "Company ID is required" });
                return;
            }
            const rooms = yield chat_service_1.chatService.getCompanyChats(companyId);
            console.log(rooms, rooms.length);
            res.status(200).json({
                success: true,
                count: rooms.length,
                rooms
            });
        }
        catch (error) {
            console.error("Error getting company chats:", error);
            res.status(500).json({
                success: false,
                message: "Error retrieving company chats",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    });
}
//# sourceMappingURL=chat.controller.js.map