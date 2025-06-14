import { Schema, ObjectId } from "mongoose";
export interface IChatMessage {
    _id?: ObjectId;
    id?: string;
    room: string;
    author: Schema.Types.ObjectId;
    message: string;
    time: Date;
}
export declare const ChatMessageModel: import("mongoose").Model<IChatMessage, {}, {}, {}, import("mongoose").Document<unknown, {}, IChatMessage, {}> & IChatMessage & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, Schema<IChatMessage, import("mongoose").Model<IChatMessage, any, any, any, import("mongoose").Document<unknown, any, IChatMessage, any> & IChatMessage & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IChatMessage, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<IChatMessage>, {}> & import("mongoose").FlatRecord<IChatMessage> & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}>>;
export default ChatMessageModel;
