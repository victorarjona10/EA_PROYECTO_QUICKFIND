import { FeedbackModel, IFeedback } from "../models/feedback";
import mongoose from "mongoose";

export class FeedbackService {
  // Crear un nuevo feedback
  async createFeedback(feedback: Partial<IFeedback>): Promise<IFeedback> {
    try {
      const newFeedback = new FeedbackModel(feedback);
      return await newFeedback.save();
    } catch (error: any) {
      console.error("Error creating feedback:", error);
      throw error;
    }
  }

  // Obtener todos los feedbacks
  async getAllFeedback(
    page: number = 1,
    limit: number = 20
  ): Promise<IFeedback[]> {
    const skip = (page - 1) * limit;
    return await FeedbackModel.find()
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user_id", "name email")
      .exec();
  }

  // Obtener un feedback por ID
  async getFeedbackById(id: string): Promise<IFeedback | null> {
    return await FeedbackModel.findById(id)
      .populate("user_id", "name email")
      .exec();
  }

  // Obtener feedbacks de un usuario específico
  async getFeedbackByUserId(userId: string): Promise<IFeedback[]> {
    return await FeedbackModel.find({
      user_id: new mongoose.Types.ObjectId(userId),
    })
      .sort({ created_at: -1 })
      .exec();
  }

  // Actualizar el estado de un feedback
  async updateFeedbackStatus(
    id: string,
    status: string
  ): Promise<IFeedback | null> {
    return await FeedbackModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).exec();
  }

  // Eliminar un feedback
  async deleteFeedback(id: string): Promise<IFeedback | null> {
    return await FeedbackModel.findByIdAndDelete(id).exec();
  }
}
