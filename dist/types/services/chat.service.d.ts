import { IChatMessage } from "../models/chatMessage";
import { ChatMessage } from "../socket";
export declare class ChatService {
    saveMessage(messageData: ChatMessage): Promise<IChatMessage>;
    getMessagesByRoom(roomId: string, limit?: number): Promise<IChatMessage[]>;
    getCompanyChats(companyId: string): Promise<string[]>;
}
export declare const chatService: ChatService;
