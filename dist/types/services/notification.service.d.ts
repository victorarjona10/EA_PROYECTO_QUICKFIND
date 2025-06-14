import { IOrder } from "../models/order";
import { INotification } from "../models/notification";
import mongoose from "mongoose";
export declare class NotificationService {
    private userService;
    private companyService;
    private userSockets;
    private listenersInitialized;
    constructor();
    initializeListeners(): void;
    private setupSocketListeners;
    private sendPendingNotifications;
    sendNotification(order: IOrder, type: "new_order" | "order_status_update", newStatus?: string): Promise<void>;
    markAsRead(notificationId: string, userId: string): Promise<boolean>;
    getUserNotifications(userId: string, limit?: number, offset?: number, onlyUnread?: boolean): Promise<(mongoose.Document<unknown, {}, INotification, {}> & INotification & Required<{
        _id: mongoose.Schema.Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    deleteOldNotifications(daysOld?: number): Promise<number>;
    readNotifications(userId: string): Promise<void>;
}
export declare const notificationService: NotificationService;
