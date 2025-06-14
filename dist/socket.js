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
exports.initializeSocketIO = initializeSocketIO;
exports.getIO = getIO;
exports.initializeChatService = initializeChatService;
exports.getChatNamespace = getChatNamespace;
const socket_io_1 = require("socket.io");
const jwt_handle_1 = require("./utils/jwt.handle");
const chat_service_1 = require("./services/chat.service");
const fs_1 = __importDefault(require("fs"));
const logToFile = (message) => {
    fs_1.default.appendFileSync('chat.log', `${new Date().toISOString()} - ${message}\n`);
};
let io;
function initializeSocketIO(server) {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: ["http://localhost:4200", "http://localhost:3000"],
            credentials: true,
        },
    });
    return io;
}
function getIO() {
    if (!io) {
        throw new Error("Socket.IO no ha sido inicializado. Llama a initializeSocketIO primero.");
    }
    return io;
}
const chatService = new chat_service_1.ChatService();
function initializeChatService() {
    if (!io) {
        throw new Error("Socket.IO no ha sido inicializado. Llama a initializeSocketIO primero.");
    }
    const chatNamespace = io.of('/chat');
    chatNamespace.on('connection', (socket) => {
        socket.use(([_event, ..._args], next) => {
            const token = socket.handshake.auth.token;
            if (!token)
                return next(new Error('unauthorized'));
            try {
                (0, jwt_handle_1.verifyToken)(token);
                return next();
            }
            catch (err) {
                return next(new Error('unauthorized'));
            }
        });
        socket.on('error', (err) => {
            if (err && err.message === 'unauthorized') {
                socket.emit('status', { status: 'unauthorized' });
                socket.disconnect();
            }
        });
        socket.on('join_room', (roomId) => __awaiter(this, void 0, void 0, function* () {
            socket.join(roomId);
            console.log(`Socket ${socket.id} se unió a la sala ${roomId}`);
            try {
                const messageHistory = yield chatService.getMessagesByRoom(roomId, 50);
                const formattedHistory = messageHistory.map(msg => ({
                    id: msg.id,
                    text: msg.message,
                    sender: msg.author.toString(),
                    timestamp: msg.time
                }));
                socket.emit('message_history', formattedHistory);
            }
            catch (error) {
                console.error('Error retrieving chat history:', error);
            }
        }));
        socket.on('send_message', (data) => __awaiter(this, void 0, void 0, function* () {
            console.log(`Mensaje enviado a la sala ${data.room}:`, data.message);
            try {
                const messageContent = data.message;
                const chatMessage = {
                    room: data.room,
                    author: messageContent.sender,
                    receiver: messageContent.receiver,
                    message: messageContent.text || messageContent,
                    time: messageContent.timestamp ? new Date(messageContent.timestamp).toISOString() : new Date().toISOString(),
                    id: messageContent.id
                };
                const savedMessage = yield chatService.saveMessage(chatMessage);
                socket.broadcast.to(data.room).emit('receive_message', {
                    id: savedMessage.id,
                    text: savedMessage.message,
                    sender: savedMessage.author.toString(),
                    timestamp: new Date(savedMessage.time).getTime()
                });
            }
            catch (error) {
                console.error('Error handling message:', error);
                socket.emit('message_error', { error: 'Failed to process message' });
            }
        }));
        socket.on('disconnect', () => {
            logToFile(`Usuario desconectado del chat: ${socket.id}`);
        });
    });
    return chatNamespace;
}
function getChatNamespace() {
    if (!io) {
        throw new Error("Socket.IO no ha sido inicializado. Llama a initializeSocketIO primero.");
    }
    return io.of('/chat');
}
//# sourceMappingURL=socket.js.map