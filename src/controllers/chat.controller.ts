import { Request, Response } from "express";
import { chatService } from "../services/chat.service";
import { RequestExt } from "../middleware/session";

/**
 * Get chat history for a specific room
 */
export async function getMessagesByRoom(req: Request, res: Response): Promise<void> {
    try {
        const { roomId } = req.params;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

        if (!roomId) {
            res.status(400).json({ message: "Room ID is required" });
            return;
        }

        const messages = await chatService.getMessagesByRoom(roomId, limit);

        // Format messages for frontend compatibility
        const formattedMessages = messages.map(msg => ({
            id: msg.id,
            text: msg.message,
            sender: msg.author.toString(),
            timestamp: msg.time
        }));

        res.status(200).json({ messages: formattedMessages });
    } catch (error) {
        console.error("Error getting chat history:", error);
        res.status(500).json({ message: "Error retrieving chat messages", error });
    }
}

/**
 * Create a new message via REST API (alternative to socket for non-realtime needs)
 */
export async function saveMessage(req: RequestExt, res: Response): Promise<void> {
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

        const savedMessage = await chatService.saveMessage(messageData);

        res.status(201).json(savedMessage);
    } catch (error) {
        console.error("Error creating message:", error);
        res.status(500).json({ message: "Error creating message", error });
    }
}

export async function getCompanyChats(req: Request, res: Response): Promise<void> {
    try {
        const { companyId } = req.params;

        if (!companyId) {
            res.status(400).json({ message: "Company ID is required" });
            return;
        }

        const rooms = await chatService.getCompanyChats(companyId);

        res.status(200).json({
            success: true,
            count: rooms.length,
            rooms
        });

    } catch (error) {
        console.error("Error getting company chats:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving company chats",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}