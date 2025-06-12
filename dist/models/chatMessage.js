"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessageModel = void 0;
const mongoose_1 = require("mongoose");
const ChatMessageSchema = new mongoose_1.Schema({
    id: {
        type: String,
        index: true
    },
    room: {
        type: String,
        required: true,
        index: true
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.ChatMessageModel = (0, mongoose_1.model)("chat_messages", ChatMessageSchema);
exports.default = exports.ChatMessageModel;
//# sourceMappingURL=chatMessage.js.map