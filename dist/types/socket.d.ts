import { Server as SocketIOServer } from "socket.io";
import { Server } from "http";
export declare function initializeSocketIO(server: Server): SocketIOServer<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export declare function getIO(): SocketIOServer;
export interface ChatMessage {
    id?: string;
    room: string;
    author: string;
    message: string;
    time: string;
}
export declare function initializeChatService(): import("socket.io").Namespace<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export declare function getChatNamespace(): import("socket.io").Namespace<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
