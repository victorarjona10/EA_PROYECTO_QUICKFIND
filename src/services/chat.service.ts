import ChatMessageModel from "../models/chatMessage";
import { IChatMessage } from "../models/chatMessage";
import { ChatMessage } from "../socket";
import mongoose from "mongoose";

export class ChatService {
    async saveMessage(messageData: ChatMessage): Promise<IChatMessage> {
        try {
            const newMessage = new ChatMessageModel({
                room: messageData.room,
                author: new mongoose.Types.ObjectId(messageData.author),
                message: messageData.message,
                time: messageData.time ? new Date(messageData.time) : new Date()
            });

            return await newMessage.save();
        } catch (error) {
            console.error("Error saving chat message:", error);
            throw error;
        }
    }

    async getMessagesByRoom(roomId: string, limit = 50): Promise<IChatMessage[]> {
        try {
            return await ChatMessageModel.find({ room: roomId })
                .sort({ time: -1 })
                .limit(limit)
                .lean();
        } catch (error) {
            console.error("Error getting chat messages:", error);
            throw error;
        }
    }

    async getCompanyChats(companyId: string): Promise<string[]> {
        try {
            // Find all rooms that contain the company ID in the format id1-id2
            // Using regex to match both orderings (company first or second)
            const roomRegex = new RegExp(`(^${companyId}-|^.+-${companyId}$)`);
            const rooms = await ChatMessageModel.distinct('room', { room: roomRegex });

            return rooms;
        } catch (error) {
            console.error("Error getting company chats:", error);
            throw error;
        }
    }

}



export const chatService = new ChatService();