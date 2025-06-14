import { Request, Response } from "express";
export declare function createFeedback(req: Request, res: Response): Promise<void>;
export declare function getAllFeedback(req: Request, res: Response): Promise<void>;
export declare function getFeedbackById(req: Request, res: Response): Promise<void>;
export declare function getFeedbackByUserId(req: Request, res: Response): Promise<void>;
export declare function updateFeedbackStatus(req: Request, res: Response): Promise<void>;
export declare function deleteFeedback(req: Request, res: Response): Promise<void>;
