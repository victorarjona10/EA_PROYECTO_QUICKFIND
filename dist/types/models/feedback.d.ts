import { Schema, ObjectId } from "mongoose";
export interface IFeedback {
    _id: ObjectId;
    user_id: ObjectId;
    title: string;
    message: string;
    type: string;
    rating?: number;
    created_at: Date;
    status: string;
}
export declare const FeedbackModel: import("mongoose").Model<IFeedback, {}, {}, {}, import("mongoose").Document<unknown, {}, IFeedback, {}> & IFeedback & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, any>;
