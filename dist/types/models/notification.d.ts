import { ObjectId, Schema } from "mongoose";
export interface INotification {
    _id: ObjectId;
    recipient_id: ObjectId;
    sender_id?: ObjectId;
    related_id?: ObjectId;
    type: string;
    message: string;
    read: boolean;
    created_at: Date;
}
export declare const NotificationModel: import("mongoose").Model<INotification, {}, {}, {}, import("mongoose").Document<unknown, {}, INotification, {}> & INotification & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, any>;
