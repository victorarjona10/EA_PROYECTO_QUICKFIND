import { IFeedback } from "../models/feedback";
export declare class FeedbackService {
    createFeedback(feedback: Partial<IFeedback>): Promise<IFeedback>;
    getAllFeedback(page?: number, limit?: number): Promise<IFeedback[]>;
    getFeedbackById(id: string): Promise<IFeedback | null>;
    getFeedbackByUserId(userId: string): Promise<IFeedback[]>;
    updateFeedbackStatus(id: string, status: string): Promise<IFeedback | null>;
    deleteFeedback(id: string): Promise<IFeedback | null>;
}
