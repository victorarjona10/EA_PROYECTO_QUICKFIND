import { Schema, model, ObjectId } from "mongoose";

export interface IChatMessage {
    _id?: ObjectId;
    id?: string;
    room: string;
    author: Schema.Types.ObjectId;
    message: string;
    time: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
    {
        id: {
            type: String,
            index: true // For faster queries by room
        },
        room: {
            type: String,
            required: true,
            index: true // For faster queries by room
        },
        author: {
            type: Schema.Types.ObjectId,
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
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export const ChatMessageModel = model("chat_messages", ChatMessageSchema);
export default ChatMessageModel;