import { Schema, model, ObjectId } from "mongoose";

export interface IFeedback {
  _id: ObjectId;
  user_id: ObjectId;
  title: string;
  message: string;
  type: string; // "error", "suggestion", "rating"
  rating?: number; // opcional, solo para valoraciones
  created_at: Date;
  status: string; // "pending", "reviewed", "resolved"
}

const feedbackSchema = new Schema<IFeedback>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["error", "suggestion", "rating"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: function () {
      return this.type === "rating";
    },
  },
  created_at: { type: Date, default: Date.now },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "reviewed", "resolved"],
  },
});

export const FeedbackModel = model<IFeedback>("Feedback", feedbackSchema);
